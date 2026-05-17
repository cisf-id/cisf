<script setup lang="ts">
const loadingStore = useLoadingStore()
const route = useRoute()

useSeoMeta({
  title: 'Research — CISF',
  description: 'Kumpulan informasi mengenai penelitian yang sedang dilakukan CISF, termasuk research, data, dan diskusi terkait riset'
})

const filters = reactive({
  keyword: '',
  author: '',
  year: '',
  expertise: '',
  topic: '',
  area: '',
  type: '',
})

const buildQuery = () => {
  return Object.values(filters).filter(Boolean).join(' ').trim()
}

const query = ref(buildQuery())

const pageTokens = ref<(string | undefined)[]>([undefined])
const currentPage = ref(0)
const isFiltersEmpty = computed(() => {
  return Object.values(filters).every(value => value === '' || value === null);
})

const { data: researchData, pending, error, refresh } = await useFetch<ResearchData>(() => {
    return !isFiltersEmpty.value ? "/api/research" : "/api/research/posts"
  }
  , {
  query: computed(() => ({
    pageToken: pageTokens.value[currentPage.value] ?? '',
    q: query.value ? { q: query.value } : {},
  })),
  watch: false,
  lazy: true,
  server: false,
})

// Simpan nextPageToken setiap kali data baru datang
watch(researchData, (val: any) => {
  const token = val?.nextPageToken
  if (token && !pageTokens.value.includes(token)) {
    pageTokens.value.push(token)
  }
})

const hasNext = computed(() => !!(researchData.value as any)?.nextPageToken)
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

interface ResearchPost {
  id: any;
  title: string;
  author: { displayName: string };
  content?: string;
  url: string;
  published: string;
  labels?: string[];
}

interface ResearchData {
  items: ResearchPost[];
}

onMounted(() => {
  loadingStore.finish()
})

watch(() => route.query.q, (q) => {
  if (q) {
    filters.keyword = q as string
    applyFilter()
  }
})

const authors = [
  'Tika Widiastuti', 'Imron Mawardi', 'Muhammad Nafik Hadi Ryandono',
  'Sri Herianingrum', 'Irham Zaki', 'Qudsi Fauzi',
  'Imam Wahyudi Indrawan', 'Lina Nugraha Rani',
  'Aam Slamet Rusydiana', 'Eka Puspa Dewi', 'Nikmatul Atiya',
]
const years = ['2025', '2024', '2023', '2022', '2021', '2020']
const expertises = ['Finance', 'Islamic Economics']
const topics = ['Zakat', 'Wakaf', 'Sukuk', 'Islamic Banking']
const areas = ['Indonesia', 'Malaysia', 'Global']
const types = ['Working Paper', 'Research Report']

const applyFilter = () => {
  query.value = buildQuery()
  refresh()
}

const resetFilter = () => {
  Object.keys(filters).forEach(k => (filters[k as keyof typeof filters] = ''))
  query.value = ''
  refresh()
}

