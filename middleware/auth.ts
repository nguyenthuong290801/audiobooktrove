export default defineNuxtRouteMiddleware((to, _from) => {
    const user = useSupabaseUser();

    if (to.path == '/cart' || to.path == '/audiobooks' || to.path == '/profile') {
        if (!user.value) {
            return navigateTo('/login');
        }
    }
    
    if (
        to.path == '/login' ||
        to.path == '/changePassword' ||
        to.path == '/forgotPassword' ||
        to.path == '/register'
    ) {
        if (user.value) {
            return navigateTo('/profile');
        }
    }
});