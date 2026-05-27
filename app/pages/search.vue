<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()

const keyword = computed(() => {
  const q = route.query.q
  return typeof q === 'string' ? q.trim() : ''
})

const { data, pending, error } = await useFetch('/api/search', {
  query: computed(() => ({
    q: keyword.value
  })),
  watch: [keyword],
  server: false
})

function extractAbstract(content: string | undefined): string {
  if (!content) return ''

  const stripped = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return stripped.length > 260 ? stripped.slice(0, 260) + '…' : stripped
}

function toLocalUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname
    return pathname
  } catch {
    return url
  }
}

function detectType(url: string): string {
  if (url.includes('/article/')) return 'Article'
  if (url.includes('/webinar-series/')) return 'Webinar Series'
  if (url.includes('/research/')) return 'Research'
  if (url.includes('/publication/')) return 'Publication'
  return 'Post'
}

const results = computed(() => {
  const items = (data.value as any)?.items || []

  return items.map((post: any) => ({
    id: post.id,
    title: parseLocaleText(post.title, locale.value),
    author: post.author?.displayName || 'Center of Islamic Social Finance',
    date: new Date(post.published).toLocaleDateString(
      locale.value === 'en' ? 'en-US' : 'id-ID',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    ),
    abstract: parseLocaleText(extractAbstract(post.content), locale.value),
    url: toLocalUrl(post.url),
    type: detectType(post.url)
  }))
})
</script>

<template>
  <main class="min-h-screen bg-[#f5f1e8] dark:bg-[#090909]">
    <!-- Header -->
    <section class="border-b border-black/5 pt-36 pb-14 dark:border-white/10">
      <div class="container mx-auto px-6">
        <NuxtLink
          to="/"
          class="mb-8 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-gray-500 transition-colors hover:text-[#b88a2e] dark:text-gray-400"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Beranda
        </NuxtLink>

        <p class="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#b88a2e]">
          Search
        </p>

        <h1 class="text-4xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          Hasil Pencarian
        </h1>

        <p class="mt-5 text-base text-gray-600 dark:text-gray-400">
          Menampilkan hasil untuk:
          <span class="font-semibold text-gray-950 dark:text-white">
            “{{ keyword }}”
          </span>
        </p>
      </div>
    </section>

    <!-- Results -->
    <section class="container mx-auto px-6 py-12 sm:py-16">
      <div v-if="!keyword" class="mx-auto max-w-3xl rounded-3xl border border-black/5 bg-white px-6 py-16 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <p class="text-gray-500 dark:text-gray-400">
          Silakan masukkan kata kunci pencarian.
        </p>
      </div>

      <div v-else-if="pending" class="mx-auto max-w-4xl space-y-4">
        <div
          v-for="i in 5"
          :key="i"
          class="animate-pulse rounded-2xl border border-black/5 bg-white p-6 dark:border-white/10 dark:bg-white/[0.04]"
        >
          <div class="mb-4 h-3 w-24 rounded bg-gray-200 dark:bg-white/10"></div>
          <div class="mb-3 h-6 w-3/4 rounded bg-gray-200 dark:bg-white/10"></div>
          <div class="h-4 w-full rounded bg-gray-200 dark:bg-white/10"></div>
        </div>
      </div>

      <div
        v-else-if="error"
        class="mx-auto max-w-3xl rounded-3xl border border-red-100 bg-white px-6 py-16 text-center text-sm text-red-500 shadow-sm dark:border-red-500/20 dark:bg-white/[0.04]"
      >
        Terjadi kesalahan saat memuat hasil pencarian.
      </div>

      <div
        v-else-if="!results.length"
        class="mx-auto max-w-3xl rounded-3xl border border-black/5 bg-white px-6 py-16 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
      >
        <p class="text-gray-500 dark:text-gray-400">
          Tidak ada hasil untuk pencarian “{{ keyword }}”.
        </p>
      </div>

      <div v-else class="mx-auto max-w-4xl space-y-5">
        <NuxtLink
          v-for="item in results"
          :key="item.id"
          :to="item.url"
          class="group block rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.04]"
        >
          <div class="mb-4 flex flex-wrap items-center gap-3">
            <span class="rounded-full bg-[#c49a3b]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b88a2e]">
              {{ item.type }}
            </span>

            <span class="text-sm text-gray-400">
              {{ item.date }}
            </span>
          </div>

          <h2 class="text-xl font-semibold leading-tight text-gray-950 transition group-hover:text-[#b88a2e] dark:text-white sm:text-2xl">
            {{ item.title }}
          </h2>

          <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {{ item.author }}
          </p>

          <p
            v-if="item.abstract"
            class="mt-5 text-sm leading-7 text-gray-600 dark:text-gray-400"
          >
            {{ item.abstract }}
          </p>

          <div class="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gray-950 dark:text-white">
            <span class="border-b border-gray-900 pb-0.5 dark:border-white">
              Buka hasil
            </span>

            <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 16 16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </div>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>