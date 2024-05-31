<template>
    <div class="bg-white rounded-md shadow overflow-hidden">
        <div class="p-2 font-medium flex items-center gap-1 text-sm text-main"><IconsTabs class="w-5 h-5" /> Filter</div>
        <a-directory-tree multiple :tree-data="treeData" @select="handleSelect"></a-directory-tree>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import type { TreeProps } from 'ant-design-vue';
interface Props {
    treeData: TreeProps['treeData'];
}

const router = useRouter();
const props: Props = defineProps<{ treeData: TreeProps['treeData'] }>();

const handleSelect = (selectedKey: string) => {
    const { $createSlug } = useNuxtApp();
    const { sort, page, keyword } = router.currentRoute.value.query;
    
    const foundNode = findNodeByKey(props.treeData, selectedKey);
    const query: any = {};

    if (page) {
        query.page = page;
    }

    if (foundNode) {
        query.category = $createSlug(foundNode.title);
    }

    if (sort) {
        query.sort = sort;
    }

    if (keyword) {
        query.keyword = keyword;
    }

    router.push({ query });
};

const findNodeByKey = (treeData: any[], key: string): any => {
    for (const item of treeData) {
        if (item.key === key['0']) {
            return item;
        }
        if (item.children) {
            const foundNode = findNodeByKey(item.children, key);
            if (foundNode) {
                return foundNode;
            }
        }
    }
    return null;
};
</script>
