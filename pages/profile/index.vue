<template>
    <div class="">
        <div class="mx-auto max-w-6xl mt-3 px-2 lg:px-0">
            <div class="flex flex-wrap justify-between">
                <BreadCrumb />
            </div>
        </div>
        <div v-if="load" class="mx-auto max-w-6xl mt-3 px-2 lg:px-0">
            <div class="flex flex-wrap lg:flex-nowrap gap-3">
                <div class="basis-full lg:basis-4/12">
                    <div class="bg-black rounded-md shadow p-2 relative mt-9">
                        <div class="h-20 w-20 absolute left-4 -top-10">
                            <NuxtImg class="w-full h-full rounded-full p-2 bg-black duration-200" :src="avatar" />
                        </div>
                        <div class="flex gap-1 items-center justify-start mt-8">
                            <div class="text-sm lg:text-base text-slate-400">Account:</div>
                            <div class="text-sm lg:text-base font-medium text-white">
                                {{ email ?? '' }}
                            </div>
                        </div>
                        <div class="flex gap-1 items-center justify-start">
                            <div class="text-sm lg:text-base text-slate-400">Role:</div>
                            <div class="text-sm lg:text-base font-medium text-white">
                                {{ roleName ?? '' }}
                            </div>
                        </div>
                        <div class="flex justify-end">
                            <Button class="button_hero flex items-center mt-2" :disabled="isPending"
                                @click="handleLogout()">
                                <span class="text-sm">{{ isPending ? 'Logging out' : 'Logout' }}</span>
                                <i v-if="!isPending" class="pi pi-sign-out"></i>
                                <IconsTadpole class="mt-1" v-if="isPending" />
                            </Button>
                        </div>
                    </div>
                </div>
                <div class="basis-full lg:basis-8/12">
                    <div class="text-base lg:text-xl font-medium mb-2">
                        Archive audiobooks
                    </div>
                    <div v-if="isData && !isEmpty">
                        <div class="flex flex-col gap-3">
                            <div class="flex gap-3 bg-white rounded-md shadow p-2" v-for="transaction in transactions"
                                :key="transaction.id">
                                <NuxtLink :to="'/audiobooks/' + handleSlug(transaction.name)"
                                    class="rounded-md w-40 h-40 overflow-hidden shadow">
                                    <NuxtImg :src="transaction.image" class="w-full h-full object-cover"
                                        :alt="transaction.name" />
                                </NuxtLink>
                                <div class="">
                                    <div class="text-sm font-semibold">
                                        {{ transaction.name }}
                                    </div>
                                    <div class="text-sm">
                                        By: {{ transaction.by }}
                                    </div>
                                    <div class="text-sm">
                                        Regular price ${{ transaction.price }}
                                    </div>
                                    <Button v-if="!transaction.isReview"
                                        class="flex gap-1 items-center mt-1 bg-sub shadow rounded-md p-1"
                                        @click="handleReview(transaction)">
                                        <i class="pi pi-file-edit"></i>
                                        <span class="text-sm">Review</span>
                                    </Button>
                                    <Button :disabled="isPendingFile[transaction.audio_object_key_private]"
                                        class="flex gap-1 items-center mt-2 bg-sub shadow rounded-md p-1"
                                        @click="handleDownloadFile(transaction.audio_bucket, transaction.audio_object_key_private)">
                                        <i class="pi pi-download"></i>
                                        <span class="text-sm">{{ isPendingFile[transaction.audio_object_key_private] ?
                                            'Downloading' : 'Download' }}</span>
                                        <IconsTadpole class="mt-1"
                                            v-if="isPendingFile[transaction.audio_object_key_private]" />
                                    </Button>
                                    <input class="hidden" type="file" id="folderInput" webkitdirectory>
                                </div>
                            </div>
                        </div>
                        <Paginator class="mt-3 shadow rounded-md overflow-hidden" :rows="1" :totalRecords="totalRecords"
                            v-model:first="page" />
                    </div>
                    <div v-if="!isData" class="flex flex-col justify-center">
                        <SkeletonTransaction />
                        <Paginator class="mt-3 shadow rounded-md overflow-hidden" :rows="1" :totalRecords="totalRecords"
                            v-model:first="page" />
                    </div>
                    <div v-if="isEmpty" class="flex flex-col items-center justify-center bg-white shadow rounded-md">
                        <div class="flex flex-col items-center justify-center pb-2">
                            <IconsEmpty class="w-20 h-20 text-main" />
                            <span class="text-sm">There are no products in archive audiobooks</span>
                        </div>
                    </div>
                </div>

                <Dialog v-model:visible="visibleDownload" position="top" class="w-full lg:w-1/3" :modal="true"
                    :draggable="false">
                    <template #header>
                        <NuxtLink to="/">
                            <NuxtImg class="h-12" :src="logoSrc" />
                        </NuxtLink>
                    </template>
                    <div v-if="isPendingDownload" class="flex gap-1 items-center justify-center">
                        <span class="text-base font-semibold">Downloading</span>
                        <IconsTadpole class="mt-1" />
                    </div>
                    <div v-if="!isPendingDownload" class="flex gap-1 items-center justify-center">
                        <span class="text-base  font-semibold">Download</span>
                    </div>
                    <div class="text-xs text-sub text-center flex flex-col">
                        Click on each title to download each one
                        <Button :disabled="isPendingDownload" @click="!isPendingDownload && downloadAllFiles()"
                            class="button_hero my-1">
                            Click to download them all
                            <i class="pi pi-cloud-download text-sm"></i>
                        </Button>
                    </div>
                    <table class="table-auto w-full mt-2">
                        <thead class="bg-orange-50 border-[1px]">
                            <tr>
                                <th class="text-sm text-orange-500 px-4 py-2 w-1/5">Index</th>
                                <th class="text-sm text-orange-500 px-4 py-2 w-4/5">File Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(url, index) in urls" :key="fileName(url.key)">
                                <td class="border px-4 py-2 text-center text-sm">{{ index }}</td>
                                <td class="border px-4 py-2 text-center">
                                    <a :href="url.url"
                                        class="text-sm bg-orange-50 hover:bg-orange-100 duration-200 text-orange-500 border-b-[1px] border-t-[1px] border-orange-500 px-2 py-1 leading-8"
                                        @click.prevent="!isPendingDownload && downloadFile(url.url, fileName(url.key))">{{
                                            fileName(url.key) }} <i class="pi pi-cloud-download text-sm"></i></a>
                                    <div v-if="downloadProgress !== null && fileName(url.key) === downloadingFileName"
                                        class="flex gap-1 items-center">
                                        <div
                                            class="h-2 w-full border-[1px] border-orange-500 rounded-md shadow overflow-hidden mt-2">
                                            <div class="h-full bg-orange-500 duration-300"
                                                :style="{ width: downloadProgress + '%' }">
                                            </div>
                                        </div>
                                        <div class="text-xs h-2">{{ downloadProgress }}%</div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Dialog>
                <Dialog v-model:visible="visible" position="top" class="w-full lg:w-1/3" :modal="true"
                    :draggable="false">
                    <template #header>
                        <NuxtLink to="/">
                            <NuxtImg class="h-12" :src="logoSrc" />
                        </NuxtLink>
                    </template>
                    <div class="text-base font-semibold border-b-[1px] mb-4">
                        <span class="text-main">{{ nameBook }}</span> review
                    </div>
                    <div class="flex items-center mt-1">
                        <div class="w-28 text-sm"><span class="text-red-500">*</span>Overall</div>
                        <Rating v-model="overall" :cancel="false" />
                    </div>
                    <div class="flex items-center mt-1">
                        <div class="w-28 text-sm"><span class="text-red-500">*</span>Performance</div>
                        <Rating v-model="performance" :cancel="false" />
                    </div>
                    <div class="flex items-center mt-1">
                        <div class="w-28 text-sm"><span class="text-red-500">*</span>Story</div>
                        <Rating v-model="story" :cancel="false" />
                    </div>
                    <div class="mt-1">
                        <div class="w-28 text-sm"><span class="text-red-500">*</span>Description</div>
                        <Textarea v-model="description" rows="5" class="w-full border-[1px] mt-1 p-1 text-sm"
                            :placeholder="'Tell us about your experience with the book ' + nameBook" />
                    </div>
                    <div class="">
                        <a-alert v-if="isSuccess" class="select-none mb-4" message="Submit in successfully" type="success"
                            show-icon />
                        <a-alert v-if="isFailed" class="select-none mb-4"
                            message="Submit failed (Fields are empty)" type="error" show-icon />
                    </div>
                    <div class="flex justify-end mt-1">
                        <Button :disabled="isPendingSubmit" class="button_hero" @click="handleCreateReview()">
                            <span class="text-sm">{{ isPendingSubmit ?
                                'Submitting' : 'Submit' }}</span>
                            <IconsTadpole class="mt-1" v-if="isPendingSubmit" />
                            <i v-if="!isPendingSubmit" class="pi pi-send"></i>
                        </Button>
                    </div>
                </Dialog>
            </div>
        </div>
    </div>
