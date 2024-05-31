export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();
    const api = runtimeConfig.api;
    const url = `${api}/category-product-footer`
    try {
        const res = await $fetch(url);
        return {
            status: 201,
            message: 'Success fetching product category footer.',
            data: res,
        };
    } catch (error) {
        return sendError(event, createError({
            statusCode: 500,
            message: 'Error fetching product category footer.'
        }));
    }
})