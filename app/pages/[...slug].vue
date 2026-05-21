<script setup lang="ts">
const route = useRoute()
const slugParam = route.params.slug as string
const slugPath = Array.isArray(slugParam) 
? slugParam.join('/') 
: slugParam

const { t, locale } = useI18n()

useSeoMeta({
  title: () => `${t('nav.aboutUs')} — CISF`,
  description: () => t('seo.description')
})

interface Post {
  title: string
  author: { displayName: string }
  published: string
  content: string
}

function extractImage(content: string | undefined): string | null {
  if (!content) return null
  const match = content.match(/<img[^>]+src="([^">]+)"/)
  const url = match?.[1]
  if (!url) return null
  
  return url
    .replace(/\/(s\d+|w\d+|h\d+|w\d+-h\d+)(-[a-zA-Z0-9-]+)*\//g, '/s0/')
    .replace(/=(s\d+|w\d+|h\d+|w\d+-h\d+)(-[a-zA-Z0-9-]+)*(?=[&"]|$)/g, '=s0')
}

function stripFirstImage(content: string | undefined): string {
  if (!content) return ''

  const firstImageRegex = /<img[^>]+>/
  let html = content.replace(firstImageRegex, '')

  const emptyTagRegex = /<(p|div|a|span)[^>]*>\s*(?:&nbsp;)*\s*<\/\1>/gi
  
  let oldHtml;
  do {
    oldHtml = html;
    html = html.replace(emptyTagRegex, '');
  } while (html !== oldHtml);

  return html.trim()
}

const { data: postData, pending, error } = await useFetch<Post>(
  `/api/post/${slugPath}`,
  { key: `post-${slugPath}` }
)

const post = computed(() => {
  if (!postData.value) return null
  return {
    title: parseLocaleText(postData.value.title, locale.value),
    author: postData.value.author,
    published: new Date(postData.value.published).toLocaleDateString(locale.value === 'en' ? 'en-US' : 'id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
    }),
    image: extractImage(postData.value.content),
    content: parseLocaleText(stripFirstImage(postData.value.content), locale.value),
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
  <div class="bg-[#f7f7f7] min-h-screen py-20">
    <div v-if="pending" class="text-gray-400 text-sm">{{ $t('status.searching') }}</div>
    <div v-else-if="error" class="text-red-400 text-sm">{{ locale === 'en' ? 'Page not found.' : 'Halaman tidak ditemukan.' }}</div>

    <article v-else-if="post" class="container mx-auto xl:px-4">
      <div v-if="post.image" class="mb-8 mt-12 overflow-hidden rounded-xl" v-reveal>
        <img 
          :src="post.image" 
          :alt="post.title"
          class="w-full h-auto aspect-[3/1] object-cover"
        />
      </div>

      <p class="text-[10px] tracking-widest uppercase text-gray-500 mb-3" v-reveal-left>
        {{ post.author.displayName }} · {{ post.published }}
      </p>

      <h1 class="text-3xl font-medium leading-snug mb-8" v-reveal>{{ post.title }}</h1>

      <div class="prose max-w-none text-gray-800 text-justify" v-html="cleanContent(post.content)" v-reveal-left/>
      <NuxtLink to="https://drive.google.com/file/d/18d-3fr6m0x-ozWMwjH4ONnznul-ynk3h/view?usp=sharing" target="_blank" class="inline-block mt-10 text-lg text-[#eeba4b] hover:font-bold transition-colors" v-reveal>
        {{ locale === 'en' ? 'Download PDF of CISF Company Profile' : 'Unduh PDF Profil Perusahaan CISF' }}
      </NuxtLink>
    </article>
  </div>
</template>
