export default defineNuxtPlugin(nuxtApp => {
    const createSlug = (str: string) => {
        str = str.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\sđĐ\/]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').replace(/[đ]/g, 'd');
        return str;
    };

    return {
        provide: {
            createSlug: createSlug
        }
    };
});