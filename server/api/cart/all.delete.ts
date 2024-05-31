interface CartItem {
    id: number;
}

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        let { ids }: { ids: number[] } = body;

        let getCarts = getCookie(event, 'cart');

        if (getCarts !== undefined) {
            let allCarts: CartItem[] = JSON.parse(getCarts);
            
            ids.forEach(id => {
                const index = allCarts.findIndex((item: CartItem) => item.id === id);
                if (index !== -1) {
                    allCarts.splice(index, 1);
                }
            });

            setCookie(event, 'cart', JSON.stringify(allCarts));
            
            return {
                statusCode: 200,
                message: 'Success delete cookie cart.',
            };
        } else {
            return {
                statusCode: 400,
                message: 'Cart is empty or not found.',
            };
        }
    } catch (err) {
        console.error('Error deleting product(s) from cart:', err);
        return sendError(event, createError({
            statusCode: 500,
            message: 'An error occurred while deleting cookie cart.',
        }));
    }
});
