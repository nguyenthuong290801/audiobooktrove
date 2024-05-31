export default defineEventHandler(async (event) => {
    try {
        let data = getCookie(event, 'remember');
        if (data) {
            deleteCookie(event, 'remember');
            return {
                statusCode: 200,
                message: 'Success delete cookie remember.',
                data: data
            }
        } else {
            return sendError(event, createError({
                statusCode: 500,
                message: 'An error occurred while delete cookie remember'
            }));
        }
    } catch (error) {
        return sendError(event, createError({
            statusCode: 500,
            message: 'An error occurred while remember login.'
        }));
    }
});