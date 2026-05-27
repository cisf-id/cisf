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
const { data: stats } = await useFetch(`/api/views/${slugPath}`)

function extractImage(content: string | undefined): string | null {
  if (!content) return null

  const match = content.match(/<img[^>]+src="([^">]+)"/)
  const url = match?.[1]
  if (!url) return null

  return url
    .replace(/\/(s\d+|w\d+|h\d+|w\d+-h\d+)(-[a-zA-Z0-9-]+)*\//g, '/s0/')
    .replace(/=(s\d+|w\d+|h\d+|w\d+)(-[a-zA-Z0-9-]+)*(?=[&"]|$)/g, '=s0')
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
    content: postData.value.content
  }
})

const cleanContent = (html: string) => {
  if (!html) return ''

  let cleaned = html
    .replace(/\s*background-color:\s*[^;'"]+;?/gi, '')
    .replace(/\s*font-family:\s*[^;'"]+;?/gi, '')
    .replace(/\s*style=["']\s*["']/gi, '')

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

  <main class="min-h-screen bg-[#f7f3eb] dark:bg-[#0a0a0a] py-16 sm:py-24">
    <div class="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
      <!-- Back button -->
      <NuxtLink
        to="/webinar-series"
        class="group mb-8 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gray-500 transition-colors hover:text-[#eeba4b] dark:text-gray-400 dark:hover:text-[#eeba4b]"
      >
        <svg
          class="h-4 w-4 transition-transform group-hover:-translate-x-1"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {{ locale === 'en' ? 'Back to Webinar Series' : 'Kembali ke Webinar Series' }}
      </NuxtLink>

      <!-- Loading -->
      <div v-if="pending" class="py-20 text-center text-sm text-gray-400">
        <div class="flex animate-pulse flex-col items-center gap-4">
          <div class="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-[#eeba4b]"></div>
          <span>{{ locale === 'en' ? 'Loading webinar...' : 'Memuat webinar...' }}</span>
        </div>
      </div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="rounded-2xl border border-gray-100 bg-white py-20 text-center text-sm text-red-500 shadow-md dark:border-white/5 dark:bg-[#151515]"
      >
        {{ locale === 'en' ? 'Webinar not found.' : 'Webinar tidak ditemukan.' }}
      </div>

      <!-- Article -->
      <article
        v-else-if="post"
        v-reveal
        class="rounded-[1.75rem] border border-gray-100 bg-white px-5 py-7 shadow-xl shadow-gray-100/50 dark:border-white/5 dark:bg-[#151515] dark:shadow-none sm:px-8 sm:py-10 lg:px-14 lg:py-14"
      >
        <!-- Category Badge -->
        <span class="mb-6 inline-block rounded-full bg-[#eeba4b]/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[#d49f2b] dark:text-[#f3c868]">
          {{ locale === 'en' ? 'Webinar Series' : 'Webinar Series' }}
        </span>

        <!-- Title -->
        <h1 class="mb-6 max-w-4xl text-2xl font-bold leading-snug text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
          {{ post.title }}
        </h1>

        <!-- Meta -->
        <div class="mb-8 flex flex-wrap items-center gap-4 border-b border-gray-100 pb-6 text-xs text-gray-400 dark:border-white/5 dark:text-gray-500">
          <div class="flex items-center gap-1.5">
            <svg class="h-4 w-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span>{{ post.author.displayName }}</span>
          </div>

          <span class="hidden text-gray-300 dark:text-white/10 sm:inline">•</span>

          <div class="flex items-center gap-1.5">
            <svg class="h-4 w-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span>{{ post.published }}</span>
          </div>
        </div>

        <!-- Content -->
        <div
          class="article-content prose max-w-none text-justify text-gray-800 dark:prose-invert dark:text-gray-200"
          v-html="cleanContent(post.content)"
        />
      </article>
    </div>
  </main>
</template>

<style scoped>
:deep(.article-content) {
  max-width: 820px;
  margin-left: auto;
  margin-right: auto;
  font-size: 15px;
  line-height: 1.9;
}

:deep(.article-content p) {
  margin-bottom: 1.5rem;
}

:deep(.article-content img) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 2.5rem auto;
  border-radius: 0.9rem;
  border: 1px solid rgba(229, 231, 235, 0.7);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.06);
}

.dark :deep(.article-content img) {
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: none;
}

:deep(.article-content h2) {
  margin-top: 2.6rem;
  margin-bottom: 1rem;
  font-size: 1.35rem;
  font-weight: 700;
  color: #111827;
}

:deep(.article-content h3) {
  margin-top: 2.2rem;
  margin-bottom: 0.8rem;
  font-size: 1.15rem;
  font-weight: 700;
  color: #1f2937;
}

.dark :deep(.article-content h2),
.dark :deep(.article-content h3) {
  color: #ffffff;
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
  padding: 0.75rem 1rem;
}

.dark :deep(.article-content th),
.dark :deep(.article-content td) {
  border-color: rgba(255, 255, 255, 0.08);
}

@media (max-width: 640px) {
  :deep(.article-content) {
    max-width: 100%;
    font-size: 14.5px;
    line-height: 1.85;
  }
}
</style>