<template>
    <div class="flex flex-wrap gap-3">
        <div v-if="products.data" v-for="product in products.data.data" :key="product.id"
            class="rounded-md overflow-hidden p-2 basis-full bg-white shadow flex gap-3"
            :style="promotionStyle(product)">
            <div class="flex gap-3 basis-full lg:basis-8/12 items-start">
                <div class="flex flex-col justify-center gap-2 relative">
                    <a-tooltip placement="right" color="#fafafa" class="hidden lg:block">
                        <template #title>
                            <div class="p-1">
                                <div class="text-sm text-left font-semibold my-2 text-black">
                                    {{ product.name }}
                                </div>
                                <div class="text-sm text-left font-normal my-2">
                                    <span class="text-sub">By: </span>
                                    <span class="text-main border-b-[1px] border-orange-500">{{ product.by }}</span>
                                </div>
                                <div class="text-sm text-left font-normal my-2">
                                    <span class="text-sub">Narrated by: </span>
                                    <span class="text-main border-b-[1px] border-orange-500">{{ product.narrated_by
                                        }}</span>
                                </div>
                                <div v-if="product.series && product.series_number"
                                    class="text-sm text-left font-normal my-2">
                                    <span class="text-sub">Series: </span>
                                    <span class="text-main border-b-[1px] border-orange-500">
                                        {{ product.series }}, {{ product.series_number }}
                                    </span>
                                </div>
                                <div class="text-sm text-left font-normal my-2 text-black">
                                    <span class="text-sub">Length:</span> {{ product.length }}
                                </div>
                                <div class="text-sm text-left font-normal my-2 text-black">
                                    <span class="text-sub">Release date:</span> {{ formatDate(product.release_date) }}
                                </div>
                                <div class="text-sm text-left font-normal my-2 text-black">
                                    <span class="text-sub">Language:</span> {{ product.language }}
                                </div>
                                <div class="text-sm text-left font-normal my-2">
                                    <span class="text-sub">Publisher: </span>
                                    <span class="text-main border-b-[1px] border-orange-500">{{ product.publisher
                                        }}</span>
                                </div>
                                <div class="text-sm text-left font-normal my-2 text-black">
                                    <span class="text-sub">Description:</span>
                                    <p v-html="product.description"></p>
                                </div>
                            </div>
                        </template>
                        <NuxtLink :to="'/audiobooks/' + handleSlug(product.name)"
                            class="rounded-md  w-48 h-48 overflow-hidden shadow card_box">
                            <NuxtImg :src="product.image" class="w-full h-full object-cover" :alt="product.name" format="webp" placeholder preload loading="lazy" />
                        </NuxtLink>
                    </a-tooltip>
                    <NuxtLink :to="'/audiobooks/' + handleSlug(product.name)"
                        class="rounded-md w-40 h-40 lg:w-48 lg:h-48 overflow-hidden shadow block lg:hidden card_box">
                        <NuxtImg :src="product.image" class="w-full h-full object-cover" :alt="product.name" format="webp" placeholder preload loading="lazy" />
                    </NuxtLink>
                    <Button :disabled="isLoad[product.audio_object_key]"
                        @click.prevent="toggleAudio(product.audio_object_key)"
                        class="button-row shadow cursor-pointer p-2 rounded-md" aria-label="button play audio">
                        <div :class="{ 'is-active': isActive[product.audio_object_key] }"
                            class="shadow button-au | button-au--toggle button-au--play">
                            <IconsPlay class="ph-play" />
                            <IconsPause class="ph-pause" />
                        </div>
                        <div v-if="!isLoad[product.audio_object_key]" class="text-xs">
                            {{ sampleTime[product.audio_object_key] === undefined ? 'Sample' :
                                sampleTime[product.audio_object_key] }}
                        </div>
                        <div v-if="isLoad[product.audio_object_key]">
                            <IconsTadpole />
                        </div>
                    </Button>
                </div>
                <div class="">
                    <div class="text-lg text-left font-semibold">
                        {{ product.name }}
                    </div>
                    <div class="text-sm text-left font-normal my-2">
                        <span class="text-sub">By: </span>
                        <span class="text-main border-b-[1px] border-orange-500">{{ product.by }}</span>
                    </div>
                    <div class="text-sm text-left font-normal my-2">
                        <span class="text-sub">Narrated by: </span>
                        <span class="text-main border-b-[1px] border-orange-500">{{ product.narrated_by }}</span>
                    </div>
                    <div v-if="product.series && product.series_number" class="text-sm text-left font-normal my-2">
                        <span class="text-sub">Series: </span>
                        <span class="text-main border-b-[1px] border-orange-500">
                            {{ product.series }}, {{ product.series_number }}
                        </span>
                    </div>
                    <div class="text-sm text-left font-normal my-2">
                        <span class="text-sub">Length:</span> {{ product.length }}
                    </div>
                    <div class="text-sm text-left font-normal my-2">
                        <span class="text-sub">Release date:</span> {{ formatDate(product.release_date) }}
                    </div>
                    <div class="text-sm text-left font-normal my-2">
                        <span class="text-sub">Language:</span> {{ product.language }}
                    </div>
                    <div class="text-sm text-left font-normal my-2">
                        <span class="text-sub">Publisher: </span>
                        <span class="text-main border-b-[1px] border-orange-500">{{ product.publisher }}</span>
                    </div>
                </div>
            </div>
            <div class="hidden lg:block lg:basis-4/12">
                <div
                    class="text-sm text-center text-nowrap my-2 font-medium px-1 py-2 bg-white border-4 border-dashed border-orange-500 rounded-full text-black shadow-md">
                    <div
                        :class="{ 'line-through text-sub': discountedPrice[product.id] && !promotionExpired[product.id] }">
                        Regular
                        price ${{ product.price }}</div>
                    <div v-if="discountedPrice[product.id]"
                        :class="{ 'line-through text-sub': promotionExpired[product.id] }">
                        Reduced to ${{ discountedPrice[product.id] }}</div>
                </div>
                <div class="" v-if="countDown[product.id]">
                    <Countdown :endTime="countDown[product.id]" :productId="product.id" @expired="handleExpired" />
                </div>
                <Button :disabled="addCart[product.id]" class="CartBtn my-1 w-full justify-center shadow"
                    @click="handleAddToCart(product)" aria-label="button add to cart">
                    <span class="IconContainer">
                        <IconsCart class="text-black" />
                    </span>
                    <span class="text-sm text-black text-nowrap">
                        <div class="" v-if="!addCart[product.id]">
                            Add to cart
                        </div>
                        <div class="flex items-center gap-2" v-if="addCart[product.id]">
                            <IconsCart class="text-black" />In cart
                        </div>
                    </span>
                </Button>
                <Button class="BuyBtn my-1 w-full justify-center shadow" @click="handleBuyNow(product)">
                    <span class="IconContainer" aria-label="button buy now">
                        <IconsSend class="text-white" />
                    </span>
                    <span class="text-sm text-white text-nowrap">
                        Buy now
                    </span>
                </Button>
            </div>
        </div>
    </div>
