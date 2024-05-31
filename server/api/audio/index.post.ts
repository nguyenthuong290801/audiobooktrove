export default defineEventHandler(async (event) => {
    const url = 'https://f005.backblazeb2.com/file/audiobooktrove/2020/3.MYSTERY+%26+THRILLER/The+Guest+List/The-Guest-List-000.mp3';
    try {
        const res = await $fetch(url);
        return res;
    } catch (error) {
        
    }
})