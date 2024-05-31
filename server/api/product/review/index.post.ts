export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();
    const api = runtimeConfig.api;
    const body = await readBody(event);

    const requiredFields = ['overall', 'performance', 'story', 'description', 'idUser', 'idProduct'];
    for (const field of requiredFields) {
        if (!body[field]) {
            return sendError(event, createError({
                statusCode: 400,
                message: `${field} is required`
            }));
        }
    }

    const url = `${api}/review`;
    try {
        const res = await $fetch(url, {
            method: 'POST',
            body: {
                'overall': body.overall,
                'performance': body.performance,
                'story': body.story,
                'description': body.description,
                'profile_id': body.idUser,
                'product_id': body.idProduct
            }
        });
        return {
            status: 201,
            message: 'Success fetching products home.',
            data: res,
        };
    } catch (error) {
        return sendError(event, createError({
            statusCode: 500,
            message: 'Error fetching products home.'
        }));
    }
})