<script setup lang="ts">

const { data: researchData, pending } = useFetch("/api/research/top5Research")

function extractAbstract(content: string | undefined): string {
  if (!content) return ''
  const stripped = content.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
  return stripped.length > 300 ? stripped.slice(0, 300) + '…' : stripped
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
    title: post.title,
    author: post.author.displayName,
    date: new Date(post.published).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    year: new Date(post.published).getFullYear().toString(),
    abstract: extractAbstract(post.content),
    labels: post.labels ?? [],
    url: `/research${new URL(post.url).pathname}`
  }))
})

// Hanya satu item yang terbuka dalam satu waktu
const openIndex = ref<number | null>(null)
const toggle = (i: number) => {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<template>
  <section class="py-10 sm:py-14 lg:py-16 border-b border-gray-100 dark:border-white/10 bg-[#ffffff] dark:bg-transparent">
    <div class="container mx-auto px-4 sm:px-6">
      <!-- Section header -->
      <div class="flex justify-between items-end" v-reveal>
        <div>
          <p class="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Research</p>
          <h2 class="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white">Penelitian terbaru</h2>
          <div class="w-8 h-0.5 bg-gray-900 dark:bg-white mt-3 mb-6 sm:mb-7"></div>
        </div>
        <NuxtLink
          to="/research"
          class="text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 sm:mb-7 flex items-center gap-1.5 group shrink-0 ml-4"
        >
          <span class="hidden sm:inline">Semua penelitian</span>
          <span class="sm:hidden text-[10px]">Semua</span>
          <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 16 16">
            <path d="M3 8h10M9 4l4 4-4 4"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- Skeleton -->
      <div v-if="pending" class="divide-y divide-gray-100 dark:divide-white/10">
        <div v-for="i in 5" :key="i" class="py-4 animate-pulse">
          <div class="flex gap-3">
            <div class="h-3 w-5 bg-gray-200 dark:bg-white/10 rounded mt-1 shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="flex gap-2">
                <div class="h-4 w-12 bg-gray-200 dark:bg-white/10 rounded"></div>
                <div class="h-4 w-10 bg-gray-200 dark:bg-white/10 rounded"></div>
              </div>
              <div class="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- List -->
      <div v-else class="divide-y divide-gray-100 dark:divide-white/10">
        <div
          v-for="(research, i) in researchs"
          :key="research.id"
          v-reveal
          :style="{ transitionDelay: `${i as number * 0.06}s` }"
        >
          <!-- Header row — klik untuk expand -->
          <button
            type="button"
            class="w-full text-left flex items-start gap-3 py-4 group focus:outline-none"
            @click="toggle(i as number)"
            :aria-expanded="openIndex === i"
          >
            <!-- Nomor urut -->
            <span class="text-[11px] text-gray-300 dark:text-white/30 tabular-nums pt-0.5 min-w-[20px]">
              {{ String(i as number + 1).padStart(2, '0') }}
            </span>

            <div class="flex-1 min-w-0">
              <!-- Labels + tahun -->
              <div class="flex flex-wrap items-center gap-1.5 mb-1.5">
                <span
                  v-for="label in research.labels.slice(0, 2)"
                  :key="label"
                  class="text-[9px] tracking-wider uppercase px-1.5 py-0.5 bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded"
                >
                  {{ label }}
                </span>
                <span class="text-[10px] text-gray-400 dark:text-white/30 ml-auto tabular-nums">{{ research.year }}</span>
              </div>

              <!-- Judul -->
              <p class="text-[14px] sm:text-[15px] font-medium leading-snug text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors pr-4 break-words">
                {{ research.title }}
              </p>

              <!-- Author & date -->
              <p class="text-[11px] text-gray-400 mt-1 break-words">
                {{ research.author }}
                <span class="mx-1 text-gray-200 dark:text-white/20">·</span>
                {{ research.date }}
              </p>
            </div>

            <!-- Chevron -->
            <svg
              class="w-4 h-4 shrink-0 mt-1 text-gray-300 dark:text-white/30 group-hover:text-gray-500 dark:group-hover:text-white/60 transition-all duration-200"
              :class="{ 'rotate-90': openIndex === i }"
              fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 16 16"
            >
              <path d="M6 4l4 4-4 4"/>
            </svg>
          </button>

          <!-- Abstract accordion -->
          <Transition
            @enter="(el) => { (el as HTMLElement).style.maxHeight = (el as HTMLElement).scrollHeight + 'px' }"
            @leave="(el) => { (el as HTMLElement).style.maxHeight = '0' }"
          >
            <div
              v-if="openIndex === i"
              class="overflow-hidden transition-[max-height] duration-300 ease-in-out"
              style="max-height: 0;"
            >
              <div class="pb-4 pl-8">
                <p class="text-[12.5px] text-gray-500 dark:text-gray-400 leading-relaxed break-words">
                  {{ research.abstract || 'Abstrak tidak tersedia.' }}
                </p>
                <NuxtLink
                  :to="research.url"
                  class="inline-flex items-center gap-1 mt-3 text-[12px] text-blue-600 dark:text-blue-400 hover:underline underline-offset-2 transition-colors"
                  @click.stop
                >
                  Baca selengkapnya
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 16 16">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8h10M9 4l4 4-4 4"/>
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </Transition>
        </div>
      </div>

    </div>
  </section>
</template>