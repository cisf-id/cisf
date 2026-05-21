<script setup lang="ts">
const loadingStore = useLoadingStore()
loadingStore.start()

const { data: articleData, pending } = await useFetch("/api/article/top5Articles", {
  lazy: true,
  server: false
})
const { locale } = useI18n()

onMounted(async () => {
  loadingStore.start()
  await nextTick()

  const images = document.querySelectorAll('.popular-section img')
  const imagePromises = Array.from(images).map((img) => {
    if ((img as HTMLImageElement).complete) return Promise.resolve()
    return new Promise((resolve) => {
      img.addEventListener('load', resolve)
      img.addEventListener('error', resolve)
    })
  })

  await Promise.all(imagePromises)
  loadingStore.finish()
})

function extractImage(content: string): string | null {
  const match = content?.match(/<img[^>]+src="([^">]+)"/)
  return match?.[1] ?? null
}

const articles = computed(() => {
  if (!articleData.value || typeof articleData.value !== 'object' || !('items' in articleData.value) || !Array.isArray((articleData.value as any).items)) return []
  return (articleData.value as any).items.map((post: any) => ({
    id: post.id,
    title: parseLocaleText(post.title, locale.value),
    author: post.author.displayName,
    date: post.published,
    image: extractImage(post.content),
    url: `/article${new URL(post.url).pathname}`
  }))
})

const featuredPost = computed(() => {
  if (!articles.value.length) return null
  const post = articles.value[0]
  return {
    ...post,
    date: new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    category: 'Article'
  }
})

const sidePosts = computed(() => {
  return articles.value.slice(1, 5).map((post: any) => ({
    ...post,
    date: new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    category: 'Article'
  }))
})
</script>

<template>
  <section class="popular-section py-10 sm:py-14 lg:py-16 border-b border-gray-100 dark:border-white/10 bg-[#ffffff]">
    <div class="container mx-auto sm:px-4">

      <div v-reveal>
        <p class="text-[10px] tracking-widest uppercase text-gray-400 mb-1">{{ $t('article.label') }}</p>
        <h2 class="text-xl sm:text-2xl font-medium">{{ $t('article.title') }}</h2>
        <div class="w-8 h-0.5 bg-gray-900 dark:bg-white mt-3 mb-6 sm:mb-7"></div>
      </div>

      <!-- Loaded state -->
      <div v-if="!pending" class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

        <!-- Featured post -->
        <div class="lg:border-r border-gray-100 dark:border-white/10 lg:pr-8" v-reveal-left>
          <div v-if="featuredPost">
            <div class="w-full aspect-video bg-gray-100 dark:bg-white/5 rounded-lg mb-4 overflow-hidden">
              <img
                v-if="featuredPost.image"
                :src="featuredPost.image"
                :alt="featuredPost.title"
                class="w-full h-full object-cover"
              />
            </div>
            <p class="text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">{{ featuredPost.category }}</p>
            <h3 class="text-sm sm:text-base font-medium leading-snug mb-2 line-clamp-3">{{ featuredPost.title }}</h3>
            <p class="text-xs text-gray-400">{{ featuredPost.author }} · {{ featuredPost.date }}</p>
            <NuxtLink
              :to="featuredPost.url"
              class="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white mt-4 transition-colors group"
            >
              {{ $t('article.readMore') }}
              <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 16 16">
                <path d="M3 8h10M9 4l4 4-4 4"/>
              </svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Side posts -->
        <div v-reveal-right>
          <div
            v-for="(post, i) in sidePosts"
            :key="i"
            class="grid grid-cols-[40px_1fr] sm:grid-cols-[48px_1fr] gap-3 py-3 sm:py-3.5 border-b border-gray-100 dark:border-white/10 last:border-0"
          >
            <span class="text-xl sm:text-2xl font-medium text-gray-300 dark:text-white/10 leading-none">
              {{ String(i as number + 1).padStart(2, '0') }}
            </span>
            <div>
              <NuxtLink :to="post.url" class="block group">
                <p class="text-[12px] sm:text-[13px] leading-snug mb-1 group-hover:font-medium transition-all line-clamp-2">{{ post.title }}</p>
                <p class="text-[11px] text-gray-400">{{ post.category }} · {{ post.date }}</p>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Skeleton -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div class="lg:border-r border-gray-100 lg:pr-8">
          <div class="w-full aspect-video bg-gray-200 dark:bg-white/5 rounded-lg mb-4 animate-pulse"></div>
          <div class="h-3 w-20 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div class="h-5 w-full bg-gray-200 rounded mb-1 animate-pulse"></div>
          <div class="h-5 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div class="h-3 w-40 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div class="space-y-4">
          <div v-for="i in 4" :key="i" class="grid grid-cols-[48px_1fr] gap-3 py-3 border-b border-gray-100 animate-pulse">
            <div class="w-8 h-8 bg-gray-200 rounded"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded w-full"></div>
              <div class="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>