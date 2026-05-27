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
const { data: stats } = await useFetch(`/api/views/${slugPath}`)

useSeoMeta({
  title: () => `Artikel — CISF`,
  description: () => t('seo.description')
})

function extractImage(content: string | undefined): string | null {
  if (!content) return null
  const match = content.match(/<img[^\>]+src="([^"\>]+)"/)
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

// Hapus gambar pertama dari konten (karena sudah ditampilkan sebagai hero)
function removeFirstImage(html: string): string {
  if (!html) return ''
  let count = 0
  return html.replace(/<img[^>]*>/gi, (match) => {
    if (count === 0) { count++; return '' }
    return match
  })
}

const cleanContent = (html: string) => {
  if (!html) return ''
  
  let cleaned = html
    // Hapus properti style yang merusak layout mobile
    .replace(/\s*background-color:\s*[^;'"]+;?/gi, '')
    .replace(/\s*font-family:\s*[^;'"]+;?/gi, '')
    .replace(/\s*overflow:\s*[^;'"]+;?/gi, '')
    .replace(/\s*max-height:\s*[^;'"]+;?/gi, '')
    .replace(/\s*display:\s*table[^;'"]*;?/gi, '')
    // Hapus fixed width/height dalam pixel (merusak responsif mobile)
    .replace(/\s*width:\s*\d+px;?/gi, '')
    .replace(/\s*height:\s*\d+px;?/gi, '')
    .replace(/\s*min-height:\s*\d+px;?/gi, '')
    .replace(/\s*min-width:\s*\d+px;?/gi, '')
    // Hapus attribute width dan height di elemen (bukan style)
    .replace(/(<(?:div|table|td|th|tr|p|span)[^>]*)\s+width="\d+[^"]*"/gi, '$1')
    .replace(/(<(?:div|table|td|th|tr|p|span)[^>]*)\s+height="\d+[^"]*"/gi, '$1')
    // Hapus style yang kosong setelah pembersihan
    .replace(/\s*style=["']\s*["']/gi, '')
    .replace(/\s*style=["'][;\s]*["']/gi, '')

  // Ganti URL gambar agar tidak blur
  cleaned = cleaned.replace(/src="([^"]+)"/g, (match, url) => {
    const newUrl = url
      .replace(/\/(s\d+|w\d+|h\d+|w\d+-h\d+)(-[a-zA-Z0-9-]+)*\//g, '/s0/')
      .replace(/=(s\d+|w\d+|h\d+|w\d+-h\d+)(-[a-zA-Z0-9-]+)*(?=[&"]|$)/g, '=s0')
    return `src="${newUrl}"`
  })

  // Hapus gambar pertama karena sudah ditampilkan sebagai hero
  cleaned = removeFirstImage(cleaned)

  return cleaned
}
</script>

<template>
  <Watermark/>
  <div class="article-page-bg">

    <!-- Loading -->
    <div v-if="pending" class="loading-state">
      <div class="spinner"></div>
      <span>{{ locale === 'en' ? 'Loading article...' : 'Memuat artikel...' }}</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      {{ locale === 'en' ? 'Article not found.' : 'Artikel tidak ditemukan.' }}
    </div>

    <!-- Article -->
    <div v-else-if="post" class="article-wrapper">

      <!-- Category Badge -->
      <div class="article-category">
        {{ locale === 'en' ? 'Article' : 'Artikel' }}
      </div>

      <!-- Title -->
      <h1 class="article-title">{{ post.title }}</h1>

      <!-- Meta -->
      <div class="article-meta">
        <span class="meta-author">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
          {{ post.author.displayName }}
        </span>
        <span class="meta-sep">·</span>
        <span class="meta-date">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>
          {{ post.published }}
        </span>
      </div>

      <!-- Hero Image -->
      <div v-if="post.image" class="article-hero">
        <img :src="post.image" :alt="post.title" />
      </div>

      <!-- Content -->
      <div class="article-content" v-html="cleanContent(post.content)" />

    </div>
  </div>
</template>

<style scoped>
/* ── Page background ── */
.article-page-bg {
  min-height: 100vh;
  background: #f9f7f4;
  padding: 72px 0 80px;
}

/* ── Loading & Error ── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 100px 0;
  color: #9ca3af;
  font-size: 14px;
}
.spinner {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
  border-top-color: #eeba4b;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error-state {
  max-width: 600px;
  margin: 80px auto;
  padding: 40px;
  text-align: center;
  background: #fff;
  border-radius: 16px;
  color: #ef4444;
  font-size: 14px;
  border: 1px solid #fee2e2;
}

/* ── Article Wrapper ── */
.article-wrapper {
  max-width: 1100px;
  width: 92%;
  margin: 0 auto;
  padding: 52px 60px 64px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.07);
  font-family: Georgia, "Times New Roman", serif;
  color: #1f2933;
  line-height: 1.85;
}

/* ── Category Badge ── */
.article-category {
  display: inline-block;
  margin-bottom: 18px;
  padding: 5px 14px;
  border-radius: 20px;
  background: #f2ead7;
  color: #8a6a20;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-family: system-ui, sans-serif;
}

/* ── Title ── */
.article-title {
  font-size: 38px;
  line-height: 1.22;
  margin: 0 0 20px;
  color: #111827;
  font-weight: 700;
  letter-spacing: -0.5px;
}

/* ── Meta ── */
.article-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
  font-family: system-ui, sans-serif;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 22px;
  margin-bottom: 32px;
}
.meta-author,
.meta-date {
  display: flex;
  align-items: center;
  gap: 5px;
}
.meta-sep {
  color: #d1d5db;
}

/* ── Hero Image ── */
.article-hero {
  margin-bottom: 36px;
}
.article-hero img {
  width: 100%;
  height: auto;
  border-radius: 14px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.10);
  display: block;
}

/* ── Article Content (prose from Blogger) ── */
.article-content {
  font-size: 17px;
  line-height: 1.9;
  color: #1f2933;
  overflow-wrap: break-word;
  word-break: break-word;
}

/* Force all children responsive */
:deep(.article-content *) {
  max-width: 100% !important;
  box-sizing: border-box !important;
}

:deep(.article-content div),
:deep(.article-content span) {
  overflow: visible !important;
  max-height: none !important;
  height: auto !important;
  width: auto !important;
}

:deep(.article-content p) {
  margin-bottom: 22px;
  overflow: visible !important;
  max-height: none !important;
  height: auto !important;
}

:deep(.article-content h2) {
  font-size: 26px;
  line-height: 1.3;
  margin: 44px 0 16px;
  color: #111827;
  border-left: 5px solid #b89b4f;
  padding-left: 16px;
  font-weight: 700;
}

:deep(.article-content h3) {
  font-size: 21px;
  margin: 32px 0 12px;
  color: #1f2933;
  font-weight: 600;
}

:deep(.article-content strong) {
  color: #111827;
  font-weight: 700;
}

:deep(.article-content a) {
  color: #b89b4f;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Images inside content */
:deep(.article-content img) {
  max-width: 100% !important;
  width: auto !important;
  height: auto !important;
  display: block;
  margin: 28px auto !important;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
}

/* Blockquote */
:deep(.article-content blockquote) {
  margin: 34px 0;
  padding: 22px 28px;
  border-left: 5px solid #b89b4f;
  background: #faf7ef;
  font-size: 20px;
  line-height: 1.6;
  font-style: italic;
  color: #2d3748;
  border-radius: 0 10px 10px 0;
}

/* Tables - scrollable on mobile */
:deep(.article-content table) {
  width: 100% !important;
  margin: 28px 0;
  border-collapse: collapse;
  display: block;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  font-size: 15px;
  font-family: system-ui, sans-serif;
}
:deep(.article-content th),
:deep(.article-content td) {
  border: 1px solid #e5e7eb;
  padding: 10px 14px;
  text-align: left;
}
:deep(.article-content th) {
  background: #f9fafb;
  font-weight: 600;
  color: #111827;
}

/* Iframe / embed */
:deep(.article-content iframe) {
  max-width: 100% !important;
  width: 100% !important;
  height: auto !important;
  min-height: 240px;
  border-radius: 10px;
  margin: 20px 0;
  display: block;
}

/* Lists */
:deep(.article-content ul),
:deep(.article-content ol) {
  padding-left: 24px;
  margin-bottom: 22px;
}
:deep(.article-content li) {
  margin-bottom: 8px;
  font-size: 17px;
}

/* ── Dark mode ── */
.dark .article-page-bg {
  background: #0a0a0a;
}
.dark .article-wrapper {
  background: #141414;
  color: #e5e7eb;
  box-shadow: none;
  border: 1px solid rgba(255,255,255,0.06);
}
.dark .article-title {
  color: #f9fafb;
}
.dark .article-meta {
  color: #9ca3af;
  border-color: rgba(255,255,255,0.08);
}
.dark :deep(.article-content h2) {
  color: #f9fafb;
}
.dark :deep(.article-content h3) {
  color: #e5e7eb;
}
.dark :deep(.article-content strong) {
  color: #f3f4f6;
}
.dark :deep(.article-content blockquote) {
  background: rgba(184,155,79,0.08);
  color: #d1d5db;
}
.dark :deep(.article-content th) {
  background: rgba(255,255,255,0.04);
  color: #f3f4f6;
}
.dark :deep(.article-content td),
.dark :deep(.article-content th) {
  border-color: rgba(255,255,255,0.08);
}

/* ── Responsive Mobile ── */
@media (max-width: 768px) {
  .article-page-bg {
    padding: 60px 0 60px;
  }
  .article-wrapper {
    padding: 28px 20px 40px;
    border-radius: 0;
    box-shadow: none;
    border-left: none;
    border-right: none;
  }
  .article-title {
    font-size: 26px;
    letter-spacing: -0.2px;
  }
  .article-category {
    font-size: 10px;
  }
  :deep(.article-content p),
  :deep(.article-content li) {
    font-size: 15.5px;
  }
  :deep(.article-content h2) {
    font-size: 20px;
  }
  :deep(.article-content h3) {
    font-size: 17px;
  }
  :deep(.article-content blockquote) {
    font-size: 17px;
    padding: 16px 18px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .article-wrapper {
    padding: 40px 32px 52px;
  }
  .article-title {
    font-size: 32px;
  }
}
</style>
