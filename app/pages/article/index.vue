<script setup lang="ts">
const loadingStore = useLoadingStore()

useSeoMeta({
  title: 'Article — CISF',
  description: 'Kumpulan Artikel yang ditulis oleh CISF dalam format yang interaktif'
})

interface ArticlePost {
  id: any;
  title: string;
  author: { displayName: string };
  content?: string;
  url: string;
}

interface ArticleData {
  items: ArticlePost[];
}

const pageTokens = ref<(string | undefined)[]>([undefined])
const currentPage = ref(0)

const { data: articleData, pending, error, refresh } = await useFetch<ArticleData>("/api/article/posts", {
  query: computed(() => ({
    pageToken: pageTokens.value[currentPage.value] ?? ''
  })),
  watch: false,
  lazy: true,
  server: false,
})

// Simpan nextPageToken setiap kali data baru datang
watch(articleData, (val: any) => {
  const token = val?.nextPageToken
  if (token && !pageTokens.value.includes(token)) {
    pageTokens.value.push(token)
  }
})

const hasNext = computed(() => !!(articleData.value as any)?.nextPageToken)
const hasPrev = computed(() => currentPage.value > 0)

const goNext = () => {
  currentPage.value++
  refresh()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goPrev = () => {
  currentPage.value--
  refresh()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const changePage = async (i: number) => {
  currentPage.value = i;
  await refresh();

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

onMounted(async () => {
  loadingStore.start()
  await nextTick()

  const images = document.querySelectorAll('.article img')
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

watch(pending, (val) => {
  if (val) {
    loadingStore.start()
  } else {
    loadingStore.finish()
  }
})

function extractImage(content: string | undefined): string | null {
  if (!content) return null;
  const match = content.match(/<img[^>]+src="([^">]+)"/)
  return match?.[1] ?? null
}

// Bersihkan URL Blogger dari angka ID di akhir (misal: _02099506626)
function cleanBloggerUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname
    // Hapus suffix angka panjang dan .html
    const cleaned = pathname
      .replace(/\.html$/, '')
      .replace(/_\d{8,}$/, '')  // hapus _XXXXXXXX angka di akhir
    return `/article${cleaned}`
  } catch {
    return url
  }
}

// Simpan mapping dari clean slug ke original blogger path
const slugToOriginalPath = ref<Record<string, string>>({})

const articles = computed(() => {
  if (!articleData.value?.items) return [];
  return articleData.value.items.map((post) => {
    const originalPath = new URL(post.url).pathname
    const cleanUrl = cleanBloggerUrl(post.url)
    // Simpan mapping untuk digunakan saat routing
    slugToOriginalPath.value[cleanUrl] = originalPath
    return {
      title: post.title,
      author: post.author.displayName,
      image: extractImage(post.content) || null,
      url: cleanUrl,
      originalPath,
    }
  });
});
</script>

<template>
  <main class="mx-auto px-6 py-10 bg-[#f7f7f7] min-h-screen">
    <div class="container mx-auto mt-28">
      <div class="mb-8">
        <p class="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2" v-reveal-right>Article</p>
        <h1 class="text-3xl sm:text-4xl font-normal text-gray-900" v-reveal-left>Artikel</h1>
        <div class="w-8 h-0.5 bg-gray-900 dark:bg-white mt-3" v-reveal-right></div>
      </div>
  
      <div v-if="pending" class="flex items-center gap-3 py-12 text-sm text-gray-400">
        <svg class="animate-spin w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        Memuat article...
      </div>
  
      <p v-else-if="error" class="py-12 text-sm text-red-400">
        Gagal memuat article.
      </p>
  
      <div
        v-else-if="articles.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <article
          v-for="(article, index) in articles"
          :key="index" 
          v-reveal
          class="group border article border-gray-100 dark:border-white/10 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 dark:hover:border-white/20 transition-colors cursor-pointer bg-white dark:bg-white/5"
        >
          <NuxtLink :to="article.url">
            <img
              v-if="article.image"
              :src="article.image"
              :alt="article.title"
              class="w-full aspect-[3/2] object-cover bg-gray-100 dark:bg-white/5 group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div
              v-else
              class="w-full aspect-[3/2] bg-gray-50 dark:bg-white/5 flex items-center justify-center"
            >
              <svg class="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9l4-4 5 5 3-3 6 6"/>
                <circle cx="8.5" cy="7.5" r="1.5"/>
              </svg>
            </div>
    
            <div class="px-4 py-3">
              <p class="text-[11px] uppercase tracking-wider text-gray-400 mb-1.5">
                {{ article.author }}
              </p>
              <h2 class="text-sm font-medium text-gray-900 dark:text-white leading-snug line-clamp-2">
                {{ article.title }}
              </h2>
            </div>
          </NuxtLink>
        </article>
      </div>

      <!-- Pagination -->
      <div
        v-if="!pending && articles.length && (hasNext || hasPrev)"
        class="flex justify-center items-center gap-3 mt-12"
      >
        <button
          @click="goPrev"
          :disabled="!hasPrev"
          class="flex items-center gap-2 px-5 py-2.5 text-xs font-medium tracking-widest uppercase border border-gray-200 dark:border-white/20 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 16 16">
            <path d="M10 4l-4 4 4 4"/>
          </svg>
          Sebelumnya
        </button>

        <!-- Nomor halaman -->
        <div class="flex items-center gap-1">
          <button
            v-for="(_, i) in pageTokens"
            :key="i"
            @click="changePage(i)"
            :class="[
              'w-8 h-8 text-xs rounded-lg transition-colors',
              currentPage === i
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/20'
            ]"
          >
            {{ i + 1 }}
          </button>
          <!-- Indikator halaman berikutnya belum diload -->
          <span v-if="hasNext && !pending" class="w-8 h-8 text-xs flex items-center justify-center text-gray-300">
            ...
          </span>
        </div>

        <button
          @click="goNext"
          :disabled="!hasNext"
          class="flex items-center gap-2 px-5 py-2.5 text-xs font-medium tracking-widest uppercase border border-gray-200 dark:border-white/20 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400"
        >
          Berikutnya
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 16 16">
            <path d="M6 4l4 4-4 4"/>
          </svg>
        </button>
      </div>
  
      <p v-if="!articles.length" class="py-12 text-sm text-gray-400">
        Tidak ada artikel ditemukan.
      </p>
    </div>
  </main>
</template>