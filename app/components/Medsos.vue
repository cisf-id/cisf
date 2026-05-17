<script setup lang="ts">
const instagramPosts = [
  {
    id: '1',
    image: '/assets/img/1stpost.jpg',
    likes: 12,
    comments: 1,
    type: 'IMAGE', 
    url: 'https://www.instagram.com/p/DX_I4m0ERSM/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    id: '2',
    image: '/assets/img/2ndpost.jpg',
    likes: 65,
    comments: 4,
    type: 'IMAGE',
    url: 'https://www.instagram.com/p/DX8vFcCx_PA/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    id: '3',
    image: '/assets/img/3rdpost.jpg',
    likes: 3,
    comments: 0,
    type: 'IMAGE',
    url: 'https://www.instagram.com/p/DX0E5zVk1df/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    id: '4',
    image: '/assets/img/4thpost.jpg',
    likes: 10,
    comments: 0,
    type: 'CAROUSEL_ALBUM',
    url: 'https://www.instagram.com/p/DXxh5Ljk24x/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    id: '5',
    image: '/assets/img/5thpost.jpg',
    likes: 0,
    comments: 9,
    type: 'IMAGE',
    url: 'https://www.instagram.com/p/DXvxncNkcZu/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
]

const formatCount = (n: number) =>
  n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n)
</script>

<template>
  <section class="py-10 sm:py-14 lg:py-16 border-b border-gray-100 dark:border-white/10 bg-[#ffffff] dark:bg-[#111]">
    <div class="container mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div class="flex justify-between items-end mb-7" v-reveal>
        <div>
          <p class="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Social Media</p>
          <h2 class="text-xl sm:text-2xl font-medium">Instagram</h2>
          <div class="w-8 h-0.5 bg-gray-900 dark:bg-white mt-3"></div>
        </div>

        <a
          href="https://www.instagram.com/cisf.indonesia/"
          target="_blank"
          rel="noopener"
          class="inline-flex gap-3 md:text-[11px] text-[8px] tracking-widest uppercase text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/15 hover:border-gray-400 dark:hover:border-white/30 px-3 py-2 rounded transition-all duration-200 sm:w-auto w-[110px] justify-center items-center"
        >
          <svg class="w-3.5 h-3.5 hidden sm:block" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <div class="h-[14px]">
            <span class="hidden sm:inline">Follow</span>
            @cisf.indonesia
          </div>
        </a>
      </div>

      <!-- Grid -->
      <div
        class="grid lg:gap-8 gap-2"
        style="grid-template-columns: repeat(4, 1fr); grid-template-rows: auto;"
        v-reveal
      >
        <a
          v-for="(post, i) in instagramPosts"
          :key="post.id"
          :href="post.url"
          target="_blank"
          rel="noopener"
          :class="[
            'relative group overflow-hidden rounded-lg bg-gray-100 dark:bg-white/5',
            i === 0 ? 'col-span-2 row-span-2' : ''
          ]"
          :style="{ aspectRatio: '4/5' }"
          v-reveal
        >
            <!-- Gambar -->
            <img
              v-if="post.image"
              :src="post.image"
              alt="Instagram Post"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
  
            <!-- Placeholder jika tidak ada gambar -->
            <div
              v-else
              class="w-full h-full flex items-center justify-center"
            >
              <svg class="w-7 h-7 text-gray-300 dark:text-white/20" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9l4-4 5 5 3-3 6 6"/>
                <circle cx="8.5" cy="7.5" r="1.5"/>
              </svg>
            </div>
  
            <!-- Overlay hover -->
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center flex-col md:flex-row md:gap-4 gap-2">
              <!-- Likes -->
              <div class="flex items-center gap-1.5 text-white text-xs font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <svg class="w-3.5 h-3.5" fill="white" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                {{ formatCount(post.likes) }}
              </div>
              <!-- Comments -->
              <div class="flex items-center gap-1.5 text-white text-xs font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
                <svg class="w-3.5 h-3.5" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                {{ post.comments }}
              </div>
            </div>
  
            <!-- Badge tipe konten (video / carousel) -->
            <div class="absolute top-2 right-2 opacity-90">
              <!-- Video -->
              <svg v-if="post.type === 'VIDEO'" class="md:w-4 md:h-4 w-1.5 h-1.5" fill="white" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <!-- Carousel -->
              <svg v-else-if="post.type === 'CAROUSEL_ALBUM'" class="md:w-4 md:h-4 w-1.5 h-1.5" fill="white" viewBox="0 0 24 24">
                <path d="M2 6h2v12H2zm3 0h2v12H5zm14-4H9a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2z"/>
              </svg>
            </div>
        </a>
      </div>
    </div>
  </section>
</template>