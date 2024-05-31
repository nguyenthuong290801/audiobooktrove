<template>
    <div class="bg-main p-5">
        <div class="max-w-[340px] mx-auto rounded-md p-5 bg-white shadow">
            <a-alert v-if="success" class="mb-4"
                message="Submitted successfully! Please check your email again" type="success" show-icon />
            <a-alert v-if="failure" class="mb-4" message="Send failed! Or the email is not registered"
                type="error" show-icon />
            <a-form layout="vertical" ref="formRef" name="custom-validation" :model="formState" :rules="rules"
                v-bind="layout" @finish="handleFinish" @validate="handleValidate" @finishFailed="handleFinishFailed">
                <a-form-item has-feedback label="Email" name="email">
                    <a-input v-model:value="formState.email" type="text" autocomplete="off"
                        placeholder="example@gmail.com" />
                </a-form-item>
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
            <NuxtLink to="/login" class="text-sm">
                <Button class="button_hero--secondary w-full justify-center">
                    <span class="text-base">
                        Return to the login!
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
import { resetPassword } from '@/composables/useSupabase';
const supabase = useSupabaseClient();
const load = ref<boolean>(false);
const success = ref<boolean>(false);
const failure = ref<boolean>(false);
interface FormState {
    email: string;
}

const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
    email: '',
});

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
};

const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
};

const handleFinish = (values: FormState) => {
    load.value = true;
    const result = resetPassword(supabase, formState.email);
    result.then(async (value) => {
        load.value = false;
        if (value) {
            success.value = true;
        } else {
            failure.value = true;
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