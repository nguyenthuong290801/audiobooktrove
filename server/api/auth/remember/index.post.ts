export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        let { email, password }: { email: string, password: string } = body;
        const auth = [{ email, password }];
        setCookie(event, 'remember', JSON.stringify(auth));
        return {
            statusCode: 201,
            message: 'Success remember login.',
        }
    } catch (error) {
        return sendError(event, createError({
            statusCode: 500,
            message: 'An error occurred while remember login.'
        }));
    }
});