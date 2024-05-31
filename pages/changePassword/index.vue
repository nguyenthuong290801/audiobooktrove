<template>
    <div class="bg-main p-5">
        <div class="max-w-[340px] mx-auto rounded-md p-5 bg-white shadow">
            <a-alert v-if="success" class="mb-4" message="Reset password success" type="success" show-icon />
            <a-alert v-if="failure" class="mb-4"
                message="Reset password failed" type="error"
                show-icon />
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
                <p class="py-2 test-base">Note: Password must have 8 characters or more, contain uppercase letters,
                    lowercase letters and special characters.
                </p>
                <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
                    <Button :disabled="load" class="button_hero w-full justify-center mt-5" type="submit"
                        aria-label="Nút đăng nhập">
                        <span v-if="!load" class="font-normal text-base">
                            Send
                        </span>
                        <span v-else class="font-normal text-base flex gap-2 items-end">
                            Sending
                            <IconsTadpole class="mb-[2px]" />
                        </span>
                    </Button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
<script lang="ts" setup>
definePageMeta({
    middleware: "auth",
});
import { updatePassword } from '@/composables/useSupabase';
const supabase = useSupabaseClient();
const load = ref<boolean>(false);
const success = ref<boolean>(false);
const failure = ref<boolean>(false);
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
    const result = updatePassword(supabase, formState.email, formState.pass);
    result.then((value) => {
        load.value = false;
        if (value) {
            success.value = true;
            setTimeout(() => {
                success.value = false;
                return navigateTo('/login');
            }, 1000);
        } else {
            setTimeout(() => {
                failure.value = false;
            }, 3000);
        }
    });
};


const handleValidate = () => {

}

const handleFinishFailed = () => {

}
</script>