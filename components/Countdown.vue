<template>
    <div>
        <div v-if="timeLeft > 0 && !expired">
            <div class="text-center text-sm font-medium p-2 border-[1px] border-orange-500 rounded-md mt-1 shadow">
                {{ formatTime(timeLeft) }}
            </div>
        </div>
        <div v-else>
            <div class="text-center text-sm font-medium p-2 border-[1px] border-orange-500 rounded-md mt-1 shadow">
                Sale expires!
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        endTime: {
            type: String,
            required: true
        },
        productId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            timeLeft: this.calculateTimeLeft(),
            expired: false
        }
    },
    mounted() {
        this.startCountdown();
    },
    beforeDestroy() {
        clearInterval(this.interval);
    },
    methods: {
        calculateTimeLeft() {
            const end = new Date(this.endTime).getTime();
            const now = new Date().getTime();
            return Math.max(end - now, 0);
        },
        startCountdown() {
            this.interval = setInterval(() => {
                this.timeLeft = this.calculateTimeLeft();
                if (this.timeLeft <= 0) {
                    this.expired = true;
                    clearInterval(this.interval);
                    this.$emit('expired', this.productId);
                }
            }, 1000);
        },
        formatTime(ms) {
            const seconds = Math.floor(ms / 1000) % 60;
            const minutes = Math.floor(ms / (1000 * 60)) % 60;
            const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
            const days = Math.floor(ms / (1000 * 60 * 60 * 24));
            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }
}
</script>
