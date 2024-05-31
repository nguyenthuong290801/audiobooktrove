import { serverSupabaseServiceRole } from '#supabase/server';

export default eventHandler(async (event) => {
    const body = await readBody(event);
    try {
        const client = serverSupabaseServiceRole(event);
        
        const { data, error } = await client.auth.updateUser({
            email: body.email,
            password: body.passowrd,
        })

        if (error) throw error;
        
        return data
    } catch (error) {
        return false;
    }
});