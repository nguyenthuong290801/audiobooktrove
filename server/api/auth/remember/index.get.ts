export default defineEventHandler(async (event) => {
    try {
        let data = getCookie(event, 'remember');
        if (data) {
            return {
                statusCode: 200,
                message: 'Success get cookie remember.',
                data: data
            }
        } else {
            return false;
        }
    } catch (error) {
        return sendError(event, createError({
            statusCode: 500,
            message: 'An error occurred while remember login.'
        }));
    }
});