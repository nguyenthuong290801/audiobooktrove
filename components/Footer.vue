<template>
    <footer class="bg-main px-2 lg:px-0">
        <div class="pt-1">
            <div class="mx-auto max-w-6xl py-5 text-black z-10">
                <div class="grid grid-cols-12 gap-6 md:gap-0">
                    <div class="col-span-12 border-r-[1px] border-black lg:col-span-2">
                        <div
                            class="flex items-center justify-between gap-6 border-b-[1px] border-black py-6 lg:block md:space-y-6 lg:border-none lg:py-0">
                            <NuxtImg class="h-10 md:h-14" src="/logo.png" alt="logo" format="webp" placeholder preload loading="lazy" />
                        </div>
                    </div>
                    <div class="col-span-12 lg:col-span-10 mt-5 lg:mt-0">
                        <div class="grid grid-cols-1 gap-6 pb-16 lg:grid-cols-3 pl-0 lg:pl-16">
                            <div>
                                <div class="text-lg font-medium text-black border-b-[1px] py-2 border-black">About US
                                </div>
                                <div class="mt-2 text-sm" v-html="aboutUs"></div>
                            </div>
                            <div>
                                <div class="text-lg font-medium text-black border-b-[1px] py-2 border-black">Category
                                </div>
                                <NuxtLink class="hover:text-orange-500 duration-200"
                                    :to="'/audiobooks?category=' + handleSlug(category.name)"
                                    v-for="category in categories" :key="category.id">
                                    <div class="mt-2 text-sm">
                                        {{ category.name }}
                                    </div>
                                </NuxtLink>
                            </div>
                            <div>
                                <div class="text-lg font-medium text-black border-b-[1px] py-2 border-black">Contact
                                </div>
                                <div v-if="contact.email" class="flex items-center gap-2 mt-2">
                                    <IconsMail />
                                    <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
                                </div>
                                <div v-if="contact.facebook" class="flex items-center gap-2 mt-2">
                                    <IconsFacebook />
                                    <a :href="contact.facebook" target="_blank" rel="noopener noreferrer">{{
                                        contact.facebook }}</a>
                                </div>
                                <div v-if="contact.twitter" class="flex items-center gap-2 mt-2">
                                    <IconsTwitter />
                                    <a :href="contact.twitter" target="_blank" rel="noopener noreferrer">{{
                                        contact.twitter }}</a>
                                </div>
                                <div v-if="contact.instagram" class="flex items-center gap-2 mt-2">
                                    <IconsInstagram />
                                    <a :href="contact.instagram" target="_blank" rel="noopener noreferrer">{{
                                        contact.instagram }}</a>
                                </div>
                                <div v-if="contact.phone" class="flex items-center gap-2 mt-2">
                                    <i class="pi pi-phone"></i>
                                    <a :href="'tel:' + contact.phone" target="_blank" rel="noopener noreferrer">{{
                                        contact.phone }}</a>
                                </div>
                                <div v-if="contact.adress" class="flex items-center gap-2 mt-2">
                                    <i class="pi pi-map-marker"></i>
                                    <div>{{ contact.adress }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    setup() {
        const categories = ref([]);
        const aboutUs = ref(null);
        const contact = ref([]);

        const fetchData = async (url, csrfToken) => {
            try {
                const response = await $fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Csrf-Token': csrfToken,
                    },
                });
                return response;
            } catch (error) {
                console.error(`Error fetching data from ${url}:`, error);
                throw error;
            }
        };

        const saveToLocalStorage = (key, data) => {
            const expiryDate = new Date().getTime() + 3 * 24 * 60 * 60 * 1000;
            const item = {
                data: data,
                expiry: expiryDate,
            };
            localStorage.setItem(key, JSON.stringify(item));
        };

        const loadFromLocalStorage = (key) => {
            const itemStr = localStorage.getItem(key);
            if (!itemStr) {
                return null;
            }
            const item = JSON.parse(itemStr);
            const now = new Date().getTime();
            if (now > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            return item.data;
        };

        onMounted(async () => {
            const cachedCategories = loadFromLocalStorage('categories');
            const cachedAboutUs = loadFromLocalStorage('aboutUs');
            const cachedContact = loadFromLocalStorage('contact');

            if (cachedCategories) categories.value = cachedCategories;
            if (cachedAboutUs) aboutUs.value = cachedAboutUs;
            if (cachedContact) contact.value = cachedContact;

            if (!cachedCategories || !cachedAboutUs || !cachedContact) {
                const { csrf } = useCsrf();
                const csrfToken = csrf;

                if (!csrfToken) {
                    console.error('CSRF token not available');
                    return;
                }

                try {
                    const [categoryResponse, aboutUsResponse, contactResponse] = await Promise.all([
                        fetchData('/api/category/home', csrfToken),
                        fetchData('/api/aboutUs', csrfToken),
                        fetchData('/api/contact', csrfToken)
                    ]);

                    if (categoryResponse?.data) {
                        categories.value = categoryResponse.data.data;
                        saveToLocalStorage('categories', categories.value);
                    }
                    if (aboutUsResponse?.data) {
                        aboutUs.value = aboutUsResponse.data.data.description;
                        saveToLocalStorage('aboutUs', aboutUs.value);
                    }
                    if (contactResponse?.data) {
                        contact.value = contactResponse.data.data;
                        saveToLocalStorage('contact', contact.value);
                    }

                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        });

        const handleSlug = (string) => {
            const { $createSlug } = useNuxtApp();
            return $createSlug(string);
        };

        return {
            categories,
            aboutUs,
            contact,
            handleSlug,
        };
    },
}
</script>