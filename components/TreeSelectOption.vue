<template>
    <div class="flex items-center gap-3">
        <label class="text-main font-medium text-sm">Sort by</label>
        <FloatLabel>
            <TreeSelect v-model="selectedValue" :options="nodes" @change="handleSortChange" placeholder="Select sort by"
                class="shadow" />
        </FloatLabel>
    </div>
</template>

<script setup>
const router = useRouter();
const nodes = ref([
    {
        key: '0',
        label: 'Price: Low to High',
        icon: 'pi pi-chevron-up',
        slug: 'low-to-high'
    },
    {
        key: '1',
        label: 'Price: High to Low',
        icon: 'pi pi-chevron-down',
        slug: 'high-to-low'
    },
    {
        key: '2',
        label: 'Release: old to new',
        icon: 'pi pi-chevron-up',
        slug: 'release_date-asc'
    },
    {
        key: '3',
        label: 'Release: new to old',
        icon: 'pi pi-chevron-down',
        slug: 'release_date-desc'
    },
    {
        key: '4',
        label: 'Title: A - Z',
        icon: 'pi pi-chevron-up',
        slug: 'title-a-z'
    },
    {
        key: '5',
        label: 'Title: Z - A',
        icon: 'pi pi-chevron-down',
        slug: 'title-z-a'
    },
    {
        key: '6',
        label: 'Length: short to long',
        icon: 'pi pi-chevron-up',
        slug: 'short-to-long'
    },
    {
        key: '7',
        label: 'Length: long to short',
        icon: 'pi pi-chevron-down',
        slug: 'long-to-short'
    }
]);
const selectedValue = ref(nodes.value[0].key);

const handleSortChange = (newValue) => {
    const sortKey = Object.keys(newValue)[0];
    const slug = nodes.value[sortKey].slug;
    const currentPath = router.currentRoute.value.path;
    router.push({ path: currentPath, query: { ...router.currentRoute.value.query, sort: slug } });
};

</script>
