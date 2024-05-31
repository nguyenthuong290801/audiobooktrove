import { useServerStripe } from "#stripe/server";
import { serverSupabaseServiceRole } from '#supabase/server'
interface Product {
    name: string;
    price: string;
    image: string;
}
interface ApiResponse {
    products: Product[];
    data: [];
}
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const client = serverSupabaseServiceRole(event);
    const stripe = await useServerStripe(event);
    const runtimeConfig = useRuntimeConfig();
    const api = runtimeConfig.api;
    const params = new URLSearchParams();
    const url = `${api}/carts`;
    const urlPromotion = `${api}/promotion`;
    const urlTimezone = `${api}/timezone`;
    const urlTransaction = `${api}/storeTransaction`;
    let ids = body.ids || null;

    if (ids && Array.isArray(ids)) {
        const idsString = ids.join(',');
        params.append('ids', idsString);
    }

    const profile = await client
        .from('profiles')
        .select("*")
        .eq('email', body.email)

    const roleProfile = profile.data[0].role_id;
    const idProfile = profile.data[0].id;

    try {
        const res = await $fetch<ApiResponse>(`${url}?${params.toString()}`);
        const resPromotion = await $fetch(urlPromotion);
        const resTimezone = await $fetch(urlTimezone);

        if (res && !resPromotion.error) {
            const today = resTimezone.current_time;
            res.data.forEach((product: any) => {
                const promotionUseProduct = resPromotion.data.promotionUse.find((item: any) => product.id === item.product_id);
                const promotionUseRole = resPromotion.data.promotionUse.find((item: any) => roleProfile === item.role_id);

                let finalPrice = parseFloat(product.price);

                if (promotionUseProduct || promotionUseRole) {
                    const promotionProduct = promotionUseProduct ? resPromotion.data.promotion.find((item: any) => item.id === promotionUseProduct.id) : null;
                    const promotionRole = promotionUseRole ? resPromotion.data.promotion.find((item: any) => item.id === promotionUseRole.id) : null;

                    if (promotionProduct && promotionProduct.end > today) {
                        const discount = promotionProduct.discount;
                        finalPrice = parseFloat((finalPrice * (1 - discount / 100)).toFixed(2));
                    }

                    if (promotionRole && promotionRole.end > today) {
                        const discount = promotionRole.discount;
                        finalPrice = parseFloat((finalPrice * (1 - discount / 100)).toFixed(2));
                    }
                }

                product.price = finalPrice;
            });
        }

        let products = res.data.map((product: Product) => ({
            price_data: {
                currency: 'USD',
                product_data: {
                    name: product.name,
                    images: [product.image]
                },
                unit_amount: parseFloat(product.price) * 100,
            },
            quantity: 1,
        }))

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: products,
            mode: 'payment',
            success_url: 'http://localhost:3000/profile',
            cancel_url: 'http://localhost:3000/cart',
        });
        
        if (session) {
            const resTransaction = await $fetch(urlTransaction, {
                method: "POST",
                body: {
                    'product_id': ids,
                    'profile_id': idProfile,
                    'id_order': session.id
                },
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            
            if (resTransaction.success) {
                return session;
            } else {
                return false;
            }
        }
    } catch (error) {
        return sendError(event, createError({
            statusCode: 500,
            message: 'Error fetching carts.'
        }));
    }
});