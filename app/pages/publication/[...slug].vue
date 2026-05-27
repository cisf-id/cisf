<script setup lang="ts">
const route = useRoute()
const slugParam = route.params.slug as string | string[]
const slugPath = Array.isArray(slugParam)
  ? slugParam.join('/')
  : slugParam

interface Post {
  title: string
  author: { displayName: string }
  published: string
  content: string
}

const { locale } = useI18n()

function normalizeImageUrl(url: string): string {
  return url
    .replace(/\/(s\d+|w\d+|h\d+|w\d+-h\d+)(-[a-zA-Z0-9-]+)*\//g, '/s0/')
    .replace(/=(s\d+|w\d+|h\d+|w\d+)(-[a-zA-Z0-9-]+)*(?=[&"]|$)/g, '=s0')
}

function extractImage(content: string | undefined): string | null {
  if (!content) return null

  const match = content.match(/<img[^>]+src="([^">]+)"/)
  const url = match?.[1]

  return url ? normalizeImageUrl(url) : null
}

function removeFirstImage(content: string | undefined): string {
  if (!content) return ''
  return content.replace(/<img[^>]*>/i, '')
}

const { data: postData, pending, error } = await useFetch<Post>(
  `/api/post/${slugPath}`,
  { key: `publication-${slugPath}` }
)

const post = computed(() => {
  if (!postData.value) return null

  return {
    title: postData.value.title,
    author: postData.value.author,
    published: new Date(postData.value.published).toLocaleDateString(
      locale.value === 'en' ? 'en-US' : 'id-ID',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    ),
    year: new Date(postData.value.published).getFullYear(),
    image: extractImage(postData.value.content),
    content: removeFirstImage(postData.value.content)
  }
})

const cleanContent = (html: string) => {
  if (!html) return ''

  let cleaned = html
    .replace(/\s*background-color:\s*[^;'"]+;?/gi, '')
    .replace(/\s*font-family:\s*[^;'"]+;?/gi, '')
    .replace(/\s*style=["']\s*["']/gi, '')
    .replace(/<span[^>]*>\s*<\/span>/gi, '')
    .replace(/&nbsp;/g, ' ')

  cleaned = cleaned.replace(/src="([^"]+)"/g, (match, url) => {
    return `src="${normalizeImageUrl(url)}"`
  })

  return cleaned
}
</script>

<template>
  <Watermark />

  <main class="min-h-screen bg-[#f4f1e8] dark:bg-[#090909]">
    <!-- Hero -->
    <section class="relative overflow-hidden pt-32 pb-12 sm:pt-36 lg:pt-40 lg:pb-16">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-white/70 blur-3xl dark:bg-white/[0.03]"></div>
        <div class="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-[#c49a3b]/10 blur-3xl"></div>
      </div>

      <div class="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <!-- Back link -->
        <NuxtLink
          to="/publication"
          class="group mb-10 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-gray-500 transition-colors hover:text-[#b88a2e] dark:text-gray-400 dark:hover:text-[#eeba4b]"
        >
          <svg
            class="h-4 w-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {{ locale === 'en' ? 'Back to Publication' : 'Kembali ke Publikasi' }}
        </NuxtLink>

        <!-- Loading -->
        <div v-if="pending" class="py-24 text-center text-sm text-gray-400">
          <div class="flex animate-pulse flex-col items-center gap-4">
            <div class="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-[#c49a3b]"></div>
            <span>{{ locale === 'en' ? 'Loading publication...' : 'Memuat publikasi...' }}</span>
          </div>
        </div>

        <!-- Error -->
        <div
          v-else-if="error"
          class="rounded-3xl border border-gray-100 bg-white px-6 py-20 text-center text-sm text-red-500 shadow-sm dark:border-white/10 dark:bg-[#151515]"
        >
          {{ locale === 'en' ? 'Publication not found.' : 'Publikasi tidak ditemukan.' }}
        </div>

        <!-- Post -->
        <article v-else-if="post" v-reveal>
          <div class="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <!-- Title Area -->
            <div>
              <span class="mb-6 inline-flex rounded-full bg-[#c49a3b]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#b88a2e]">
                {{ locale === 'en' ? 'Publication' : 'Publikasi' }}
              </span>

              <h1 class="max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-gray-950 dark:text-white sm:text-4xl lg:text-5xl">
                {{ post.title }}
              </h1>

              <p class="mt-7 max-w-2xl text-base leading-8 text-gray-600 dark:text-gray-400">
                {{ locale === 'en'
                  ? 'A curated academic publication from the Center of Islamic Social Finance, presented with a clean and reader-focused layout.'
                  : 'Publikasi akademik Center of Islamic Social Finance yang disajikan dalam tampilan bersih, elegan, dan nyaman dibaca.'
                }}
              </p>
            </div>

            <!-- Cover Image -->
            <div
              v-if="post.image"
              class="overflow-hidden rounded-[2rem] border border-white/70 bg-white p-3 shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none"
            >
              <img
                :src="post.image"
                :alt="post.title"
                class="h-auto w-full rounded-[1.4rem] object-cover"
              />
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- Body -->
    <section v-if="post" class="pb-16 sm:pb-20 lg:pb-24">
      <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div class="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <!-- Meta Sidebar -->
          <aside class="lg:sticky lg:top-28">
            <div class="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-[#151515] dark:shadow-none">
              <p class="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
                Publication Detail
              </p>

              <div class="space-y-5">
                <div>
                  <p class="mb-1 text-[10px] uppercase tracking-[0.18em] text-gray-400">
                    Author
                  </p>
                  <p class="text-sm font-medium leading-relaxed text-gray-900 dark:text-white">
                    {{ post.author.displayName }}
                  </p>
                </div>

                <div class="h-px bg-gray-100 dark:bg-white/10"></div>

                <div>
                  <p class="mb-1 text-[10px] uppercase tracking-[0.18em] text-gray-400">
                    Published
                  </p>
                  <p class="text-sm font-medium leading-relaxed text-gray-900 dark:text-white">
                    {{ post.published }}
                  </p>
                </div>

                <div class="h-px bg-gray-100 dark:bg-white/10"></div>

                <div>
                  <p class="mb-1 text-[10px] uppercase tracking-[0.18em] text-gray-400">
                    Year
                  </p>
                  <p class="text-sm font-medium leading-relaxed text-gray-900 dark:text-white">
                    {{ post.year }}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <!-- Content -->
          <div class="rounded-[2rem] border border-black/5 bg-white px-5 py-8 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-[#151515] dark:shadow-none sm:px-8 sm:py-10 lg:px-16 lg:py-16">
            <div
              class="publication-content prose max-w-none text-gray-800 dark:prose-invert dark:text-gray-200"
              v-html="cleanContent(post.content)"
            />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
:deep(.publication-content) {
  max-width: 820px;
  margin-left: auto;
  margin-right: auto;
  font-size: 16px;
  line-height: 1.95;
  color: #1f2937;
}

:deep(.publication-content p) {
  margin-bottom: 1.55rem;
  text-align: justify;
}

:deep(.publication-content img) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 2.75rem auto;
  border-radius: 1.1rem;
  border: 1px solid rgba(229, 231, 235, 0.85);
  box-shadow: 0 18px 40px -24px rgba(0, 0, 0, 0.35);
}

.dark :deep(.publication-content img) {
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: none;
}

:deep(.publication-content h2) {
  margin-top: 2.8rem;
  margin-bottom: 1rem;
  font-size: 1.45rem;
  font-weight: 700;
  line-height: 1.35;
  color: #111827;
}

:deep(.publication-content h3) {
  margin-top: 2.3rem;
  margin-bottom: 0.8rem;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.4;
  color: #1f2937;
}

.dark :deep(.publication-content h2),
.dark :deep(.publication-content h3) {
  color: #ffffff;
}

:deep(.publication-content a) {
  color: #b88a2e;
  text-decoration: underline;
  text-underline-offset: 3px;
}

:deep(.publication-content ul),
:deep(.publication-content ol) {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

:deep(.publication-content li) {
  margin-bottom: 0.65rem;
}

:deep(.publication-content blockquote) {
  margin: 2rem 0;
  border-left: 4px solid #c49a3b;
  padding-left: 1.25rem;
  color: #4b5563;
  font-style: italic;
}

:deep(.publication-content table) {
  width: 100%;
  margin: 2rem 0;
  border-collapse: collapse;
  font-size: 14px;
}

:deep(.publication-content th),
:deep(.publication-content td) {
  border: 1px solid rgba(229, 231, 235, 1);
  padding: 0.85rem 1rem;
  vertical-align: top;
}

:deep(.publication-content th) {
  background: #f9fafb;
  font-weight: 700;
}

.dark :deep(.publication-content th),
.dark :deep(.publication-content td) {
  border-color: rgba(255, 255, 255, 0.1);
}

.dark :deep(.publication-content th) {
  background: rgba(255, 255, 255, 0.04);
}

@media (max-width: 1024px) {
  :deep(.publication-content) {
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  :deep(.publication-content) {
    font-size: 14.8px;
    line-height: 1.85;
  }

  :deep(.publication-content p) {
    text-align: left;
  }
}
</style>