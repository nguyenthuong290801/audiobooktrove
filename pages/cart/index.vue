<template>
    <div class="mx-auto max-w-6xl my-3 px-2 lg:px-0">
        <div class="flex flex-wrap justify-between">
            <BreadCrumb />
        </div>
        <div>
            <StepCart v-if="isData" :products="carts" />
        </div>
        <div v-if="!isData" class="flex justify-center">
            <ProgressSpinnerAudio class="my-5" />
        </div>
    </div>
</template>

<script>
export default {
    setup() {
        definePageMeta({
            middleware: ["auth", "sound"],
        });
    },
    data() {
        return {
            carts: [],
            isData: false,
        };
    },
    mounted() {
        this.handleApi();
    },
    methods: {
        async handleApi() {
            const { csrf } = useCsrf();
            const csrfToken = csrf;
            if (csrfToken) {
                try {
                    const cartResponse = await $fetch(`/api/cart`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Csrf-Token': csrfToken,
                        },
                    })
                    if (cartResponse.data) {
                        this.carts = JSON.parse(cartResponse.data);
                        this.isData = true;
                    } else {
                        this.isData = true;
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                console.error('CSRF token not available');
            }
        }
    }
}
</script>