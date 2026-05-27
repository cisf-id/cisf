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

function extractImage(content: string | undefined): string | null {
  if (!content) return null

  const match = content.match(/<img[^>]+src="([^">]+)"/)
  const url = match?.[1]
  if (!url) return null

  return url
    .replace(/\/(s\d+|w\d+|h\d+|w\d+-h\d+)(-[a-zA-Z0-9-]+)*\//g, '/s0/')
    .replace(/=(s\d+|w\d+|h\d+|w\d+)(-[a-zA-Z0-9-]+)*(?=[&"]|$)/g, '=s0')
}

function removeFirstImage(content: string | undefined): string {
  if (!content) return ''
  return content.replace(/<img[^>]*>/i, '')
}

const { data: postData, pending, error } = await useFetch<Post>(
  `/api/post/${slugPath}`,
  { key: `post-${slugPath}` }
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

  cleaned = cleaned.replace(/src="([^"]+)"/g, (match, url) => {
    const newUrl = url
      .replace(/\/(s\d+|w\d+|h\d+|w\d+-h\d+)(-[a-zA-Z0-9-]+)*\//g, '/s0/')
      .replace(/=(s\d+|w\d+|h\d+|w\d+)(-[a-zA-Z0-9-]+)*(?=[&"]|$)/g, '=s0')

    return `src="${newUrl}"`
  })

  return cleaned
}
</script>

<template>
  <Watermark />

  <main class="min-h-screen bg-[#f4f1e8] dark:bg-[#0a0a0a]">
    <!-- Top spacing because navbar is fixed -->
    <section class="pt-32 sm:pt-36 lg:pt-40 pb-10">
      <div class="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <!-- Back link -->
        <NuxtLink
          to="/webinar-series"
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
          {{ locale === 'en' ? 'Back to Webinar Series' : 'Kembali ke Webinar Series' }}
        </NuxtLink>

        <!-- Loading -->
        <div v-if="pending" class="py-24 text-center text-sm text-gray-400">
          <div class="flex animate-pulse flex-col items-center gap-4">
            <div class="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-[#c49a3b]"></div>
            <span>{{ locale === 'en' ? 'Loading webinar...' : 'Memuat webinar...' }}</span>
          </div>
        </div>

        <!-- Error -->
        <div
          v-else-if="error"
          class="rounded-3xl border border-gray-100 bg-white px-6 py-20 text-center text-sm text-red-500 shadow-sm dark:border-white/10 dark:bg-[#151515]"
        >
          {{ locale === 'en' ? 'Webinar not found.' : 'Webinar tidak ditemukan.' }}
        </div>

        <!-- Detail Post -->
        <article v-else-if="post" v-reveal>
          <!-- Header -->
          <header class="mx-auto max-w-4xl text-center">
            <span class="mb-6 inline-flex rounded-full bg-[#c49a3b]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#b88a2e]">
              Webinar Series
            </span>

            <h1 class="text-3xl font-semibold leading-tight tracking-tight text-gray-950 dark:text-white sm:text-4xl lg:text-5xl">
              {{ post.title }}
            </h1>

            <div class="mt-7 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span>{{ post.author.displayName }}</span>
              <span class="text-gray-300 dark:text-white/20">•</span>
              <span>{{ post.published }}</span>
            </div>
          </header>

          <!-- Featured Image -->
          <div
            v-if="post.image"
            class="mx-auto mt-12 max-w-4xl overflow-hidden rounded-[1.75rem] bg-white shadow-xl shadow-black/5 dark:bg-white/[0.04] dark:shadow-none"
          >
            <img
              :src="post.image"
              :alt="post.title"
              class="h-auto w-full object-cover"
            />
          </div>

          <!-- Content Card -->
          <div class="mx-auto mt-12 max-w-4xl rounded-[1.75rem] border border-black/5 bg-white px-5 py-8 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-[#151515] dark:shadow-none sm:px-8 sm:py-10 lg:px-14 lg:py-14">
            <div
              class="article-content prose max-w-none text-gray-800 dark:prose-invert dark:text-gray-200"
              v-html="cleanContent(post.content)"
            />
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
:deep(.article-content) {
  max-width: 760px;
  margin-left: auto;
  margin-right: auto;
  font-size: 16px;
  line-height: 1.95;
  color: #1f2937;
}

:deep(.article-content p) {
  margin-bottom: 1.55rem;
  text-align: justify;
}

:deep(.article-content img) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 2.75rem auto;
  border-radius: 1.1rem;
  border: 1px solid rgba(229, 231, 235, 0.85);
  box-shadow: 0 18px 40px -24px rgba(0, 0, 0, 0.35);
}

.dark :deep(.article-content img) {
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: none;
}

:deep(.article-content h2) {
  margin-top: 2.8rem;
  margin-bottom: 1rem;
  font-size: 1.45rem;
  font-weight: 700;
  line-height: 1.35;
  color: #111827;
}

:deep(.article-content h3) {
  margin-top: 2.3rem;
  margin-bottom: 0.8rem;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.4;
  color: #1f2937;
}

.dark :deep(.article-content h2),
.dark :deep(.article-content h3) {
  color: #ffffff;
}

:deep(.article-content a) {
  color: #b88a2e;
  text-decoration: underline;
  text-underline-offset: 3px;
}

:deep(.article-content ul),
:deep(.article-content ol) {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

:deep(.article-content li) {
  margin-bottom: 0.6rem;
}

:deep(.article-content blockquote) {
  margin: 2rem 0;
  border-left: 4px solid #c49a3b;
  padding-left: 1.25rem;
  color: #4b5563;
  font-style: italic;
}

:deep(.article-content table) {
  width: 100%;
  margin: 2rem 0;
  border-collapse: collapse;
  font-size: 14px;
}

:deep(.article-content th),
:deep(.article-content td) {
  border: 1px solid rgba(229, 231, 235, 1);
  padding: 0.85rem 1rem;
  vertical-align: top;
}

:deep(.article-content th) {
  background: #f9fafb;
  font-weight: 700;
}

.dark :deep(.article-content th),
.dark :deep(.article-content td) {
  border-color: rgba(255, 255, 255, 0.1);
}

.dark :deep(.article-content th) {
  background: rgba(255, 255, 255, 0.04);
}

@media (max-width: 640px) {
  :deep(.article-content) {
    max-width: 100%;
    font-size: 14.8px;
    line-height: 1.85;
  }

  :deep(.article-content p) {
    text-align: left;
  }
}
</style>