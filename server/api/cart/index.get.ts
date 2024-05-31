export default defineEventHandler(async (event) => {
    try {
        let data = getCookie(event, 'cart');
        if (data) {
            return {
                statusCode: 200,
                message: 'Success get cookie cart.',
                data: data
            }
        } else {
            return {
                statusCode: 404,
                message: 'Empty cart. No items found.'
            };
        }
    } catch (err) {
        return sendError(event, createError({
            statusCode: 500,
            message: 'An error occurred while get cookie cart'
        }));
    }
});
