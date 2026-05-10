// https://nuxt.com/docs/api/configuration/nuxt-config
/// <reference types="node" />  

export default defineNuxtConfig({
  srcDir: 'app/',
  serverDir: 'server/',
  compatibilityDate: '2025-07-15',
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  tailwindcss: {
    cssPath: ['./public/assets/css/style.css', { injectPosition: "first" }],
  },
  devtools: { enabled: true },
  app: {
    head: {
      script: [
        { src: 'https://kit.fontawesome.com/489cf10559.js', defer: true }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/assets/img/logo_cisf.png' } 
      ]
    }
  },
  runtimeConfig: {
    bloggerApiKey: process.env.BLOGGER_API_KEY,
    bloggerBlogId: process.env.BLOGGER_BLOG_ID
  }
})