</template>

<script>
import { Howl } from 'howler';
export default {
    props: {
        products: {
            type: Object,
        },
    },
    mounted() {
        this.handlePromotion();
        this.handleCheckCart();
    },
    data() {
        return {
            isActive: {},
            remainingTime: {},
            timer: {},
            sampleTime: {},
            sound: {},
            isLoad: {},
            isLeaving: false,
            promotion: null,
            discountedPrice: [],
            countDown: [],
            addCart: [],
            promotionExpired: [],
            currentAudioKey: null,
        };
    },
    methods: {
        toggleAudio(audioKey) {
            if (this.currentAudioKey && this.currentAudioKey !== audioKey) {
                this.sound[this.currentAudioKey].stop();
                clearInterval(this.timer[this.currentAudioKey]);
                this.isActive[this.currentAudioKey] = false;
                this.remainingTime[this.currentAudioKey] = null;
            }

            this.isLoad[audioKey] = true;
            if (!this.sound[audioKey]) {
                this.sound[audioKey] = new Howl({
                    src: [audioKey],
                    loop: false,
                    duration: 150000,
                    onload: () => {
                        this.startAudio(audioKey);
                    },
                });
            } else {
                this.startAudio(audioKey);
            }

            if (this.sound) {
                this.$store.dispatch('addToSound', this.sound);
            }

            this.currentAudioKey = audioKey;
        },
        startAudio(audioKey) {
            this.isLoad[audioKey] = false;
            if (this.sound[audioKey].playing()) {
                this.isActive[audioKey] = false;
                this.remainingTime[audioKey] = this.sound[audioKey].seek();
                this.sound[audioKey].pause();
                clearInterval(this.timer[audioKey]);
            } else {
                this.isActive[audioKey] = true;

                if (this.remainingTime[audioKey] !== null) {
                    this.remainingTime[audioKey] = 120 - this.remainingTime[audioKey];
                    if (isNaN(this.remainingTime[audioKey])) {
                        this.remainingTime[audioKey] = 120;
                    }
                } else {
                    this.remainingTime[audioKey] = this.sound[audioKey].duration;
                }

                this.sampleTime[audioKey] = this.formatTime(this.remainingTime[audioKey]);

                if (this.sampleTime[audioKey] == 'NaN:NaN') {
                    this.remainingTime[audioKey] = 120;
                    this.sampleTime[audioKey] = this.formatTime(this.remainingTime[audioKey]);
                }

                this.sound[audioKey].play();
                this.timer[audioKey] = setInterval(() => {
                    this.remainingTime[audioKey]--;
                    if (this.remainingTime[audioKey] >= 0) {
                        this.sampleTime[audioKey] = this.formatTime(this.remainingTime[audioKey]);
                    } else {
                        clearInterval(this.timer[audioKey]);
                        this.isActive[audioKey] = false;
                        this.sound[audioKey].stop();
                    }
                }, 1000);
            }
        },
        formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        },
        formatDate(time) {
            const date = new Date(time);
            const year = date.toLocaleString("default", { year: "numeric" });
            const month = date.toLocaleString("default", { month: "2-digit" });
            const day = date.toLocaleString("default", { day: "2-digit" });
            return `${day}/${month}/${year}`;
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
        async handleCheckCart() {
            const { csrf } = useCsrf();
            const csrfToken = csrf;
            if (csrfToken) {
                try {
                    const cartResponse = await $fetch('/api/cart', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Csrf-Token': csrfToken,
                        },
                    })
                    if (cartResponse.data) {
                        const cart = JSON.parse(cartResponse.data);
                        cart.forEach(item => {
                            this.addCart[item.id] = true;
                        });
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                console.error('CSRF token not available');
            }
        },
        async handleAddToCart(product) {
            const { csrf } = useCsrf();
            const csrfToken = csrf;
            if (csrfToken) {
                try {
                    const productResponse = await $fetch('/api/cart', {
                        method: 'POST',
                        body: {
                            id: product.id
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            'Csrf-Token': csrfToken,
                        },
                    })
                    if (productResponse) {
                        this.addCart[product.id] = true;
                        const cartCookie = useCookie('cart');
                        this.$store.dispatch('addToCart', cartCookie.value.length);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                console.error('CSRF token not available');
            }
        },
        async handleBuyNow(product) {
            const { csrf } = useCsrf();
            const csrfToken = csrf;
            if (csrfToken) {
                try {
                    const productResponse = await $fetch('/api/cart', {
                        method: 'POST',
                        body: {
                            id: product.id
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            'Csrf-Token': csrfToken,
                        },
                    })
                    if (productResponse) {
                        this.addCart[product.id] = true;
                        const cartCookie = useCookie('cart');
                        this.$store.dispatch('addToCart', cartCookie.value.length);
                        this.$router.push('/cart');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                console.error('CSRF token not available');
            }
        },
        handleExpired(productId) {
            const promotion = this.products.data.data.find(p => p.id === productId);
            if (promotion) {
                this.promotionExpired[productId] = true;
            }
        }
    },
};
</script>
