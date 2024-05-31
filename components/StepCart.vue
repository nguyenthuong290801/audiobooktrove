<template>
    <div class="bg-white shadow rounded-md overflow-hidden p-2">
        <div class="flex flex-wrap lg:flex-nowrap gap-5">
            <div class="basis-full lg:basis-9/12">
                <div class="mb-2 border-b-[1px] border-black">
                    <div class="text-sm font-medium">Items ({{ countCart }})</div>
                </div>
                <div v-if="isDataProduct && !isEmpty" class="flex gap-3">
                    <div class="basis-full">
                        <div class="mb-2 bg-slate-100 p-1 rounded-md">
                            <a-checkbox type="checkbox" @change="toggleSelectProductAll"
                                :checked="selectedProducts.length === productCart.length && selectedProducts.length != 0" />
                        </div>
                        <div class="flex flex-col gap-3">
                            <div v-for="product in productCart" :key="product.id" class="flex gap-3">
                                <div class="flex gap-3">
                                    <a-checkbox type="checkbox" :value="product.id"
                                        @change="toggleSelectProduct(product.id)"
                                        :checked="selectedProducts.includes(product.id)" />
                                    <NuxtLink :to="'/audiobooks/' + handleSlug(product.name)"
                                        class="rounded-md w-40 h-40 overflow-hidden shadow card_box"
                                        :style="promotionStyle(product)">
                                        <NuxtImg :src="product.image" class="w-full object-cover" :alt="product.name" format="webp" placeholder preload loading="lazy" />
                                    </NuxtLink>
                                </div>
                                <div>
                                    <div class="text-sm font-semibold">{{ product.name }}</div>
                                    <div class="text-sm">By: {{ product.by }}</div>
                                    <div class="text-sm">
                                        <div
                                            :class="{ 'line-through text-sub': discountedPrice[product.id] && !promotionExpired[product.id] }">
                                            Regular price ${{ product.price }}</div>
                                        <div v-if="discountedPrice[product.id]"
                                            :class="{ 'line-through text-sub': promotionExpired[product.id] }">Reduced
                                            to ${{
                                                discountedPrice[product.id] }}</div>
                                    </div>
                                    <div class="w-40" v-if="countDown[product.id]">
                                        <Countdown :endTime="countDown[product.id]" :productId="product.id"
                                            @expired="handleExpired" />
                                    </div>
                                    <Button class="mt-2 rounded-md bg-sub p-1 flex gap-1 shadow items-center"
                                        @click="handleApiCartRemove(product.id)" aria-label="button remove cart">
                                        <i class="pi pi-trash text-sm"></i>
                                        <span class="text-sm">Delete</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="!isDataProduct" class="basis-full lg:basis-9/12">
                    <div class="flex justify-center">
                        <SkeletonCart />
                    </div>
                </div>
                <div v-if="isEmpty" class="flex flex-col items-center justify-center">
                    <IconsEmpty class="w-20 h-20 text-main" />
                    <span class="text-sm">There are no products in cart</span>
                </div>
            </div>
            <div class="basis-full lg:basis-3/12">
                <div class="mb-2 border-b-[1px] border-black">
                    <div class="text-sm font-medium">Summary</div>
                </div>
                <div class="flex justify-between items-center">
                    <div class="text-sm">
                        Item total:
                    </div>
                    <div class="text-sm font-bold text-main">
                        ${{ parseFloat(totalPrice.toFixed(2)) }}
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-end mt-3">
            <a-alert v-if="existProduct" class="text-xs" message="One or more products have already been paid for."
                type="error" />
        </div>
        <div class="flex pt-4 justify-between">
            <Button v-if="totalPrice > 0" class="button_hero--secondary" @click="handleCartRemoveChecked()" aria-label="button checked">
                <i class="pi pi-trash"></i>
                <span class="text-sm">Delete checked</span>
            </Button>
            <Button v-if="totalPrice > 0" class="button_hero flex items-center" :disabled="isPendingPay"
                @click="handlePayment()" aria-label="button payment">
                <span class="text-sm">{{ isPendingPay ? 'Checking out' : 'Checkout' }}</span>
                <i v-if="!isPendingPay" class="pi pi-credit-card"></i>
                <IconsTadpole class="mt-1" v-if="isPendingPay" />
            </Button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        products: {
            type: Object,
        },
    },
    data() {
        return {
            active: 0,
            productCart: [],
            countCart: 0,
            promotion: null,
            discountedPrice: [],
            countDown: [],
            selectedProducts: [],
            totalPrice: 0,
            isDataProduct: false,
            isEmpty: false,
            promotionExpired: [],
            existProduct: false,
            isPendingPay: false,
        }
    },
    mounted() {
        if (this.products) {
            this.handleApiCart();
        }
        this.handlePromotion();
    },
    methods: {
        updateTotalPrice() {
            this.totalPrice = this.selectedProducts.reduce((total, productId) => {
                const product = this.productCart.find(p => p.id === productId);
                const price = this.discountedPrice[productId] && !this.promotionExpired[productId] ? parseFloat(this.discountedPrice[productId]) : parseFloat(product.price);
                return total + price;
            }, 0);
        },
        toggleSelectProductAll() {
            if (this.selectedProducts.length === this.productCart.length) {
                this.selectedProducts = [];
            } else {
                this.selectedProducts = this.productCart.map(product => product.id);
            }
            this.updateTotalPrice();
        },
        toggleSelectProduct(productId) {
            const index = this.selectedProducts.indexOf(productId);

            if (index === -1) {
                this.selectedProducts.push(productId);
            } else {
                this.selectedProducts.splice(index, 1);
            }
            this.updateTotalPrice();
        },
        async handleCartRemoveChecked() {
            const cartCookie = useCookie('cart');
            const cartItems = cartCookie.value;
            if (cartItems && cartItems.length > 0) {
                const checkedItemIds = this.selectedProducts;
                const remainingItems = cartItems.filter(item => !checkedItemIds.includes(item.id));
                const remainingItemIds = remainingItems.map(item => item.id);
                this.productCart = this.productCart.filter(product => remainingItemIds.includes(product.id));
                this.selectedProducts = this.selectedProducts.filter(id => remainingItemIds.includes(id));
                this.countCart = this.productCart.length;
                const { csrf } = useCsrf();
                const csrfToken = csrf;
                if (csrfToken) {
                    try {
                        const cartResponse = await $fetch('/api/cart/all', {
                            method: 'DELETE',
                            body: {
                                ids: checkedItemIds,
                            },
                            headers: {
                                'Content-Type': 'application/json',
                                'Csrf-Token': csrfToken,
                            },
                        })

                        if (cartResponse.statusCode == 200) {
                            console.log(cartResponse);
                            this.updateTotalPrice();
                            this.handleRemoveCart();
                        }
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                } else {
                    console.error('CSRF token not available');
                }
            }
        },
        async handleApiCartRemove(productId) {
            const { csrf } = useCsrf();
            const csrfToken = csrf;
            if (csrfToken) {
                try {
                    const cartResponse = await $fetch('/api/cart', {
                        method: 'DELETE',
                        body: {
                            id: productId,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            'Csrf-Token': csrfToken,
                        },
                    })
                    if (cartResponse.statusCode == 200) {
                        this.productCart = this.productCart.filter(product => product.id !== productId);
                        this.countCart = this.productCart.length;
                        this.selectedProducts = this.selectedProducts.filter(id => id !== productId);
                        this.updateTotalPrice();
                        const cartCookie = useCookie('cart');
                        this.handleRemoveCart(cartCookie.value.length);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                console.error('CSRF token not available');
            }
        },
        async handleApiCart() {
            const { csrf } = useCsrf();
            const csrfToken = csrf;
            if (csrfToken) {
                try {
                    const cartResponse = await $fetch('/api/cart/products', {
                        method: 'POST',
                        body: {
                            ids: this.products,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            'Csrf-Token': csrfToken,
                        },
                    })
                    if (cartResponse.data) {
                        this.productCart = cartResponse.data.data;
                        this.countCart = this.productCart.length;
                        this.isDataProduct = true;

                        if (cartResponse.data.data.length == 0) {
                            this.isEmpty = true;
                        } else {
                            this.isEmpty = false;
                        }
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                console.error('CSRF token not available');
            }
        },
        handleRemoveCart(number) {
            if (isNaN(number)) {
                const cartCookie = useCookie('cart');
                number = cartCookie.value.length;
            }
            if(number == 0) {
                this.isEmpty = true;
            } else {
                this.isEmpty = false;
            }
            this.$store.dispatch('addToCart', number);
        },
        handleSlug(string) {
            const { $createSlug } = useNuxtApp();
            return $createSlug(string);
        },
        async handlePromotion() {
            const { csrf } = useCsrf();
            const csrfToken = csrf;
            if (csrfToken) {
                try {
                    const promotionResponse = await $fetch('/api/promotion', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Csrf-Token': csrfToken,
                        },
                    })
                    if (promotionResponse.data) {
                        this.promotion = promotionResponse.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                console.error('CSRF token not available');
            }
        },
        promotionStyle(product) {
            if (!this.promotion) return {};
            const promotionUse = this.promotion.promotionUse.find(item => product.id === item.product_id);
            if (!promotionUse) return {};
            const promotion = this.promotion.promotion.find(item => item.id === promotionUse.id);
            if (!promotion) return {};

            const discount = promotion.discount;
            this.countDown[product.id] = promotion.end;
            this.discountedPrice[product.id] = parseFloat((product.price * (1 - discount / 100)).toFixed(2));

            return {
                '--promotion-content': `'Sale ${discount}%'`,
            };
        },
        handleExpired(productId) {
            const promotion = this.productCart.find(p => p.id === productId);
            if (promotion) {
                this.promotionExpired[productId] = true;
                this.updateTotalPrice();
            }
        },
        async handlePayment() {
            this.isPendingPay = true;
            const user = useSupabaseUser();
            const { csrf } = useCsrf();
            const csrfToken = csrf;
            if (csrfToken) {
                const response = await $fetch('/api/payment/adHoc', {
                    method: "POST",
                    body: {
                        'ids': this.selectedProducts,
                        'email': user.value.email
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Csrf-Token': csrfToken,
                    },
                });

                if (response) {
                    window.location.href = response.url;
                } else {
                    this.isPendingPay = false;
                    this.existProduct = true;
                }
            }
        }
    }
}
</script>

<style scoped>
.p-stepper {
    flex-basis: 40rem;
}
</style>
