<template>
    <div class="bg-main p-5">
        <div class="max-w-[340px] mx-auto rounded-md p-5 bg-white shadow">
            <a-alert v-if="success" class=" mb-4" message="Sign Up Success" type="success" show-icon />
            <a-alert v-if="failure" class=" mb-4"
                message="Registration failed (email already registered or error during registration)" type="error"
                show-icon />
            <Button @click="signInWithOAuthGoogle(supabase)" class="button_hero--secondary w-full justify-center mb-2"
                aria-label="Nút đăng nhập">
                <span class="font-light text-base flex items-center gap-1">
                    <IconsGoogle class="bg-white rounded-full p-1 text-xl" />
                    Login with Google
                </span>
            </Button>
            <div class="flex items-center gap-3  my-4">
                <div class="h-[0.5px] rounded-full w-full bg-black"></div>
                <span class="text-nowrap text-base">Or register with email</span>
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
                <a-form-item has-feedback label="Comfirm password" name="checkPass">
                    <a-input-password v-model:value="formState.checkPass" type="password" autocomplete="off"
                        placeholder="********" />
                </a-form-item>
                <p class="py-2 text-base">Note: Password must have 8 characters or more, contain uppercase letters,
                    lowercase letters and special characters.
                </p>
                <div class="flex justify-around my-3">
                    <NuxtTurnstile v-model="turnstile" />
                </div>
                <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
                    <Button :disabled="load" class="button_hero w-full justify-center mt-5" type="submit"
                        aria-label="Nút đăng nhập">
                        <span v-if="!load" class="font-normal text-base">
                            Register
                        </span>
                        <span v-else class="font-normal text-base flex gap-2 items-end">
                            Registering
                            <IconsTadpole class="mb-[2px]" />
                        </span>
                    </Button>
                </a-form-item>
            </a-form>
            <NuxtLink to="/login" class="text-sm">
                <Button class="button_hero--secondary w-full justify-center">
                    <span class="text-base">
                        Login now!
                    </span>
                </Button>
            </NuxtLink>
        </div>
    </div>
</template>
<script lang="ts" setup>
definePageMeta({
    middleware: "auth",
});
import { signInWithOAuthGoogle, signUpWithEmail } from '@/composables/useSupabase';
const supabase = useSupabaseClient();
const load = ref<boolean>(false);
const success = ref<boolean>(false);
const failure = ref<boolean>(false);
const turnstile = ref();
onMounted(() => {
    turnstile.value?.reset()
});
interface FormState {
    email: string;
    pass: string;
    checkPass: string;
}
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
    email: '',
    pass: '',
    checkPass: '',
});

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

const validatePass2 = async (_rule: Rule, value: string) => {
    if (value === '') {
        return Promise.reject('Please enter comfirm password');
    } else if (value !== formState.pass) {
        return Promise.reject("Passwords do not match");
    } else {
        return Promise.resolve();
    }
};

const validateEmail = async (_rule: Rule, value: string) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
    checkPass: [{ required: true, validator: validatePass2, trigger: 'change' }],
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

            if (response) {
                const responseCheck = await $fetch('/api/auth/email/check', {
                    method: 'post',
                    body: {
                        email: formState.email
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Csrf-Token': csrfToken,
                    },
                });

                if (responseCheck) {
                    if (response.success) {
                        const resultsignUp = signUpWithEmail(supabase, formState.email, formState.pass);
                        resultsignUp.then((dataSignUp) => {
                            load.value = false;
                            if (dataSignUp) {
                                success.value = true;
                                setTimeout(() => {
                                    success.value = false;
                                    return navigateTo('/login');
                                }, 1000);
                            } else {
                                failure.value = true;
                                setTimeout(() => {
                                    failure.value = false;
                                }, 3000);
                            }
                        }).catch((error) => {
                            failure.value = true;
                            setTimeout(() => {
                                failure.value = false;
                            }, 3000);
                        });
                    }
                } else {
                    load.value = false;
                    failure.value = true;
                    setTimeout(() => {
                        failure.value = false;
                    }, 3000);
                }
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