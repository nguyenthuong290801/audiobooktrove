export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();
    const api = runtimeConfig.api;
    const body = await readBody(event);
    const params = new URLSearchParams();
    let pageNumber = parseInt(body.page);
    let category = body.category || null;
    let sort = body.sort || null;
    let keyword = body.keyword || null;
    let url = `${api}/products?page=${pageNumber + 1}`;

    if (category) {
        params.append('category', category);
    }
    if (sort) {
        params.append('sort', sort);
    }
    if (keyword) {
        params.append('keyword', keyword);
    }
    if (params.toString()) {
        url += `&${params.toString()}`;
    }

    try {
        const res = await $fetch(url);
        return {
            status: 201,
            message: 'Success fetching products.',
            data: res,
            url: url
        };
    } catch (error) {
        return sendError(event, createError({
            statusCode: 500,
            message: 'Error fetching products.'
        }));
    }
});
