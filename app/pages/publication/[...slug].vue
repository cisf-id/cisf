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

const { data: stats } = await useFetch(`/api/views/${slugPath}`);

function extractImage(content: string | undefined): string | null {
  if (!content) return null
  const match = content.match(/<img[^>]+src="([^">]+)"/)
  return match?.[1] ?? null
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
    published: new Date(postData.value.published).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
    }),
    image: extractImage(postData.value.content),
    content: postData.value.content,
  }
})

const cleanContent = (html: string) => {
  if (!html) return ''
  
  // Hapus inline style background-color dan font-family
  return html
    .replace(/\s*background-color:\s*[^;'"]+;?/gi, '')
    .replace(/\s*font-family:\s*[^;'"]+;?/gi, '')
    // Hapus attribute style yang kosong
    .replace(/\s*style=["']\s*["']/gi, '')
}
</script>

<template>
  <Watermark/>
  <div class="bg-[#f7f7f7] min-h-screen py-20">
    <div v-if="pending" class="text-gray-400 text-sm">Memuat publikasi...</div>
    <div v-else-if="error" class="text-red-400 text-sm">Publikasi tidak ditemukan.</div>

    <article v-else-if="post" class="container mx-auto xl:px-4 mt-12">
      <!-- <p class="text-[10px] text-gray-500 mb-3">Dilihat {{ stats?.views || 0 }} kali</p> -->
      <p class="text-[10px] tracking-widest uppercase text-gray-500 mb-3">
        {{ post.author.displayName }} · {{ post.published }}
      </p>

      <h1 class="text-3xl font-medium leading-snug mb-8">{{ post.title }}</h1>

      <div class="prose max-w-none text-gray-800" v-html="cleanContent(post.content)" />
    </article>
  </div>
</template>