<template>
    <a-config-provider :theme="{
        token: {
            colorPrimary: '#F15A29',
        },
    }">
        <div class="">
            <Header />
            <slot />
            <Footer />
        </div>
    </a-config-provider>
</template>