const changePage = async (i: number) => {
  currentPage.value = i;
  await refresh();

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

// const { data: researchData, pending, error, refresh } = await useFetch<ResearchData>(() => {
//   return !isFiltersEmpty.value ? "/api/research" : "/api/research/posts"
// }, {
//   query: computed(() => {
//     return query.value ? { q: query.value } : {}
//   }),
//   watch: false
// });

watch(pending, (val) => {
  if (val) loadingStore.start()
  else loadingStore.finish()
})

// function extractAbstract(content: string | undefined): string {
//   if (!content) return ''
//   // Strip HTML tags
//   const stripped = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
//   return stripped.length > 280 ? stripped.slice(0, 280) + '…' : stripped
// }

function extractAbstract(content: string | undefined): string {
  if (!content) return ''
  
  // Cari bagian yang dimulai dengan tag <b>Abstrak</b> atau <b>Abstract</b>
  const abstractMatch = content.match(/<b>\s*Abstrak\s*<\/b>|<b>\s*Abstract\s*<\/b>/i)
  
  if (!abstractMatch) {
    // Fallback ke metode lama jika tidak ditemukan
    const stripped = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    return stripped.length > 300 ? stripped.slice(0, 300) + '…' : stripped
  }
  
  // Ambil konten setelah tag Abstrak
  const startIndex = abstractMatch.index! + abstractMatch[0].length
  const afterAbstract = content.slice(startIndex)
  
  // Cari akhir bagian abstrak (biasanya sebelum tag <hr /> atau section berikutnya)
  const endMatch = afterAbstract.match(/<hr\s*\/>|<h[1-6]|<div class="separator"/)
  const abstractContent = endMatch 
    ? afterAbstract.slice(0, endMatch.index)
    : afterAbstract
  
  // Bersihkan HTML tags dan whitespace berlebih
  const stripped = abstractContent
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  return stripped.length > 300 ? stripped.slice(0, 300) + '…' : stripped
}

const research = computed(() => {
  if (!researchData.value?.items) return []
  return researchData.value.items.map((post) => ({
    title: post.title,
    author: post.author.displayName,
    abstract: extractAbstract(post.content),
    url: `/research${new URL(post.url).pathname}`,
    year: new Date(post.published).getFullYear(),
    date: new Date(post.published).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    }),
    labels: post.labels ?? [],
  }))
})
</script>

