<template>
    <div>
        <Breadcrumb :model="items" class="bg-transparent px-0">
            <template #item="{ item, props }">
                <NuxtLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a :href="href" v-bind="props.action" @click="navigate">
                        <span :class="[item.icon, 'text-color']" />
                        <span class="text-sm text-main font-semibold">{{ item.label }}</span>
                    </a>
                </NuxtLink>
                <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                    <span class="text-sm text-black">{{ item.label }}</span>
                </a>
            </template>
        </Breadcrumb>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const path = router.currentRoute.value.path;
const parts = path.split('/').filter(Boolean);

const formatLabel = (label) => {
    return label
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const items = ref([
    { label: 'Home', route: '/' },
]);

parts.forEach((part, index) => {
    if (index < parts.length - 1) {
        items.value.push({ label: formatLabel(part), route: `/${parts.slice(0, index + 1).join('/')}` });
    } else {
        items.value.push({ label: formatLabel(part) });
    }
});
</script>
