import { serverSupabaseServiceRole } from '#supabase/server';

export default eventHandler(async (event) => {
    const body = await readBody(event);
    try {
        const client = serverSupabaseServiceRole(event);

        const { error } = await client
            .from('profiles')
            .select('id')
            .eq('email', body.email)
            .single();

            if (error && error.details == 'The result contains 0 rows') {
                return true;
            }

            return false;
    } catch (error) {
        return false;
    }
});
