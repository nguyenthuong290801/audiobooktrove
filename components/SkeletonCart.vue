<template>
    <div class="flex flex-col w-full gap-3">
        <div class="bg-slate-50 px-1 py-2 rounded-md h-8">
            <Skeleton width="15px" height="15px" borderRadius="2px" />
        </div>
        <div class="flex flex-wrap gap-3 bg-white rounded-md" v-for="n in 1" :key="n">
            <div class="rounded-md overflow-hidden basis-full bg-white flex gap-3">
                <div class="flex gap-3 basis-full">
                    <div class="flex justify-center items-center gap-3 relative">
                        <Skeleton width="15px" height="15px" borderRadius="3px" />
                        <div class="rounded-md w-40 h-40 overflow-hidden shadow">
                            <div class="w-full h-full">
                                <Skeleton width="100%" height="100%" />
                            </div>
                        </div>
                    </div>
                    <div class="w-full">
                        <div class="text-lg text-left font-semibold my-2">
                            <Skeleton width="100%" height="20px" />
                        </div>
                        <div class="text-sm text-left font-normal my-2">
                            <span class="text-sub flex items-center gap-2">
                                <Skeleton width="100%" height="12px" />
                            </span>
                        </div>
                        <div class="text-sm text-left font-normal my-2">
                            <span class="text-sub flex items-center gap-2">
                                <Skeleton width="12%" height="17px" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>