<template>
    <div>
        <div class="mx-auto max-w-6xl mt-3 px-2 lg:px-0">
            <div class="flex flex-wrap gap-3 justify-between">
                <BreadCrumb />
                <TreeSelectOption />
                <div class="lg:hidden flex items-center gap-3">
                    <span class="text-main font-medium text-sm">Filter</span>
                    <Button class="bg-sub p-2 rounded-md shadow w-[37px] h-[37px]" @click="visibleRight = true">
                        <IconsFilter class="text-2xl" />
                    </Button>
                </div>
            </div>
        </div>
        <div v-if="isData" class="mx-auto max-w-6xl my-3 px-2 lg:px-0">
            <div class="flex flex-wrap lg:flex-nowrap gap-3">
                <div class="hidden lg:block lg:basis-3/12">
                    <div class="mb-2">
                        <div class="bg-white px-2 py-2 rounded-md shadow">
                            <div class="flex gap-1 items-center">
                                <div class="text-xs py-0.5 border-[1px] border-white">
                                    Filter:
                                </div>
                                <div class="flex flex-wrap gap-1">
                                    <div v-if="category"
                                        class="bg-orange-100 py-0.5 px-1 rounded-md border-[1px] border-orange-300">
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs basis-11/12">Category: {{ formatLabel(category)
                                                }}</span>
                                            <div class="basis-1/12">
                                                <IconsCross
                                                    class="cursor-pointer hover:bg-red-500 bg-black duration-200 text-white rounded-full text-base"
                                                    @click="removeFilter('category')" />
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="sort"
                                        class="bg-orange-100 py-0.5 px-1 rounded-md border-[1px] border-orange-300">
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs basis-11/12">Sort: {{ formatLabel(sort) }}</span>
                                            <div class="basis-1/12">
                                                <IconsCross
                                                    class="cursor-pointer hover:bg-red-500 bg-black duration-200 text-white rounded-full text-base"
                                                    @click="removeFilter('sort')" />
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="keyWord"
                                        class="bg-orange-100 py-0.5 px-1 rounded-md border-[1px] border-orange-300">
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs basis-11/12">Keyword: {{ keyWord }}</span>
                                            <div class="basis-1/12">
                                                <IconsCross
                                                    class="cursor-pointer hover:bg-red-500 bg-black duration-200 text-white rounded-full text-base"
                                                    @click="removeFilter('keyword')" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ListboxOption :treeData="categories" />
                </div>
                <div v-if="isDataProduct && !isEmpty" class="basis-full lg:basis-9/12">
                    <ListProduct :products="products" />
                    <Paginator class="mt-3 shadow rounded-md overflow-hidden" :rows="10" :totalRecords="totalRecords"
                        v-model:first="page" />
                </div>
                <div v-if="!isDataProduct" class="basis-full lg:basis-9/12">
                    <div class="flex justify-center">
                        <SkeletonProduct />
                    </div>
                    <Paginator class="mt-3 shadow rounded-md overflow-hidden" :rows="10" :totalRecords="totalRecords"
                        v-model:first="page" />
                </div>
                <div v-if="isEmpty"
                    class="basis-full flex items-center justify-center lg:basis-9/12 bg-white shadow rounded-md">
                    <div class="flex flex-col items-center justify-center pb-2">
                        <IconsEmpty class="w-20 h-20 text-main" />
                        <span class="text-sm">There are no products in category</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!isData" class="flex justify-center">
            <ProgressSpinnerAudio class="my-5" />
        </div>
        <Sidebar v-model:visible="visibleRight" position="left">
            <template #header>
                <NuxtLink to="/">
                    <NuxtImg class="h-12 md:h-16" :src="logoSrc" />
                </NuxtLink>
            </template>
            <div class="lg:basis-3/12">
                <div class="mb-2">
                    <div class="bg-white px-2 py-1 rounded-md shadow">
                        <div class="flex gap-1 items-center">
                            <div class="text-xs py-0.5 border-[1px] border-white">
                                Filter:
                            </div>
                            <div class="flex flex-wrap gap-1">
                                <div v-if="category"
                                    class="bg-orange-100 py-0.5 px-1 rounded-sm border-[1px] border-orange-300">
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs basis-11/12">Category: {{ formatLabel(category)
                                            }}</span>
                                        <div class="basis-1/12">
                                            <IconsCross
                                                class="cursor-pointer hover:bg-red-500 bg-black duration-200 text-white rounded-full text-base"
                                                @click="removeFilter('category')" />
                                        </div>
                                    </div>
                                </div>
                                <div v-if="sort"
                                    class="bg-orange-100 py-0.5 px-1 rounded-sm border-[1px] border-orange-300">
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs basis-11/12">Sort: {{ formatLabel(sort) }}</span>
                                        <div class="basis-1/12">
                                            <IconsCross
                                                class="cursor-pointer hover:bg-red-500 bg-black duration-200 text-white rounded-full text-base"
                                                @click="removeFilter('sort')" />
                                        </div>
                                    </div>
                                </div>
                                <div v-if="keyWord"
                                    class="bg-orange-100 py-0.5 px-1 rounded-sm border-[1px] border-orange-300">
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs basis-11/12">Keyword: {{ keyWord }}</span>
                                        <div class="basis-1/12">
                                            <IconsCross
                                                class="cursor-pointer hover:bg-red-500 bg-black duration-200 text-white rounded-full text-base"
                                                @click="removeFilter('keyword')" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ListboxOption :treeData="categories" />
            </div>
        </Sidebar>
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
            page: 0,
            category: null,
            sort: null,
            keyWord: null,
            products: [],
            categories: [],
            isData: false,
            isDataProduct: false,
            isEmpty: false,
            totalRecords: 0,
            visibleRight: false,
        };
    },
    computed: {
        logoSrc() {
            return this.isLogo ? '/logo_white.png' : '/logo.png';
        },
    },
    watch: {
        '$route'(to, from) {
            this.visibleRight = false;
        },
        page(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.isDataProduct = false;
                this.handleApiCount();
                this.handlePage(newValue, this.category, this.sort, this.keyWord);
            }
        },
        '$route.query.category'(newCategory, oldCategory) {
            if (newCategory !== oldCategory) {
                this.category = newCategory;
                this.page = 0;
                this.isEmpty = false;
                this.isDataProduct = false;
                this.handleApiCount();
                this.handlePage(this.page, newCategory, this.sort, this.keyWord);
            }
        },
        '$route.query.sort'(newSort, oldSort) {
            if (newSort !== oldSort) {
                this.sort = newSort;
                this.page = 0;
                this.isEmpty = false;
                this.isDataProduct = false;
                this.handleApiCount();
                this.handlePage(this.page, this.category, newSort, this.keyWord);
            }
        },
        '$route.query.keyword'(newKey, oldKey) {
            if (newKey !== oldKey) {
                this.keyWord = newKey;
                this.page = 0;
                this.isEmpty = false;
                this.isDataProduct = false;
                this.handleApiCount();
                this.handlePage(this.page, this.category, this.sort, newKey);
            }
        },
    },
    mounted() {
        this.handleApiCount();
        this.category = this.$route.query.category;
        this.sort = this.$route.query.sort;
        this.keyWord = this.$route.query.keyword;
        this.handlePage(this.page, this.category, this.sort, this.keyWord);
        this.handleApiCategory();

    },
    methods: {
        handlePage(page, category, sort, keyword) {
            const currentCategory = this.$route.query.category;
            const currentKeyword = this.$route.query.keyword;
            const currentSort = this.$route.query.sort;
            let query = { page: page };
            if (currentCategory) {
                query = { ...query, category: currentCategory };
            }
            if (currentSort) {
                query.sort = currentSort;
            }
            if (currentKeyword) {
                query.keyword = currentKeyword;
            }
            this.$router.push({ path: '/audiobooks', query });
            this.handleApiProductParam(page, category, sort, keyword);
        },
        async handleApiProduct() {
            const { csrf } = useCsrf();
            const csrfToken = csrf;
            if (csrfToken) {
                try {
                    const productResponse = await $fetch('/api/product', {
                        method: 'POST',
                        body: {
                            page: this.page,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            'Csrf-Token': csrfToken,
                        },
                    })

                    if (productResponse.data.error) {
                        this.isEmpty = true;
                        this.isData = true;
                        this.isDataProduct = true;
                        return;
                    } else {
                        this.isEmpty = false;
                    }

                    if (productResponse.data) {
                        this.products = productResponse.data;
                        this.isData = true;
                        this.isDataProduct = true;
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                console.error('CSRF token not available');
            }
        },
        async handleApiCategory() {
            const { csrf } = useCsrf();
            const csrfToken = csrf;
            if (csrfToken) {
                try {
                    const categoryResponse = await $fetch('/api/category', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Csrf-Token': csrfToken,
                        },
                    })

                    if (categoryResponse.data) {
                        this.categories = this.formatTreeData(categoryResponse.data.data);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                console.error('CSRF token not available');
            }
        },
        async handleApiCount() {
            const { csrf } = useCsrf();
            const csrfToken = csrf;
            if (csrfToken) {
                try {
                    const countProductResponse = await $fetch('/api/paginator', {
                        method: 'POST',
                        body: {
                            category: this.category,
                            name: this.keyWord
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            'Csrf-Token': csrfToken,
                        },
                    })

                    if (countProductResponse.data) {
                        this.totalRecords = countProductResponse.data.data;
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                console.error('CSRF token not available');
            }
        },
        async handleApiProductParam(page, category, sort, keyword) {
            const { csrf } = useCsrf();
            const csrfToken = csrf;
            if (csrfToken) {
                try {
                    const productResponse = await $fetch('/api/product', {
                        method: 'POST',
                        body: {
                            page: page,
                            category: category,
                            sort: sort,
                            keyword: keyword
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            'Csrf-Token': csrfToken,
                        },
                    })

                    if (productResponse.data.error == 'No data') {
                        this.isEmpty = true;
                        this.isData = true;
                        this.isDataProduct = true;
                        return;
                    } else {
                        this.isEmpty = false;
                    }

                    if (productResponse.data) {
                        this.products = productResponse.data;
                        this.isData = true;
                        this.isDataProduct = true;
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                console.error('CSRF token not available');
            }
        },
        formatTreeData(data) {
            const treeData = [];
            const processChildren = (items) => {
                return items.map(item => {
                    const node = {
                        title: item.name,
                        key: item.id.toString(),
                    };
                    if (item.category_product_id !== null) {
                        node.children = processChildren(data.filter(child => child.category_product_id === item.id));
                    } else {
                        node.isLeaf = true;
                    }
                    return node;
                });
            };
            const rootItems = data.filter(item => item.category_product_id === null);
            rootItems.forEach(rootItem => {
                const rootNode = {
                    title: rootItem.name,
                    key: rootItem.id.toString(),
                    children: processChildren(data.filter(item => item.category_product_id === rootItem.id)),
                };
                treeData.push(rootNode);
            });
            return treeData;
        },
        formatLabel(label) {
            return label
                .replace(/[-_]/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        },
        removeFilter(filterType) {
            const query = { ...this.$route.query };
            delete query[filterType];
            this.$router.push({ query });
        },
    }
}
</script>
