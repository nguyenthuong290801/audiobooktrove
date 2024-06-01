<template>
    <icons-search class="text-2xl" @click="openPosition('top')" />
    <Dialog v-model:visible="visible" class="w-full lg:w-1/3" :position="position" :modal="true" :draggable="false">
        <template #header>
            <div>
                <NuxtLink to="/">
                    <img class="h-12" :src="logo" alt="logo" />
                </NuxtLink>
            </div>
        </template>
        <div class="flex gap-2 border-[1px] rounded-md shadow p-2">
            <input ref="searchInput" type="text" v-model="search" class="w-full outline-none text-sm"
                placeholder="Search for audiobook titles" @keyup.enter="submitSearch">
            <Button class="button_hero flex items-center" @click="submitSearch" aria-label="button submit">
                <span class="text-sm">Submit</span>
                <i class="pi pi-send"></i>
            </Button>
        </div>
    </Dialog>
</template>

<script>
import logo from '@/assets/image/logo.png';
export default {
    data() {
        return {
            position: 'top',
            visible: false,
            search: null,
            logo: logo
        }
    },
    watch: {
        '$route'(to, from) {
            this.visible = false;
        }
    },
    methods: {
        openPosition(pos) {
            this.position = pos;
            this.visible = true;
            nextTick(() => {
                this.$refs.searchInput.focus();
            });
        },
        submitSearch() {
            if (this.$route.name === 'audiobooks') {
                if (this.search) {
                    const currentQuery = { ...this.$route.query, keyword: this.search };
                    this.$router.push({ query: currentQuery });
                    this.search = null;
                }
            } else {
                this.$router.push({ path: '/audiobooks', query: { keyword: this.search } });
                this.search = null;
            }
        }
    }
}
</script>