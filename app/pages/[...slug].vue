<script setup lang="ts">
const route = useRoute()
const slugParam = route.params.slug as string
const slugPath = Array.isArray(slugParam) 
? slugParam.join('/') 
: slugParam

useSeoMeta({
  title: 'About Us — CISF',
  description: 'Center of Islamic Social Finance (CISF) adalah jaringan kolaboratif para peneliti yang berdedikasi untuk memajukan bidang keuangan sosial Islam dan mengeksplorasi potensinya untuk menciptakan dampak sosial yang positif. Pusat ini berfokus pada melakukan penelitian, mengumpulkan data yang relevan, mengimplementasikan proyek-proyek berbasis komunitas, dan menyediakan program pendampingan dan pelatihan yang berkaitan dengan keuangan sosial Islam. CISF berpengalaman sebagai pusat penelitian di bidang penelitian keuangan sosial Islam, berbagai proyek pengabdian masyarakat, termasuk program peningkatan kapasitas, pendaftaran dokumen legal untuk UMKM, pendaftaran sertifikasi halal, pelatihan dan pendampingan manajemen keuangan, serta pelatihan dan pendampingan pemasaran digital, telah melakukan lebih dari 30 studi penelitian inovatif tentang topik-topik seperti wakaf (wazaf Islam), zakat (sedekah), keuangan mikro Islam, keberlanjutan ekonomi, keberlanjutan keuangan, dan ekosistem halal, yang telah diterbitkan dalam jurnal internasional yang terindeks di Scopus dan Sinta. Dengan memberdayakan individu dan organisasi, CISF, sebagai pusat penelitian, tidak hanya berkontribusi pada pengetahuan akademis tetapi juga pada solusi dunia nyata yang mengatasi tantangan sosial dan ekonomi yang mendesak. Dengan melibatkan berbagai pemangku kepentingan, termasuk pembuat kebijakan, lembaga keuangan, dan komunitas lokal, pusat ini berupaya mendorong perubahan yang berarti dan memastikan bahwa keuangan sosial Islam berfungsi sebagai alat untuk kesetaraan sosial dan ekonomi yang lebih besar.'
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
  return match?.[1] ?? null
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
    title: postData.value.title,
    author: postData.value.author,
    published: new Date(postData.value.published).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
    }),
    image: extractImage(postData.value.content),
    content: stripFirstImage(postData.value.content),
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
    <div v-if="pending" class="text-gray-400 text-sm">Memuat...</div>
    <div v-else-if="error" class="text-red-400 text-sm">Halaman tidak ditemukan.</div>

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
        Download PDF of CISF Company Profile
      </NuxtLink>
    </article>
  </div>
</template>
