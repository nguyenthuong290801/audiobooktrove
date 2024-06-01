// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap'
        }
      ]
    },
  },
  site: {
    url: 'https://audiobooktrove.com',
    name: 'Audiobooktrove',
    description: 'Register as a member and buy books with a 5% discount at Audiobook Trove. Discover thousands of high-quality audiobooks, from novels and self-help books to educational materials. Enjoy audiobooks anytime, anywhere.',
    defaultLocale: 'en',
  },
  env: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
  },
  runtimeConfig: {
    api: process.env.API || '',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseKey: process.env.SUPABASE_KEY || '',
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || '',
    turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || '',
    bucket: process.env.B2_BUCKET || '',
    endpoint: process.env.B2_ENDPOINT || '',
    region: process.env.B2_REGION || '',
    accessKeyId: process.env.B2_KEY_ID || '',
    secretAccessKey: process.env.B2_SECRET_KEY || '',
    StripeSecretKeySk: process.env.STRIPE_SECRET_KEY_SK || '',
    StripeSecretKeyPk: process.env.STRIPE_SECRET_KEY_PK || '',
    turnstile: {
      secretKey: process.env.TURNSTILE_SECRET_KEY,
    }
  },
  css: [
    './assets/scss/main.scss',
    'primevue/resources/themes/aura-light-amber/theme.css',
    'primeicons/primeicons.css',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  plugins: [
    { src: '~/plugins/slug' },
  ],
  modules: [
    'nuxt-primevue',
    '@unlok-co/nuxt-stripe',
    '@ant-design-vue/nuxt',
    'nuxt-swiper',
    '@nuxtjs/supabase',
    '@nuxtjs/turnstile',
    '@nuxtjs/tailwindcss',
    'nuxt-security',
    'nuxt-time',
    "@nuxtjs/seo",
  ],
  security: {
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 300000,
      headers: false,
      driver: {
        name: 'lruCache'
      },
      throwError: true
    },
    csrf: true,
    headers: {
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    },
  },
  supabase: {
    redirect: false
  },
  turnstile: {
    siteKey: process.env.TURNSTILE_SITE_KEY,
    addValidateEndpoint: true,
  },
  primevue: {
    options: {
      ripple: true,
    },
    components: {
      include: [
        'Button',
        'InputGroup',
        'InputText',
        'Avatar',
        'TabMenu',
        'Accordion',
        'AccordionTab',
        'Dialog',
        'Breadcrumb',
        'FloatLabel',
        'TreeSelect',
        'Listbox',
        'MegaMenu',
        'Sidebar',
        'Tooltip',
        'Paginator',
        'PanelMenu',
        'TieredMenu',
        'ProgressSpinner',
        'Steps',
        'Stepper',
        'StepperPanel',
        'Fieldset',
        'Skeleton',
        'Rating',
        'IconField',
        'InputIcon',
        'Textarea'
      ]
    }
  },
  stripe: {
    server: {
      key: process.env.STRIPE_SECRET_KEY_SK,
      options: {
      },
    },
    client: {
      key: process.env.STRIPE_SECRET_KEY_PK,
      options: {},
    },
  },
})