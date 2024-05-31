<template>
    <div class="flex flex-col w-full gap-3">
        <div class="flex flex-wrap gap-3 bg-white rounded-md shadow p-2" v-for="n in 1" :key="n">
            <div class="rounded-md overflow-hidden basis-full bg-white flex gap-3">
                <div class="flex gap-3 basis-full md:basis-7/12 lg:basis-8/12">
                    <div class="flex flex-col justify-center gap-2 relative">
                        <div class="rounded-md w-40 h-40 lg:w-48 lg:h-48 overflow-hidden shadow">
                            <div class="w-full h-full">
                                <Skeleton width="100%" height="100%" />
                            </div>
                        </div>
                        <Button class="shadow rounded-md">
                            <Skeleton width="100%" height="42px" />
                        </Button>
                    </div>
                    <div class="w-full lg:w-1/3">
                        <div class="text-lg text-left font-semibold">
                            <Skeleton width="100%" height="22px" />
                        </div>
                        <div class="text-sm text-left font-normal my-3">
                            <span class="text-sub flex items-center gap-2">
                                <Skeleton width="100%" height="17px" />
                            </span>
                        </div>
                        <div class="text-sm text-left font-normal my-3">
                            <span class="text-sub flex items-center gap-2">
                                <Skeleton width="100%" height="17px" />
                            </span>
                        </div>
                        <div class="text-sm text-left font-normal my-3">
                            <span class="text-sub flex items-center gap-2">
                                <Skeleton width="100%" height="17px" />
                            </span>
                        </div>
                        <div class="text-sm text-left font-normal my-3">
                            <span class="text-sub flex items-center gap-2">
                                <Skeleton width="100%" height="17px" />
                            </span>
                        </div>
                        <div class="text-sm text-left font-normal my-3">
                            <span class="text-sub flex items-center gap-2">
                                <Skeleton width="100%" height="17px" />
                            </span>
                        </div>
                    </div>
                </div>
                <div class="hidden md:block md:basis-5/12 lg:basis-4/12">
                    <Button class="my-1 w-full justify-center" aria-label="button price">
                        <Skeleton borderRadius="50px" width="100%" height="45px" />
                    </Button>
                    <Button class="my-1 w-full justify-center" aria-label="button add to cart">
                        <Skeleton width="100%" height="45px" />
                    </Button>
                    <Button class="my-1 w-full justify-center" aria-label="button buy now">
                        <Skeleton width="100%" height="45px" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>