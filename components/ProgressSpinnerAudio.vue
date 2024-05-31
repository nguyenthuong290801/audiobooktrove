<template>
    <div class="loader">
        <div class="l"></div>
        <div class="l"></div>
        <div class="l"></div>
        <div class="l"></div>
        <div class="l"></div>
        <div class="l"></div>
        <div class="l"></div>
        <div class="l"></div>
        <div class="l"></div>
    </div>
</template>

<style>
.loader {
    display: flex;
}

.l,
.l:nth-child(9) {
    margin: 0.15em;
    border-radius: 5em;
    width: 0.4em;
    background-color: #F15A29;
    height: 3em;
    animation: load_5186 cubic-bezier(.41, .44, .72, .69) 2s infinite;
}

.l:nth-child(2),
.l:nth-child(8) {
    background-color: #F15A29;
    animation-delay: .25s;
}

.l:nth-child(3),
.l:nth-child(7) {
    background-color: #F15A29;
    animation-delay: .5s;
}

.l:nth-child(4),
.l:nth-child(6) {
    background-color: #f48c17;
    animation-delay: .75s;
}

.l:nth-child(5) {
    background-color: #f5af19;
    animation-delay: 1s;
}

@keyframes load_5186 {
    0% {
        transform: scaleY(1);
    }

    100% {
        transform: scaleY(-1);
    }
}
</style>