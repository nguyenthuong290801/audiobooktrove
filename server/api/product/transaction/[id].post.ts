export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();
    const body = await readBody(event);
    let pageNumber = parseInt(body.page);
    const api = runtimeConfig.api;
    const id = getRouterParam(event, 'id');
    const url = `${api}/transaction/${id}?page=${pageNumber + 1}`;
    try {
        const res = await $fetch(url);

        return {
            status: 201,
            message: 'Success fetching transaction.',
            data: res,
        };
    } catch (error) {
        return sendError(event, createError({
            statusCode: 500,
            message: 'Error fetching transaction.'
        }));
    }
})