<script setup lang="ts">
const loadingStore = useLoadingStore()
const { t, locale } = useI18n()

useSeoMeta({
  title: () => `${t('research.label')} — CISF`,
  description: () => t('research.titleMain')
})

interface ResearchPost {
  id: any
  title: string
  author: { displayName: string }
  content?: string
  url: string
  published: string
}

interface ResearchData {
  items: ResearchPost[]
  nextPageToken?: string
}

const pageTokens = ref<(string | undefined)[]>([undefined])
const currentPage = ref(0)

const { data: researchData, pending, error, refresh } = await useFetch<ResearchData>(
  '/api/research/posts',
  {
    query: computed(() => ({
      pageToken: pageTokens.value[currentPage.value] ?? ''
    })),
    watch: false,
    lazy: true,
    server: false
  }
)

watch(researchData, (val: any) => {
  const token = val?.nextPageToken
  if (token && !pageTokens.value.includes(token)) {
    pageTokens.value.push(token)
  }
})

const hasNext = computed(() => !!researchData.value?.nextPageToken)
const hasPrev = computed(() => currentPage.value > 0)

const goNext = async () => {
  currentPage.value++
  await refresh()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goPrev = async () => {
  currentPage.value--
  await refresh()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const changePage = async (i: number) => {
  currentPage.value = i
  await refresh()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function extractAbstract(content: string | undefined): string {
  if (!content) return ''

  const abstractMatch = content.match(/<b>\s*Abstrak\s*<\/b>|<b>\s*Abstract\s*<\/b>/i)

  if (!abstractMatch) {
    const stripped = content
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    return stripped.length > 300 ? stripped.slice(0, 300) + '…' : stripped
  }

  const startIndex = abstractMatch.index! + abstractMatch[0].length
  const afterAbstract = content.slice(startIndex)

  const endMatch = afterAbstract.match(/<hr\s*\/>|<h[1-6]|<div class="separator"/)
  const abstractContent = endMatch
    ? afterAbstract.slice(0, endMatch.index)
    : afterAbstract

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
    title: parseLocaleText(post.title, locale.value),
    author: post.author.displayName,
    abstract: parseLocaleText(extractAbstract(post.content), locale.value),
    url: `/research${new URL(post.url).pathname}`,
    year: new Date(post.published).getFullYear(),
    date: new Date(post.published).toLocaleDateString(
      locale.value === 'en' ? 'en-US' : 'id-ID',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    )
  }))
})

onMounted(() => {
  loadingStore.finish()
})

watch(pending, (val) => {
  if (val) loadingStore.start()
  else loadingStore.finish()
})
</script>

