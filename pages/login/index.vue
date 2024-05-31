<template>
    <div class="bg-main p-5">
        <div class="max-w-[340px] bg-white p-5 rounded-md mx-auto shadow">
            <a-alert v-if="success" class="select-none mb-4" message="Logged in successfully" type="success"
                show-icon />
            <a-alert v-if="failure" class="select-none mb-4"
                message="Login failed (or account has not been authenticated)" type="error" show-icon />
            <Button @click="signInWithOAuthGoogle(supabase)"
                class="button_hero--secondary w-full justify-center text-center mb-2" aria-label="button login">
                <span class="font-light text-base flex items-center gap-3">
                    <IconsGoogle class="bg-white rounded-full p-1 text-xl" />
                    Login with Google
                </span>
            </Button>
            <div class="flex items-center gap-3 select-none my-4">
                <div class="h-[0.5px] rounded-full w-full bg-black"></div>
                <span class="text-nowrap text-base">Or login with email</span>
                <div class="h-[0.5px] rounded-full w-full bg-black"></div>
            </div>
            <a-form layout="vertical" ref="formRef" name="custom-validation" :model="formState" :rules="rules"
                v-bind="layout" @finish="handleFinish" @validate="handleValidate" @finishFailed="handleFinishFailed">
                <a-form-item has-feedback label="Email" name="email">
                    <a-input v-model:value="formState.email" type="text" autocomplete="off"
                        placeholder="example@gmail.com" />
                </a-form-item>
                <a-form-item has-feedback label="Password" name="pass">
                    <a-input-password v-model:value="formState.pass" type="password" autocomplete="off"
                        placeholder="********" />
                </a-form-item>
                <div class="flex items-start justify-between">
                    <a-form-item name="remember" :wrapper-col="{ offset: 0, span: 24 }">
                        <a-checkbox v-model:checked="formState.remember"><span
                                class="text-base">Remember</span></a-checkbox>
                    </a-form-item>
                    <NuxtLink to="/forgotPassword" class="text-sm mt-1 font-normal hover:text-red-500">
                        <span class="text-base">Forgot password</span>
                    </NuxtLink>
                </div>
                <div class="flex justify-around my-3">
                    <NuxtTurnstile v-model="turnstile" />
                </div>
                <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
                    <Button :disabled="load" class="button_hero w-full justify-center mt-5" type="submit"
                        aria-label="Nút đăng nhập">
                        <span v-if="!load" class="font-normal text-base">
                            Login
                        </span>
                        <span v-else class="font-normal text-base flex gap-2 items-end">
                            Logging in
                            <IconsTadpole class="mb-[2px]" />
                        </span>
                    </Button>
                </a-form-item>
            </a-form>
            <NuxtLink to="/register" class="text-sm flex">
                <Button class="button_hero--secondary w-full justify-center">
                    <span class="text-base">
                        Register now!
                    </span>
                </Button>
            </NuxtLink>
        </div>
    </div>
</template>
<script lang="ts" setup>
definePageMeta({
    middleware: ["auth", "sound"],
});
import { signInWithOAuthGoogle, signInWithEmail } from '@/composables/useSupabase';
const supabase = useSupabaseClient();

const load = ref<boolean>(false);
const success = ref<boolean>(false);
const failure = ref<boolean>(false);
const turnstile = ref();
interface FormState {
    email: string;
    pass: string;
    remember: boolean;
}

const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
    email: '',
    pass: '',
    remember: true,
});

const getRememberAuth = async () => {
    try {
        const response = await useCsrfFetch('/api/auth/remember', {
            method: 'get'
        });
        if (response !== false) {
            const valueAuth = JSON.parse(response.data);
            formState.email = valueAuth[0].email;
            formState.pass = valueAuth[0].password;
        }
    } catch (error) {
        return error;
    }
}

getRememberAuth();

const validatePass = async (_rule: Rule, value: string) => {
    if (value === '') {
        return Promise.reject('Please enter password');
    } else if (value.length < 8) {
        return Promise.reject('Password must contain at least 8 characters');
    } else if (!/[a-z]/.test(value)) {
        return Promise.reject('Password must contain at least one lowercase letter');
    } else if (!/[A-Z]/.test(value)) {
        return Promise.reject('Password must contain at least one uppercase letter');
    } else if (!/[^A-Za-z0-9]/.test(value)) {
        return Promise.reject('Password must contain at least one special character');
    } else {
        if (formState.checkPass !== '') {
            formRef.value.validateFields('checkPass');
        }
        return Promise.resolve();
    }
};

const validateEmail = async (_rule: Rule, value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value === '') {
        return Promise.reject('Please enter email');
    } else if (!emailRegex.test(value)) {
        return Promise.reject('Invalid email');
    } else {
        return Promise.resolve();
    }
};

const rules: Record<string, Rule[]> = {
    email: [{ required: true, validator: validateEmail, trigger: 'change' }],
    pass: [{ required: true, validator: validatePass, trigger: 'change' }],
};

const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
};

const handleFinish = async (values: FormState) => {
    load.value = true;
    const { csrf } = useCsrf();
    const csrfToken = csrf;
    if (csrfToken) {
        try {
            const response = await $fetch('/api/validateTurnstile', {
                method: 'POST',
                body: {
                    token: turnstile.value
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Csrf-Token': csrfToken,
                },
            });

            if (response.success) {
                const result = signInWithEmail(supabase, formState.email, formState.pass);
                result.then(async (value) => {
                    load.value = false;
                    if (value.user) {
                        success.value = true;
                        if (formState.remember) {
                            let data = {
                                email: formState.email,
                                password: formState.pass
                            };

                            const response = await useCsrfFetch('/api/auth/remember', {
                                method: 'post',
                                body: data
                            });
                        }

                        setTimeout(() => {
                            success.value = false;
                            return navigateTo('/');
                        }, 1000);
                    } else {
                        failure.value = true;
                        setTimeout(() => {
                            failure.value = false;
                        }, 3000);
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    } else {
        console.error('CSRF token not available');
    }
};

const handleValidate = () => { }
const handleFinishFailed = () => { }
</script>