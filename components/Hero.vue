<template>
  <div class="bg-hero bg-cover bg-center flex items-center" :style="{ backgroundImage: `url(${hero.background})` }">
    <div class="max-w-6xl px-2 lg:px-0 mx-auto basis-full mt-5 z-10">
      <div class="flex flex-wrap items-center">
        <div class="basis-full lg:basis-7/12">
          <div class="text-white text-left font-medium text-xl w-3/3 lg:w-2/3">
            {{ hero.sub_title ?? '' }}
          </div>
          <div class="text-white text-left font-bold text-2xl lg:text-4xl w-3/3 lg:w-2/3" v-html="hero.title">
          </div>
          <div class="w-[216px]">
            <NuxtLink to="/audiobooks" class="">
              <Button class="button_hero mt-5">
                <span>
                  See more audiobooks
                </span>
                <svg fill="currentColor" viewBox="0 0 24 24" class="icon">
                  <path clip-rule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                    fill-rule="evenodd"></path>
                </svg>
              </Button>
            </NuxtLink>
          </div>
          <div class="text-sm mt-5 text-slate-300">
            {{ hero.description ?? '' }}
          </div>
        </div>
        <div class="basis-full flex justify-center lg:basis-5/12 mt-3">
          <NuxtImg format="webp" placeholder preload loading="lazy" class="w-full shadow-img" :src="hero.image" alt="hero" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hero: {
      type: Object,
    },
  }
}
</script>

<style>
.bg-hero {
  position: relative;
  background-repeat: no-repeat;
  background-position: center;
  background-color: black;
}

.bg-hero::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9));
}

.shadow-img {
  filter: drop-shadow(15px -20px 50px rgba(255, 0, 43, 0.603));
}
</style>