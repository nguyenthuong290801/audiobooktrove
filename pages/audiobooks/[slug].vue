<template>
    <div class="mx-auto max-w-6xl my-3 px-2 lg:px-0">
        <div class="flex flex-wrap justify-between">
            <BreadCrumb />
        </div>
        <div v-if="isData">
            <ProductDetail :product="products.data.product" />
            <div class="bg-white rounded-md shadow my-3 p-3">
                <Fieldset legend="Publisher description" :toggleable="true">
                    <p class="text-sm" v-html="products.data.product.publisher_description"></p>
                </Fieldset>
            </div>
            <div class="bg-white rounded-md shadow my-3 p-3">
                <Fieldset :legend="'About' + ' ' + products.data.product.name" :toggleable="true">
                    <p class="text-sm" v-html="products.data.product.about_by"></p>
                </Fieldset>
            </div>
            <div class="bg-white rounded-md shadow my-3 p-3">
                <Fieldset :legend="products.data.product.name + ' ' + 'reviews'" :toggleable="true">
                    <div v-if="products.data.reviews !== 'No data'"
                        class="flex gap-5 flex-wrap lg:flex-nowrap mb-2 border-b-[1px] py-2">
                        <div v-for="(category, key) in ratingCategories" :key="key" class="basis-full lg:basis-1/3">
                            <div class="text-sm font-medium">{{ category.label }}</div>
                            <div class="flex gap-2 items-center">
                                <Rating v-model="category.average" readonly :cancel="false" />
                                <span>{{ category.average }} out of 5.0</span>
                            </div>
                            <div class="flex gap-2 items-end" v-for="(percent, index) in category.total" :key="index">
                                <span class="text-sm text-nowrap">{{ index }} Stars</span>
                                <a-progress :percent="percent" :show-info="false"
                                    :stroke-color="{ '0%': '#ffb444', '100%': '#ff4d47' }" />
                            </div>
                        </div>
                    </div>
                    <div v-if="products.data.reviews !== 'No data'" class="text-base font-normal text-black">{{
                        products.data.reviews.length }} latest reviews in
                        {{ products.data.countReview }}</div>
                    <div v-if="products.data.reviews !== 'No data'" class="py-2 border-b-[1px] border-slate-300"
                        v-for="(review, index) in products.data.reviews">
                        <div class="flex flex-col md:flex-row gap-5">
                            <div class="basis-12/12 lg:basis-3/12">
                                <div class="text-black font-medium mb-1" v-for="profile in products.data.profile">
                                    <div class="" v-if="review.profile_id == profile.id">
                                        {{ profile.email }} -
                                        <NuxtTime :datetime="review.created_at" second="numeric" month="long"
                                            day="numeric" />
                                    </div>
                                </div>
                                <div>
                                    <div class="flex gap-2 items-center justify-between">
                                        <div class="text-sm">Overall:</div>
                                        <Rating v-model="review.overall" readonly :cancel="false" />
                                    </div>
                                    <div class="flex gap-2 items-center justify-between">
                                        <div class="text-sm">Performance:</div>
                                        <Rating v-model="review.performance" readonly :cancel="false" />
                                    </div>
                                    <div class="flex gap-2 items-center justify-between">
                                        <div class="text-sm">Story:</div>
                                        <Rating v-model="review.story" readonly :cancel="false" />
                                    </div>
                                </div>
                            </div>
                            <div class="basis-12/12 lg:basis-9/12 italic text-sm">
                                " {{ review.description }} "
                            </div>
                        </div>
                    </div>
                    <div v-if="products.data.reviews == 'No data'">
                        <div class="flex flex-col items-center justify-center">
                            <IconsEmpty class="w-20 h-20 text-main" />
                            <span class="text-sm">There are no reviews</span>
                        </div>
                    </div>
                </Fieldset>
            </div>
            <div v-for="(product, index) in productBy.data" :key="index">
                <SlideShowProduct :slidesPerView="slidesPerView" :breakpoints="breakpoints" :products="product"
                    :category="index + ': ' + products.data.product[index]" />
            </div>
        </div>
        <div v-if="!isData" class="flex justify-center">
            <ProgressSpinnerAudio class="my-5" />
        </div>
    </div>
</template>

<script>

export default {
    setup() {
        definePageMeta({
            middleware: "sound",
        });
    },
    data() {
        return {
            products: [],
            isData: false,
            star: 2.5,
            slidesPerView: 5,
            breakpoints: {
                100: {
                    slidesPerView: 2,
                },
                640: {
                    slidesPerView: 3,
                },
                960: {
                    slidesPerView: 4,
                },
                1280: {
                    slidesPerView: 5,
                },
            },
            ratingsCategories: {},
            ratingCategories: {},
            productBy: []
        };
    },
    mounted() {
        this.handleApi();
    },
    methods: {
        async handleApi() {
            const slug = this.$route.params.slug;
            const { csrf } = useCsrf();
            const csrfToken = csrf;
            if (csrfToken) {
                try {
                    const productResponse = await $fetch(`/api/product/${slug}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Csrf-Token': csrfToken,
                        },
                    });
                    if (productResponse.data) {
                        this.isData = true;
                        this.products = productResponse.data;
                        const productId = this.products.data.product.id;
                        const productDetailResponse = await $fetch(`/api/product/detail/${productId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Csrf-Token': csrfToken,
                            },
                        });
                        if (productDetailResponse.data) {
                            this.productBy = productDetailResponse.data;
                        }
                        const reviewResponse = await $fetch(`/api/product/review/${productId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Csrf-Token': csrfToken,
                            },
                        });
                        if (reviewResponse.data && reviewResponse.data.error != 'No data') {
                            this.ratingsCategories = reviewResponse.data;
                            this.ratingCategories = {
                                overall: {
                                    label: 'Overall',
                                    average: this.ratingsCategories.averageOverall,
                                    total: this.ratingsCategories.totalOverall
                                },
                                performance: {
                                    label: 'Performance',
                                    average: this.ratingsCategories.averagePerformance,
                                    total: this.ratingsCategories.totalPerformance
                                },
                                story: {
                                    label: 'Story',
                                    average: this.ratingsCategories.averageStory,
                                    total: this.ratingsCategories.totalStory
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                console.error('CSRF token not available');
            }
        },
    }
}
</script>