<template>
  <main class="min-h-screen bg-[#f7f3eb] dark:bg-gray-950">
    <!-- Page Header -->
    <section class="relative overflow-hidden border-b border-black/5 bg-[#f7f3eb] dark:border-white/10 dark:bg-gray-950">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-white/70 blur-3xl"></div>
        <div class="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-black/[0.04] dark:bg-white/[0.05] blur-3xl"></div>
      </div>

      <div class="container relative mx-auto px-6 pt-36 pb-14 sm:pb-16">
        <div class="mb-5 flex items-center gap-3" v-reveal-right>
          <span class="h-px w-10 bg-gray-900 dark:bg-white"></span>
          <p class="text-[11px] uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">
            {{ $t('research.label') }}
          </p>
        </div>

        <h1
          class="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-gray-950 dark:text-white sm:text-5xl lg:text-6xl"
          v-reveal-left
        >
          {{ $t('research.titleMain') }}
        </h1>
      </div>
    </section>

    <!-- Content -->
    <section class="container mx-auto px-6 py-10 sm:py-14 lg:py-16">
      <!-- Skeleton -->
      <div v-if="pending" class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="i in 6"
          :key="i"
          class="min-h-[380px] animate-pulse rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-7"
        >
          <div class="mb-6 flex items-center justify-between">
            <div class="h-3 w-20 rounded bg-gray-200 dark:bg-white/10"></div>
            <div class="h-4 w-10 rounded bg-gray-200 dark:bg-white/10"></div>
          </div>

          <div class="mb-3 h-7 w-5/6 rounded bg-gray-200 dark:bg-white/10"></div>
          <div class="mb-5 h-7 w-3/4 rounded bg-gray-200 dark:bg-white/10"></div>
          <div class="mb-8 h-4 w-2/3 rounded bg-gray-200 dark:bg-white/10"></div>

          <div class="space-y-3">
            <div class="h-4 w-full rounded bg-gray-200 dark:bg-white/10"></div>
            <div class="h-4 w-full rounded bg-gray-200 dark:bg-white/10"></div>
            <div class="h-4 w-4/5 rounded bg-gray-200 dark:bg-white/10"></div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="rounded-2xl border border-red-100 bg-white px-6 py-16 text-center text-sm text-red-500 shadow-sm dark:border-red-500/20 dark:bg-white/[0.04]"
      >
        {{ $t('status.errorLoading') }}
      </div>

      <!-- Empty -->
      <div
        v-else-if="!research.length"
        class="rounded-2xl border border-black/5 bg-white px-6 py-16 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ $t('research.notFound') }}
        </p>
      </div>

      <!-- Research Cards -->
      <div v-else class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="(pub, i) in research"
          :key="i"
          :to="pub.url"
          v-reveal
          :style="{ transitionDelay: `${i * 0.04}s` }"
          class="group flex min-h-[390px] flex-col rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-7"
        >
          <!-- Category and Year -->
          <div class="mb-7 flex items-center justify-between">
            <span class="text-[11px] uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
              Research
            </span>

            <span class="text-sm font-semibold tabular-nums text-gray-950 dark:text-white">
              {{ pub.year }}
            </span>
          </div>

          <!-- Title -->
          <h2 class="text-xl font-semibold leading-tight tracking-tight text-gray-950 transition-colors group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300 sm:text-2xl">
            {{ pub.title }}
          </h2>

          <!-- Author and Date -->
          <p class="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {{ pub.author }}
            <span class="mx-1.5 text-gray-300 dark:text-white/20">·</span>
            {{ pub.date }}
          </p>

          <!-- Abstract -->
          <p
            v-if="pub.abstract"
            class="mt-6 line-clamp-5 text-sm leading-7 text-gray-600 dark:text-gray-400"
          >
            {{ pub.abstract }}
          </p>

          <!-- View Research -->
          <div class="mt-auto pt-8">
            <span class="group/link inline-flex items-center gap-2 text-sm font-medium text-gray-950 dark:text-white">
              <span class="border-b border-gray-900 pb-0.5 transition-colors group-hover/link:border-gray-500 dark:border-white dark:group-hover/link:border-gray-300">
                {{ $t('research.viewRes') }}
              </span>

              <svg
                class="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                viewBox="0 0 16 16"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
          </div>
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div
        v-if="!pending && research.length && (hasNext || hasPrev)"
        class="mt-14 flex flex-wrap items-center justify-center gap-3"
      >
        <button
          @click="goPrev"
          :disabled="!hasPrev"
          class="flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/20 dark:bg-white/[0.04] dark:text-gray-400 dark:hover:bg-white/10"
        >
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 16 16">
            <path d="M10 4l-4 4 4 4" />
          </svg>
          {{ $t('pagination.prev') }}
        </button>

        <div class="flex items-center gap-1">
          <button
            v-for="(_, i) in pageTokens"
            :key="i"
            @click="changePage(i)"
            :class="[
              'h-9 w-9 rounded-full text-xs transition-colors',
              currentPage === i
                ? 'bg-gray-900 font-medium text-white dark:bg-white dark:text-gray-900'
                : 'border border-black/10 bg-white text-gray-400 hover:bg-gray-100 dark:border-white/20 dark:bg-white/[0.04] dark:hover:bg-white/10'
            ]"
          >
            {{ i + 1 }}
          </button>

          <span
            v-if="hasNext && !pending"
            class="flex h-9 w-9 items-center justify-center text-xs text-gray-300"
          >
            ...
          </span>
        </div>

        <button
          @click="goNext"
          :disabled="!hasNext"
          class="flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/20 dark:bg-white/[0.04] dark:text-gray-400 dark:hover:bg-white/10"
        >
          {{ $t('pagination.next') }}
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 16 16">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </button>
      </div>
    </section>
  </main>
</template>