<template>
  <main class="min-h-screen bg-[#f5f4f0]">
    <!-- Page Header -->
    <div class="border-b border-gray-200 bg-white">
      <div class="container mx-auto px-6 pt-36 pb-8">
        <p class="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2" v-reveal-right>Research</p>
        <h1 class="text-3xl sm:text-4xl font-normal text-gray-900" v-reveal-left>Riset</h1>
        <div class="w-8 h-0.5 bg-gray-900 dark:bg-white mt-3" v-reveal-right></div>
      </div>
    </div>

    <div class="container mx-auto px-6 py-6">
      <div class="flex flex-col lg:flex-row gap-6 items-stretch lg:items-start">
        <!-- ── SIDEBAR FILTER ── -->
        <aside class="w-full lg:w-64 flex-shrink-0" v-reveal>
          <div class="bg-white border border-gray-200 rounded-lg overflow-hidden sticky top-24">
            <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span class="text-[11px] font-semibold tracking-widest uppercase text-gray-700">Filter</span>
              <button
                @click="resetFilter"
                class="text-[10px] tracking-wider uppercase text-gray-400 hover:text-gray-700 transition-colors"
              >Reset</button>
            </div>

            <div class="p-4 space-y-5">

              <!-- Keyword -->
              <div>
                <label class="block text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Keyword</label>
                <input
                  v-model="filters.keyword"
                  type="text"
                  placeholder="Judul, topik, kata kunci..."
                  class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                  @keyup.enter="applyFilter"
                />
              </div>

              <!-- Author -->
              <div>
                <label class="block text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Author</label>
                <select v-model="filters.author" class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded text-gray-900 focus:outline-none focus:border-gray-400 transition-colors appearance-none cursor-pointer">
                  <option value="">Semua</option>
                  <option v-for="a in authors" :key="a" :value="a">{{ a }}</option>
                </select>
              </div>

              <!-- Year -->
              <div>
                <label class="block text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Year</label>
                <select v-model="filters.year" class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded text-gray-900 focus:outline-none focus:border-gray-400 transition-colors appearance-none cursor-pointer">
                  <option value="">Semua Tahun</option>
                  <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                </select>
              </div>

              <!-- Expertise -->
              <div>
                <label class="block text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Expertise</label>
                <select v-model="filters.expertise" class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded text-gray-900 focus:outline-none focus:border-gray-400 transition-colors appearance-none cursor-pointer">
                  <option value="">Semua</option>
                  <option v-for="e in expertises" :key="e" :value="e">{{ e }}</option>
                </select>
              </div>

              <!-- Topic -->
              <div>
                <label class="block text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Topic</label>
                <select v-model="filters.topic" class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded text-gray-900 focus:outline-none focus:border-gray-400 transition-colors appearance-none cursor-pointer">
                  <option value="">Semua</option>
                  <option v-for="t in topics" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>

              <!-- Research Area -->
              <div>
                <label class="block text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Research Area</label>
                <select v-model="filters.area" class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded text-gray-900 focus:outline-none focus:border-gray-400 transition-colors appearance-none cursor-pointer">
                  <option value="">Semua</option>
                  <option v-for="a in areas" :key="a" :value="a">{{ a }}</option>
                </select>
              </div>

              <!-- Type -->
              <div>
                <label class="block text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">Type</label>
                <select v-model="filters.type" class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded text-gray-900 focus:outline-none focus:border-gray-400 transition-colors appearance-none cursor-pointer">
                  <option value="">Semua</option>
                  <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>

              <!-- Apply -->
              <button
                @click="applyFilter"
                class="w-full py-2.5 text-xs font-semibold tracking-widest uppercase bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </aside>

        <!-- ── MAIN RESULTS ── -->
        <div class="flex-1 w-full lg:w-auto min-w-0">
          <!-- Result count bar -->
          <div v-if="query != ''" class="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <p class="text-sm text-gray-500">
              <span v-if="!pending">
                <strong class="text-gray-900 font-semibold">{{ research.length }}</strong> research ditemukan
              </span>
              <span v-else class="animate-pulse">Mencari…</span>
            </p>
          </div>

          <!-- Skeleton -->
          <div v-if="pending" class="space-y-0">
            <div v-for="i in 6" :key="i" class="bg-white border border-gray-200 rounded-lg p-5 mb-3 animate-pulse">
              <div class="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-full mb-1.5"></div>
              <div class="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="text-center py-20 text-red-400 text-sm">
            Gagal memuat penelitian. Silakan coba lagi.
          </div>

          <!-- Empty -->
          <div v-else-if="!research.length" class="bg-white border border-gray-200 rounded-lg py-20 text-center">
            <p class="text-gray-400 text-sm mb-3">Tidak ada penelitian yang sesuai dengan filter.</p>
            <button @click="resetFilter" class="text-xs underline text-gray-400 hover:text-gray-900 transition-colors">
              Reset filter
            </button>
          </div>

          <!-- List hasil -->
          <div v-else class="space-y-0">
            <NuxtLink
              v-for="(pub, i) in research"
              :key="i"
              :to="pub.url"
              v-reveal
              :style="{ transitionDelay: `${i * 0.04}s` }"
              class="group block bg-white border border-gray-200 border-b-0 last:border-b first:rounded-t-lg last:rounded-b-lg px-6 py-5 hover:bg-gray-50 transition-colors"
            >
              <!-- Meta row -->
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <!-- Type / Labels -->
                <span
                  v-for="label in pub.labels.slice(0, 3)"
                  :key="label"
                  class="inline-block text-[9px] tracking-[0.12em] uppercase font-semibold px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded"
                >
                  {{ label }}
                </span>
                <span class="text-[11px] text-gray-400 ml-auto tabular-nums">{{ pub.year }}</span>
              </div>

              <!-- Title -->
              <h2 class="text-[15px] sm:text-base font-semibold leading-snug text-blue-700 group-hover:text-blue-800 group-hover:underline underline-offset-2 mb-1.5 transition-colors break-words">
                {{ pub.title }}
              </h2>

              <!-- Author & date -->
              <p class="text-[12px] text-gray-500 mb-2 break-words">
                <span class="font-medium text-gray-700">{{ pub.author }}</span>
                <span class="mx-1.5 text-gray-300">·</span>
                <span>{{ pub.date }}</span>
              </p>

              <!-- Abstract snippet -->
              <p v-if="pub.abstract" class="text-[12.5px] text-gray-500 leading-relaxed line-clamp-2 break-words">
                {{ pub.abstract }}
              </p>

              <!-- Read more cue -->
              <div class="mt-2.5 flex items-center gap-1 text-[11px] text-blue-500 group-hover:text-blue-700 transition-colors">
                <span>Lihat penelitian</span>
                <svg class="w-3 h-3 translate-x-0 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </NuxtLink>
          </div>

          <!-- Pagination -->
          <div
            v-if="!pending && research.length && (hasNext || hasPrev)"
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
        </div>
      </div>
    </div>

  </main>
</template>