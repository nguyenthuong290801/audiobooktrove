export const signInWithOAuthGoogle = async (supabase: any) => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })
        if (error) throw (error);
    } catch (error) {
        return error;
    }
}

export const signInWithEmail = async (supabase: any, email: string, password: string) => {
    try {
        let { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        if (error) throw (error);
        return data;
    } catch (error) {
        return error;
    }
}

export const signUpWithEmail = async (supabase: any, email: string, password: string) => {
    let { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });
    if (error != null) {
        return false;
    }
    return true;
}

export const logOutUser = async (supabase: any) => {
    try {
        let { error } = await supabase.auth.signOut();
        if (error) throw (error);
        return true;
    } catch (error) {
        return error;
    }
}

export const resetPassword = async (supabase: any, email: string) => {
    try {
        let { data, error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw (error);
        return true;
    } catch (error) {
        return error;
    }
}

export const updatePassword = async (supabase: any, email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.updateUser({
            email: email,
            password: password,
        })
        if (error) throw (error);
        return true;
    } catch (error) {
        return error;
    }
}

export const getUserProfiles = async (supabase: any) => {
    try {

        let { data: profiles, error } = await supabase
            .from('profiles')
            .select(`email,role:role_id(name)`)
        if (error) throw (error);
        return profiles;
    } catch (error) {
        return error;
    }
}