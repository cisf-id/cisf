<script setup lang="ts">
const route = useRoute()
const slugParam = route.params.slug as string
const slugPath = Array.isArray(slugParam) 
? slugParam.join('/') 
: slugParam

interface Post {
  title: string
  author: { displayName: string }
  published: string
  content: string
}

const { t, locale } = useI18n()
const { data: stats } = await useFetch(`/api/views/${slugPath}`);

function extractImage(content: string | undefined): string | null {
  if (!content) return null
  const match = content.match(/<img[^>]+src="([^">]+)"/)
  const url = match?.[1]
  if (!url) return null
  
  return url
    .replace(/\/(s\d+|w\d+|h\d+|w\d+-h\d+)(-[a-zA-Z0-9-]+)*\//g, '/s0/')
    .replace(/=(s\d+|w\d+|h\d+|w\d+-h\d+)(-[a-zA-Z0-9-]+)*(?=[&"]|$)/g, '=s0')
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
    published: new Date(postData.value.published).toLocaleDateString(locale.value === 'en' ? 'en-US' : 'id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    }),
    image: extractImage(postData.value.content),
    content: postData.value.content,
  }
})

const cleanContent = (html: string) => {
  if (!html) return ''
  
  // Hapus inline style background-color dan font-family
  let cleaned = html
    .replace(/\s*background-color:\s*[^;'"]+;?/gi, '')
    .replace(/\s*font-family:\s*[^;'"]+;?/gi, '')
    // Hapus attribute style yang kosong
    .replace(/\s*style=["']\s*["']/gi, '')

  // Ganti URL gambar agar tidak blur (menggunakan ukuran original /s0/ atau =s0)
  cleaned = cleaned.replace(/src="([^"]+)"/g, (match, url) => {
    const newUrl = url
      .replace(/\/(s\d+|w\d+|h\d+|w\d+-h\d+)(-[a-zA-Z0-9-]+)*\//g, '/s0/')
      .replace(/=(s\d+|w\d+|h\d+|w\d+-h\d+)(-[a-zA-Z0-9-]+)*(?=[&"]|$)/g, '=s0')
    return `src="${newUrl}"`
  })

  return cleaned
}
</script>

<template>
  <Watermark/>
  <div class="bg-[#f7f7f7] dark:bg-[#0a0a0a] min-h-screen py-16 sm:py-24">
    <div class="max-w-3xl mx-auto px-4">
      <!-- Back button -->
      <NuxtLink 
        to="/research" 
        class="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-gray-500 hover:text-[#eeba4b] dark:text-gray-400 dark:hover:text-[#eeba4b] transition-colors mb-8 group"
      >
        <svg class="w-4.5 h-4.5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
        {{ locale === 'en' ? 'Back to Research' : 'Kembali ke Riset' }}
      </NuxtLink>

      <div v-if="pending" class="text-center py-20 text-gray-400 text-sm">
        <div class="animate-pulse flex flex-col items-center gap-4">
          <div class="w-10 h-10 rounded-full border-2 border-gray-200 border-t-[#eeba4b] animate-spin"></div>
          <span>{{ locale === 'en' ? 'Loading research...' : 'Memuat riset...' }}</span>
        </div>
      </div>
      <div v-else-if="error" class="text-center py-20 text-red-500 text-sm bg-white dark:bg-[#151515] rounded-2xl border border-gray-100 dark:border-white/5 shadow-md">
        {{ locale === 'en' ? 'Research not found.' : 'Riset tidak ditemukan.' }}
      </div>

      <article 
        v-else-if="post" 
        class="bg-white dark:bg-[#151515] rounded-2xl border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/50 dark:shadow-none p-6 sm:p-10 md:p-12"
        v-reveal
      >
        <!-- Category Badge -->
        <span class="inline-block px-3 py-1 text-[9px] font-bold tracking-widest uppercase bg-[#eeba4b]/10 text-[#d49f2b] dark:text-[#f3c868] rounded-full mb-6">
          {{ locale === 'en' ? 'Research' : 'Riset' }}
        </span>

        <!-- Title -->
        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-snug mb-6">
          {{ post.title }}
        </h1>

        <!-- Meta info -->
        <div class="flex flex-wrap items-center gap-4 text-xs text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-white/5 pb-6 mb-8">
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
            </svg>
            <span>{{ post.author.displayName }}</span>
          </div>
          <span class="text-gray-300 dark:text-white/10 hidden sm:inline">•</span>
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
            </svg>
            <span>{{ post.published }}</span>
          </div>
        </div>

        <!-- Content -->
        <div class="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 text-justify" v-html="cleanContent(post.content)" />
      </article>
    </div>
  </div>
</template>

<style scoped>
:deep(.prose) {
  font-size: 14.5px;
  line-height: 1.85;
}
:deep(.prose img) {
  margin: 2.5rem auto;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(229, 231, 235, 0.5);
  max-width: 100%;
  height: auto;
  display: block;
}
.dark :deep(.prose img) {
  border-color: rgba(255, 255, 255, 0.05);
  box-shadow: none;
}
:deep(.prose p) {
  margin-bottom: 1.5rem;
}
:deep(.prose h2) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  color: #111;
}
.dark :deep(.prose h2) {
  color: #fff;
}
:deep(.prose h3) {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  color: #222;
}
.dark :deep(.prose h3) {
  color: #eee;
}
:deep(.prose table) {
  width: 100%;
  margin: 2rem 0;
  border-collapse: collapse;
}
:deep(.prose th), :deep(.prose td) {
  border: 1px solid rgba(229, 231, 235, 1);
  padding: 0.75rem 1rem;
}
.dark :deep(.prose th), .dark :deep(.prose td) {
  border-color: rgba(255, 255, 255, 0.05);
}
:deep(.prose th) {
  background-color: rgba(0, 0, 0, 0.02);
}
.dark :deep(.prose th) {
  background-color: rgba(255, 255, 255, 0.02);
}
</style>