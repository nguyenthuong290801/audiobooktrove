<template>
  <div>
    <div v-if="isData">
      <Hero :hero="hero" />
      <div v-for="(category, index) in categories" :key="index">
        <SlideShowProduct v-if="products[category.id]" :slidesPerView="slidesPerView" :breakpoints="breakpoints"
          :products="products[category.id]" :category="category.name" />
        <div v-else class="basis-full lg:basis-9/12">
          <div class="flex flex-col items-center justify-center">
            <IconsEmpty class="w-20 h-20 text-main" />
            <span class="text-sm">There are no products in {{ category.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex justify-center">
      <ProgressSpinnerAudio class="my-5" />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    definePageMeta({
      middleware: "sound",
    });
  },
  data() {
    return {
      slidesPerView: 5,
      breakpoints: {
        100: { slidesPerView: 2 },
        640: { slidesPerView: 3 },
        960: { slidesPerView: 4 },
        1280: { slidesPerView: 5 },
      },
      isData: false,
      categories: [],
      products: [],
      hero: {}
    };
  },
  mounted() {
    this.handleApi();
  },
  methods: {
    saveToLocalStorage(key, data) {
      const expiryDate = new Date().getTime() + 3 * 24 * 60 * 60 * 1000;
      const item = {
        data: data,
        expiry: expiryDate,
      };
      localStorage.setItem(key, JSON.stringify(item));
    },
    loadFromLocalStorage(key) {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) {
        return null;
      }
      const item = JSON.parse(itemStr);
      const now = new Date().getTime();
      if (now > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.data;
    },
    async handleApi() {
      const { csrf } = useCsrf();
      const csrfToken = csrf;
      if (csrfToken) {
        try {
          const [heroResponse, productResponse] = await Promise.all([
            $fetch('/api/hero', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Csrf-Token': csrfToken
              }
            }),
            $fetch('/api/product/home', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Csrf-Token': csrfToken
              }
            })
          ]);

          if (heroResponse.data) {
            this.hero = heroResponse.data.data;
          }

          if (productResponse.data) {
            this.categories = productResponse.data.data.category;
            this.products = productResponse.data.data.product;
          }
          
          this.isData = true;

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        console.error('CSRF token not available');
      }
    }
  }
}
</script>