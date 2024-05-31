interface CartItem {
    id: number;
}

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        let { id }: { id: number } = body;

        let getCarts = getCookie(event, 'cart');

        if (getCarts !== undefined) {
            let allCarts: CartItem[] = JSON.parse(getCarts);
            const index: number = allCarts.findIndex((item: CartItem) => item.id === id);
            if (index !== -1) {
                allCarts.splice(index, 1);
                setCookie(event, 'cart', JSON.stringify(allCarts));
                return {
                    statusCode: 200,
                    message: 'Success delete cookie cart.',
                }
            }
        }
    } catch (err) {
        console.error('Error adding product to cart:', err);
        return sendError(event, createError({
            statusCode: 500,
            message: 'An error occurred while delete cookie cart.'
        }));
    }
});