Siap. Ini versi **terima jadi**. Langsung **replace seluruh file komponen research** kamu dengan kode ini. Versi ini sudah:

* tampilan lebih elegan seperti card editorial CELIOS
* tanpa filter/label research
* tanpa accordion
* langsung menampilkan Research, tahun, judul, author, tanggal, ringkasan, dan View research
* responsive untuk mobile dan desktop

```vue
<script setup lang="ts">
const { data: researchData, pending } = useFetch("/api/research/top5Research")
const { locale } = useI18n()

function extractAbstract(content: string | undefined): string {
  if (!content) return ''

  const stripped = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return stripped.length > 260 ? stripped.slice(0, 260) + '…' : stripped
}

const researchs = computed(() => {
  if (
    !researchData.value ||
    typeof researchData.value !== 'object' ||
    !('items' in researchData.value) ||
    !Array.isArray((researchData.value as any).items)
  ) return []

  return (researchData.value as any).items.map((post: any) => ({
    id: post.id,
    title: parseLocaleText(post.title, locale.value),
    author: post.author.displayName,
    date: new Date(post.published).toLocaleDateString(
      locale.value === 'en' ? 'en-US' : 'id-ID',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }
    ),
    year: new Date(post.published).getFullYear().toString(),
    abstract: parseLocaleText(extractAbstract(post.content), locale.value),
    url: `/research${new URL(post.url).pathname}`
  }))
})
</script>

<template>
  <section class="relative overflow-hidden bg-[#f7f3eb] dark:bg-gray-950 py-16 sm:py-20 lg:py-24">
    <!-- Soft background accent -->
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-white/70 blur-3xl"></div>
      <div class="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-black/[0.04] dark:bg-white/[0.05] blur-3xl"></div>
    </div>

    <div class="container relative mx-auto px-4 sm:px-6">
      <!-- Section Header -->
      <div class="mb-10 sm:mb-14" v-reveal>
        <div class="mb-4 flex items-center gap-3">
          <span class="h-px w-10 bg-gray-900 dark:bg-white"></span>
          <p class="text-[11px] uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">
            {{ $t('research.label') }}
          </p>
        </div>

        <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 class="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-gray-950 dark:text-white sm:text-4xl lg:text-5xl">
            {{ $t('research.title') }}
          </h2>

          <NuxtLink
            to="/research"
            class="group inline-flex w-fit items-center gap-2 border-b border-gray-900 pb-1 text-sm font-medium text-gray-900 transition-colors hover:text-gray-600 dark:border-white dark:text-white dark:hover:text-gray-300"
          >
            <span>{{ $t('research.all') }}</span>
            <svg
              class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              viewBox="0 0 16 16"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </NuxtLink>
        </div>
      </div>

      <!-- Skeleton Loading -->
      <div
        v-if="pending"
        class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="i in 5"
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

      <!-- Research Cards -->
      <div
        v-else
        class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="(research, i) in researchs"
          :key="research.id"
          v-reveal
          :style="{ transitionDelay: `${i as number * 0.06}s` }"
          class="group flex min-h-[390px] flex-col rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-7"
        >
          <!-- Category and Year -->
          <div class="mb-7 flex items-center justify-between">
            <span class="text-[11px] uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
              Research
            </span>

            <span class="text-sm font-semibold tabular-nums text-gray-950 dark:text-white">
              {{ research.year }}
            </span>
          </div>

          <!-- Title -->
          <NuxtLink :to="research.url" class="block">
            <h3 class="text-xl font-semibold leading-tight tracking-tight text-gray-950 transition-colors group-hover:text-gray-600 dark:text-white dark:group-hover:text-gray-300 sm:text-2xl">
              {{ research.title }}
            </h3>
          </NuxtLink>

          <!-- Author and Date -->
          <p class="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {{ research.author }}
            <span class="mx-1.5 text-gray-300 dark:text-white/20">·</span>
            {{ research.date }}
          </p>

          <!-- Abstract -->
          <p class="mt-6 line-clamp-5 text-sm leading-7 text-gray-600 dark:text-gray-400">
            {{ research.abstract || $t('research.abstractNotAvailable') }}
          </p>

          <!-- View Research -->
          <div class="mt-auto pt-8">
            <NuxtLink
              :to="research.url"
              class="group/link inline-flex items-center gap-2 text-sm font-medium text-gray-950 dark:text-white"
            >
              <span class="border-b border-gray-900 pb-0.5 transition-colors group-hover/link:border-gray-500 dark:border-white dark:group-hover/link:border-gray-300">
                {{ $t('research.readMore') }}
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
            </NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
```

Kode ini menggantikan versi sebelumnya yang masih memakai label/filter dan accordion pada bagian research. 
