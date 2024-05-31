<template>
    <Button class="bg-red-500 text-white p-3" @click="handleCheckOut">Checkout</Button>
</template>

<script setup>
import { reactive } from 'vue';
const cartStore = reactive({
    products: [
        { id: 'prod_PwfpxNJv2GFMJY', name: 'Giày sneakers', price: 3000, quantity: 2 },
        { id: 'prod_PwfpxNJv2GFMJY', name: 'Giày sneakers', price: 3000, quantity: 2 },
        { id: 'prod_PwfpxNJv2GFMJY', name: 'Giày sneakers', price: 3000, quantity: 2 },
    ]
});

const handleCheckOut = async () => {
    const { csrf } = useCsrf();
    const csrfToken = csrf;
    if (csrfToken) {
        const response = await $fetch('/api/payment/adHoc', {
            method: "POST",
            body: JSON.stringify({
                products: cartStore.products.map((product) => ({
                    price_data: {
                        currency: 'USD',
                        product_data: {
                            name: product.name,
                        },
                        unit_amount: product.price * 100,
                    },
                    quantity: product.quantity,
                }))
            }),
            headers: {
                'Content-Type': 'application/json',
                'Csrf-Token': csrfToken,
            },
        });

        if (response.url) {
            window.location = response.url
        }
    }
};
</script>