</template>
<script>
import { getUserProfiles, logOutUser } from '@/composables/useSupabase';

export default {
    setup() {
        definePageMeta({
            middleware: ["auth", "sound"],
        });
    },
    data() {
        return {
            load: false,
            email: null,
            roleName: null,
            totalRecords: 0,
            page: 0,
            isPending: false,
            isPendingSubmit: false,
            isPendingFile: [],
            isPendingDownload: false,
            transactions: [],
            visible: false,
            visibleDownload: false,
            nameBook: null,
            overall: 0,
            performance: 0,
            story: 0,
            description: null,
            isEmpty: false,
            isData: false,
            isFailed: false,
            isSuccess: false,
            messageError: null,
            folderInput: ref(null),
            urls: [],
            downloadProgress: null,
            downloadingFileName: null,
            idProduct: ''
        }
    },
    mounted() {
        this.handleApiProfile();
        this.handleTransaction();
        this.handleCountTransaction();
    },
    computed: {
        avatar() {
            return '/avatar.jpg';
        },
        logoSrc() {
            return '/logo.png';
        }
    },
    watch: {
        page(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.isData = false;
                this.handleTransaction();
                this.handlePage(newValue);
            }
        },
    },
    methods: {
        fileName(filePath) {
            const parts = filePath.split("/");
            return parts[parts.length - 1];
        },
        async downloadFile(url, fileName) {
            this.isPendingDownload = true;
            this.downloadingFileName = fileName;
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "blob";
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const blob = new Blob([xhr.response], { type: "audio/mpeg" });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    this.isPendingDownload = false;
                    this.downloadProgress = null;
                }
            };
            xhr.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    this.downloadProgress = percentComplete;
                }
            };
            xhr.send();
        },
        async downloadAllFiles() {
            for (const urlObj of this.urls) {
                if (this.isPendingDownload) {
                    await this.waitUntilDownloadComplete();
                }
                await this.downloadFile(urlObj.url, this.fileName(urlObj.key));
            }
        },
        waitUntilDownloadComplete() {
            return new Promise(resolve => {
                const checkDownloadStatus = () => {
                    if (!this.isPendingDownload) {
                        resolve();
                    } else {
                        setTimeout(checkDownloadStatus, 100);
                    }
                };
                checkDownloadStatus();
            });
        },
        handlePage(page) {
            let query = { page: page };
            this.$router.push({ path: '/profile', query });
        },
        async handleDownloadFile(bucket, key) {
            this.isPendingFile[key] = true;
            const { csrf } = useCsrf();
            const csrfToken = csrf;
            if (csrfToken) {
                try {
                    const s3Response = await $fetch(`/api/services/S3ServiceUrl`, {
                        method: 'POST',
                        body: {
                            'bucket': bucket,
                            'key': key,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            'Csrf-Token': csrfToken,
                        },
                    });

                    if (s3Response) {
                        this.urls = s3Response;
                        this.isPendingFile[key] = false;
                        this.visibleDownload = true;
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                console.error('CSRF token not available');
            }
        },
        async handleCreateReview() {
            const user = useSupabaseUser();
            const idUser = user.value.id;
            if (
                this.overall == '' ||
                this.performance == '' ||
                this.story == '' ||
                this.description.trim() == '' ||
                this.idProduct == '' ||
                idUser == ''
            ) {
                this.isFailed = true;
            } else {
                this.isFailed = false;
                this.isPendingSubmit = true;
                const { csrf } = useCsrf();
                const csrfToken = csrf;
                if (csrfToken) {
                    try {
                        const reviewResponse = await $fetch(`/api/product/review`, {
                            method: 'POST',
                            body: {
                                'overall': this.overall,
                                'performance': this.performance,
                                'story': this.story,
                                'description': this.description,
                                'idUser': idUser,
                                'idProduct': this.idProduct
                            },
                            headers: {
                                'Content-Type': 'application/json',
                                'Csrf-Token': csrfToken,
                            },
                        })

                        if (reviewResponse.data.error) {
                            this.isFailed = true;
                            this.isPendingSubmit = false;
                            this.messageError = 'Review already exists for this product and profile';
                        }

                        if (!reviewResponse.data.error) {
                            this.isSuccess = true;
                            this.isFailed = false;
                            this.isPendingSubmit = false;
                            const productIndex = this.transactions.findIndex(product => product.id === this.idProduct);
                            if (productIndex !== -1) {
                                this.transactions[productIndex].isReview = true;
                            }
                            setTimeout(() => {
                                this.visible = false;
                            }, 1000)
                        }
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                } else {
                    console.error('CSRF token not available');
                }
            }
        },
        handleReview(transaction) {
            this.visible = true;
            this.overall = 0;
            this.performance = 0;
            this.story = 0;
            this.description = null;
            this.nameBook = transaction.name;
            this.idProduct = transaction.id;
            this.isSuccess = false;
            this.isFailed = false;
            this.messageError = null;
        },
        handleApiProfile() {
            const supabase = useSupabaseClient();
            const profile = getUserProfiles(supabase);
            profile.then(async (value) => {
                this.load = false;
                if (value) {
                    this.load = true;
                    this.email = value[0].email;
                    this.roleName = value[0].role.name;
                }
            });
        },
        handleLogout() {
            this.isPending = true;
            const supabase = useSupabaseClient();
            const logout = logOutUser(supabase);
            logout.then(async (value) => {
                if (value) {
                    this.isPending = false;
                    navigateTo('/');
                }
            });
        },
        async handleTransaction() {
            this.isData = false;
            const user = useSupabaseUser();
            const { csrf } = useCsrf();
            const csrfToken = csrf;
            if (csrfToken) {
                try {
                    const transactionResponse = await $fetch(`/api/product/transaction/${user.value.id}`, {
                        method: 'POST',
                        body: {
                            page: this.page,
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            'Csrf-Token': csrfToken,
                        },
                    })
                    if (transactionResponse.data.error) {
                        this.isEmpty = true;
                        this.isData = true;
                    } else {
                        this.isEmpty = false;
                    }

                    if (transactionResponse.data) {
                        this.transactions = transactionResponse.data.data.data;
                        this.isData = true;
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                console.error('CSRF token not available');
            }
        },
        async handleCountTransaction() {
            this.isData = false;
            const user = useSupabaseUser();
            const { csrf } = useCsrf();
            const csrfToken = csrf;
            if (csrfToken) {
                try {
                    const countProductResponse = await $fetch(`/api/product/transactionCount/${user.value.id}`, {
                        method: 'POST',
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
        handleSlug(string) {
            const { $createSlug } = useNuxtApp();
            return $createSlug(string);
        },
    }
}
</script>
