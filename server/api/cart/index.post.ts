interface CartItem {
    id: number;
}

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        let { id }: { id: number } = body;

        let getCarts = getCookie(event, 'cart');

        if (getCarts === undefined) {
            const cart: CartItem[] = [{ id }];
            setCookie(event, 'cart', JSON.stringify(cart));
            return {
                statusCode: 201,
                message: 'Success insert cookie cart.',
            }
        } else {
            let allCarts: CartItem[] = JSON.parse(getCarts);
            const index: number = allCarts.findIndex((item: CartItem) => item.id === id);

            if (index !== -1) {
                return {
                    statusCode: 201,
                    message: 'Product already exists.',
                }
            } else {
                allCarts.push({ id });
                setCookie(event, 'cart', JSON.stringify(allCarts));
                return {
                    statusCode: 201,
                    message: 'Success insert cookie cart.',
                }
            }
        }
    } catch (err) {
        return sendError(event, createError({
            statusCode: 500,
            message: 'An error occurred while adding the product to your cart'
        }));
    }
});

