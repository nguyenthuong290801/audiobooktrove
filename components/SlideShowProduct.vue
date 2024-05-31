<template>
    <div class="max-w-6xl mx-auto px-3 py-5 bg-white p-3 shadow rounded-md my-3">
        <div class="text-base font-semibold mb-4 text-center">{{ formatLabel(category) }}</div>
        <swiper v-if="products.length > 0" :slidesPerView="slidesPerView" :breakpoints="breakpoints" :spaceBetween="10"
            :loop="true" :pagination="{
                clickable: true,
            }" :navigation="true" :modules="modules" class="mySwiper">
            <swiper-slide v-for="product in products" :key="product.id"
                class="rounded-md border-[1px] m-1 p-2 overflow-hidden">
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
                    <div class="overflow-hidden">
                        <NuxtLink :to="'/audiobooks/' + handleSlug(product.name)"
                            class="w-48 h-48 shadow card_box_slide" :style="promotionStyle(product)">
                            <NuxtImg :src="product.image" class="rounded-md w-full h-full object-cover"
                                :alt="product.name" />
                        </NuxtLink>
                    </div>
                    <div class="my-2">
                        <div class="text-sm font-medium text-black">
                            {{ product.name }}
                        </div>
                        <div class="text-sm text-sub">
                            By: {{ product.by }}
                        </div>
                        <div class="text-sm text-sub">
                            Narrated by:{{ product.narrated_by }}
                        </div>
                    </div>
                </a-tooltip>
                <div class="overflow-hidden rounded-md shadow">
                    <NuxtLink :to="'/audiobooks/' + handleSlug(product.name)" class="block lg:hidden card_box"
                        :style="promotionStyle(product)">
                        <NuxtImg :src="product.image" class="w-full h-full object-cover" :alt="product.name" />
                    </NuxtLink>
                </div>
                <div class="my-2 block lg:hidden">
                    <div class="text-sm font-medium text-black">
                        {{ product.name }}
                    </div>
                    <div class="text-sm text-sub">
                        By: {{ product.by }}
                    </div>
                    <div class="text-sm text-sub">
                        Narrated by:{{ product.narrated_by }}
                    </div>
                </div>
            </swiper-slide>
        </swiper>
        <div v-else>
            <div class="flex flex-col items-center justify-center">
                <IconsEmpty class="w-20 h-20 text-main" />
                <span class="text-sm">There are no products</span>
            </div>
        </div>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';

export default {
    components: {
        Swiper,
        SwiperSlide,
    },
    props: {
        slidesPerView: {
            type: Number,
        },
        breakpoints: {
            type: Object,
        },
        products: {
            type: Object,
        },
        category: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            promotion: null,
        }
    },
    mounted() {
        this.handlePromotion();
    },
    methods: {
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
        formatLabel(label) {
            return label
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
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
            return {
                '--promotion-content': `'Sale ${promotion.discount}%'`,
            };
        },
    },
    setup() {
        const modules = [Navigation, Pagination, Mousewheel, Keyboard];
        return {
            modules,
        };
    }
};
</script>