<template>
    <header class="bg-white shadow">
        <div class="max-w-6xl px-2 lg:px-0 mx-auto py-3 flex justify-between items-center">
            <div class="flex-shrink-0">
                <NuxtLink to="/">
                    <img class="h-10 md:h-14" :src="logo" alt="logo" />
                </NuxtLink>
            </div>
            <nav class="hidden lg:block">
                <ul class="md:px-2 ml-auto md:flex md:space-x-2 absolute md:relative top-full left-0 right-0">
                    <li v-for="(item, index) in menuItems" :key="index">
                        <NuxtLink :to="item.url" class="flex md:inline-flex py-2 items-center">
                            <Button class="button_hero--secondary" aria-label="button menu">
                                <span class="text-sm">{{ item.title }}</span>
                                <template v-if="item.children">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current pt-1"
                                        viewBox="0 0 24 24">
                                        <path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z" />
                                    </svg>
                                </template>
                            </Button>
                        </NuxtLink>
                        <ul v-if="item.children"
                            class="child transition duration-300 md:absolute top-full md:w-48 bg-white md:shadow-lg md:rounded-b">
                            <li v-for="(child, childIndex) in item.children" :key="childIndex">
                                <NuxtLink to="#" class="flex px-4 py-3 hover:bg-gray-50 text-sm">{{ child.title }}
                                </NuxtLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
            <div class="flex items-center">
                <nav class="contents">
                    <ul class="flex gap-3 items-center justify-end">
                        <li class="ml-0 relative inline-block basis-1/4 lg:basis-1/3 rounded-full">
                            <Button class="bg-sub p-2 rounded-full shadow-md w-10 h-10" aria-label="button search">
                                <DialogSearch />
                            </Button>
                        </li>
                        <li class="ml-0 relative inline-block basis-1/4 lg:basis-1/3 rounded-full">
                            <NuxtLink to="/cart">
                                <div
                                    class="absolute -top-2 right-0 z-10 bg-black text-white text-xs font-bold px-1 py-[1px] rounded-md">
                                    {{ countCart }}
                                </div>
                                <Button class="bg-sub p-2 rounded-full shadow-md w-10 h-10" aria-label="button cart">
                                    <icons-cart class="text-2xl" />
                                </Button>
                            </NuxtLink>
                        </li>
                        <li class="ml-0 relative inline-block basis-1/4 lg:basis-1/3 rounded-full">
                            <NuxtLink to="/login">
                                <Button class="p-1 rounded-full shadow-md w-10 h-10 justify-center"
                                    :class="{ 'bg-black hover:bg-orange-600': isLogin, 'bg-sub': !isLogin }"
                                    aria-label="button login">
                                    <icons-user v-if="!isLogin" class="text-2xl" />
                                    <img v-if="isLogin" class="w-full h-auto object-cover rounded-full"
                                        :src="avatar" alt="avatar"/>
                                </Button>
                            </NuxtLink>
                        </li>
                        <li class="ml-0 relative inline-block basis-1/4 lg:hidden rounded-full">
                            <Button class="bg-sub p-2 rounded-full shadow w-10 h-10" @click="visibleRight = true"
                                aria-label="button menu">
                                <icons-menu class="text-2xl" />
                            </Button>
                        </li>
                    </ul>
                </nav>
            </div>
            <Sidebar v-model:visible="visibleRight" position="right">
                <template #header>
                    <NuxtLink to="/">
                        <img class="h-12 md:h-16" :src="logo" alt="logo" />
                    </NuxtLink>
                </template>
                <nav>
                    <ul>
                        <li v-for="(item, index) in menuItems" :key="index">
                            <NuxtLink :to="item.url" class="flex lg:inline-flex py-2 items-center">
                                <Button class="button_hero--secondary w-full justify-center" aria-label="button menu">
                                    <span class="text-sm">{{ item.title }}</span>
                                    <template v-if="item.children">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current pt-1"
                                            viewBox="0 0 24 24">
                                            <path
                                                d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z" />
                                        </svg>
                                    </template>
                                </Button>
                            </NuxtLink>
                            <ul v-if="item.children"
                                class="child transition duration-300 md:absolute top-full md:w-48 bg-white md:shadow-lg md:rounded-b">
                                <li v-for="(child, childIndex) in item.children" :key="childIndex">
                                    <NuxtLink to="#" class="flex px-4 py-3 hover:bg-gray-50 text-sm">{{ child.title }}
                                    </NuxtLink>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </Sidebar>
        </div>
    </header>
</template>

<script>
import logo from '@/assets/image/logo.png';
import avatar from '@/assets/image/avatar.jpg';
export default {
    data() {
        return {
            menuItems: [
                { title: 'Home', url: '/' },
                { title: 'Audiobooks', url: '/audiobooks' },
            ],
            visibleRight: false, 
            logo: logo,
            avatar: avatar
        };
    },
    computed: {
        countCart() {
            const cartCookie = useCookie('cart');
            if (cartCookie.value && cartCookie.value.length != 0) {
                this.$store.dispatch('addToCart', cartCookie.value.length);
            }
            return this.$store.state.countCart;
        },
        isLogin() {
            const user = useSupabaseUser();
            return user.value != undefined;
        }
    },
    watch: {
        '$route'(to, from) {
            this.visibleRight = false;
        }
    },
};
</script>
