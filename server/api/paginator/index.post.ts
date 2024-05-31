    export default defineEventHandler(async (event) => {
        const runtimeConfig = useRuntimeConfig();
        const api = runtimeConfig.api;
        const body = await readBody(event);
        let category = body.category || null;
        let name = body.name || null;
        let url = `${api}/count-product`;
        const params = new URLSearchParams();
        if (category) {
            params.append('category', category);
        }
        if (name) {
            params.append('name', name);
        }
    
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
    try {
        const res = await $fetch(url);
        return {
            status: 201,
            message: 'Success fetching count page.',
            data: res,
        };
    } catch (error) {
        return sendError(event, createError({
            statusCode: 500,
            message: 'Error fetching count page.'
        }));
    }
})