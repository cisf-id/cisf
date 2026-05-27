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

interface Partner {
  name: string
  logo: string
  role: string
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

function stripHtml(content: string | undefined): string {
  if (!content) return ''

  return content
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function getResearchPartners(title: string): Partner[] {
  const lowerTitle = title.toLowerCase()

  if (lowerTitle.includes('rki')) {
    return [
      {
        name: 'LPDP',
        logo: '/assets/img/partners/lpdp.png',
        role: 'Research funding and scholarship ecosystem partner'
      },
      {
        name: 'CISF',
        logo: '/assets/img/partners/cisf.png',
        role: 'Research center and knowledge partner'
      }
    ]
  }

  if (lowerTitle.includes('riim') || lowerTitle.includes('brin')) {
    return [
      {
        name: 'BRIN',
        logo: '/assets/img/partners/brin.png',
        role: 'National research and innovation institution'
      },
      {
        name: 'CISF',
        logo: '/assets/img/partners/cisf.png',
        role: 'Research center and knowledge partner'
      }
    ]
  }

  if (lowerTitle.includes('arf') || lowerTitle.includes('airlangga research fund')) {
    return [
      {
        name: 'Universitas Airlangga',
        logo: '/assets/img/partners/unair.png',
        role: 'Academic and research funding institution'
      },
      {
        name: 'CISF',
        logo: '/assets/img/partners/cisf.png',
        role: 'Research center and knowledge partner'
      }
    ]
  }

  if (lowerTitle.includes('grand research sawit') || lowerTitle.includes('sawit')) {
    return [
      {
        name: 'BPDP',
        logo: '/assets/img/partners/bpdp.png',
        role: 'Palm oil fund and research support institution'
      },
      {
        name: 'CISF',
        logo: '/assets/img/partners/cisf.png',
        role: 'Research center and knowledge partner'
      }
    ]
  }

  if (lowerTitle.includes('unesa')) {
    return [
      {
        name: 'UNESA',
        logo: '/assets/img/partners/unesa.png',
        role: 'Academic collaboration partner'
      },
      {
        name: 'CISF',
        logo: '/assets/img/partners/cisf.png',
        role: 'Research center and knowledge partner'
      }
    ]
  }

  return [
    {
      name: 'CISF',
      logo: '/assets/img/partners/cisf.png',
      role: 'Research center and knowledge partner'
    }
  ]
}

function getResearchFocus(title: string): string {
  const lowerTitle = title.toLowerCase()

  if (lowerTitle.includes('rki')) {
    return 'Collaborative research on Islamic financial literacy, equity, and inclusive development.'
  }

  if (lowerTitle.includes('riim') || lowerTitle.includes('brin')) {
    return 'Research and innovation initiative focusing on halal value chain, digital ecosystem, and national development priorities.'
  }

  if (lowerTitle.includes('arf') || lowerTitle.includes('airlangga research fund')) {
    return 'Applied academic research supported through the Airlangga research ecosystem.'
  }

  if (lowerTitle.includes('grand research sawit') || lowerTitle.includes('sawit')) {
    return 'Research initiative related to palm oil financing, sustainability, and Islamic social finance innovation.'
  }

  if (lowerTitle.includes('unesa')) {
    return 'Research coaching and academic mentoring initiative for strengthening Islamic social finance studies.'
  }

  return 'Research initiative under the Center of Islamic Social Finance knowledge ecosystem.'
}

function hideBrokenImage(event: Event) {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

const { data: postData, pending, error } = await useFetch<Post>(
  `/api/post/${slugPath}`,
  { key: `research-${slugPath}` }
)

const post = computed(() => {
  if (!postData.value) return null

  const cleanExcerpt = stripHtml(postData.value.content)
  const title = postData.value.title

  return {
    title,
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
    excerpt: cleanExcerpt.length > 260 ? cleanExcerpt.slice(0, 260) + '…' : cleanExcerpt,
    partners: getResearchPartners(title),
    focus: getResearchFocus(title)
  }
})
</script>

<template>
  <Watermark />

  <main class="min-h-screen overflow-x-hidden bg-[#f5f1e8] dark:bg-[#090909]">
    <!-- HERO -->
    <section class="relative overflow-hidden pt-32 pb-16 sm:pt-36 lg:pt-40 lg:pb-20">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-white/80 blur-3xl dark:bg-white/[0.03]"></div>
        <div class="absolute right-0 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[#c49a3b]/10 blur-3xl"></div>
      </div>

      <div class="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <NuxtLink
          to="/research"
          class="group mb-12 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-gray-500 transition-colors hover:text-[#b88a2e] dark:text-gray-400 dark:hover:text-[#eeba4b]"
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
          {{ locale === 'en' ? 'Back to Research' : 'Kembali ke Riset' }}
        </NuxtLink>

        <div v-if="pending" class="py-24 text-center text-sm text-gray-400">
          <div class="flex animate-pulse flex-col items-center gap-4">
            <div class="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-[#c49a3b]"></div>
            <span>{{ locale === 'en' ? 'Loading research...' : 'Memuat riset...' }}</span>
          </div>
        </div>

        <div
          v-else-if="error"
          class="rounded-3xl border border-gray-100 bg-white px-6 py-20 text-center text-sm text-red-500 shadow-sm dark:border-white/10 dark:bg-[#151515]"
        >
          {{ locale === 'en' ? 'Research not found.' : 'Riset tidak ditemukan.' }}
        </div>

        <article
          v-else-if="post"
          v-reveal
          class="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center"
        >
          <!-- LEFT -->
          <div>
            <div class="mb-7 flex items-center gap-3">
              <span class="h-px w-12 bg-[#b88a2e]"></span>
              <span class="text-[11px] font-bold uppercase tracking-[0.28em] text-[#b88a2e]">
                Research
              </span>
            </div>

            <h1 class="max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight text-gray-950 dark:text-white sm:text-5xl lg:text-6xl">
              {{ post.title }}
            </h1>

            <div class="mt-8 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span class="font-medium text-gray-800 dark:text-gray-200">
                {{ post.author.displayName }}
              </span>
              <span class="text-gray-300 dark:text-white/20">•</span>
              <span>{{ post.published }}</span>
            </div>

            <p class="mt-8 max-w-2xl text-base leading-8 text-gray-600 dark:text-gray-400">
              {{ post.focus }}
            </p>

            <div class="mt-10 flex flex-wrap gap-3">
              <span class="inline-flex rounded-full border border-[#c49a3b]/30 bg-[#c49a3b]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9a7220]">
                On Progress to be Uploaded
              </span>

              <span class="inline-flex rounded-full border border-black/10 bg-white/70 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-300">
                {{ post.year }}
              </span>
            </div>
          </div>

          <!-- RIGHT VISUAL -->
          <div class="relative">
            <div class="absolute -inset-4 rounded-[2.5rem] bg-[#c49a3b]/10 blur-2xl"></div>

            <div class="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white p-4 shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
              <img
                v-if="post.image"
                :src="post.image"
                :alt="post.title"
                class="h-auto w-full rounded-[1.4rem] object-cover"
              />

              <div
                v-else
                class="flex min-h-[420px] flex-col justify-between rounded-[1.4rem] bg-[#1f2933] p-8 text-white"
              >
                <div>
                  <p class="text-[11px] uppercase tracking-[0.26em] text-[#eeba4b]">
                    Center of Islamic Social Finance
                  </p>

                  <h2 class="mt-8 max-w-md text-3xl font-semibold leading-tight sm:text-4xl">
                    Research Brief in Progress
                  </h2>
                </div>

                <p class="max-w-sm text-sm leading-7 text-white/70">
                  The full research material is being curated and will be uploaded after internal review.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- PARTNER INSTITUTIONS -->
    <section v-if="post" class="pb-10">
      <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div class="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
          <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-[#b88a2e]">
                Institution
              </p>
              <h2 class="mt-3 text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
                Related Institution and Research Partner
              </h2>
            </div>

            <p class="max-w-md text-sm leading-7 text-gray-500 dark:text-gray-400">
              The institutional logo is displayed based on the research program category.
            </p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="partner in post.partners"
              :key="partner.name"
              class="group rounded-[1.4rem] border border-black/5 bg-[#f8f5ed] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
            >
              <div class="flex h-20 items-center justify-center rounded-2xl bg-white p-4 dark:bg-white">
                <img
                  :src="partner.logo"
                  :alt="partner.name"
                  class="max-h-12 max-w-full object-contain"
                  @error="hideBrokenImage"
                />
              </div>

              <h3 class="mt-5 text-base font-semibold text-gray-950 dark:text-white">
                {{ partner.name }}
              </h3>

              <p class="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {{ partner.role }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- RESEARCH STATUS CARDS -->
    <section v-if="post" class="pb-10">
      <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div class="grid gap-5 md:grid-cols-3">
          <div class="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <p class="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#b88a2e]">
              Focus
            </p>
            <h3 class="text-lg font-semibold text-gray-950 dark:text-white">
              Research Topic
            </h3>
            <p class="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
              Fokus riset sedang dalam tahap finalisasi dan akan ditampilkan setelah naskah ringkasan resmi selesai diunggah.
            </p>
          </div>

          <div class="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <p class="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#b88a2e]">
              Method
            </p>
            <h3 class="text-lg font-semibold text-gray-950 dark:text-white">
              Research Design
            </h3>
            <p class="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
              Desain metodologi dan pendekatan analisis masih on progress to be uploaded agar informasi yang tampil tetap akurat.
            </p>
          </div>

          <div class="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <p class="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#b88a2e]">
              Output
            </p>
            <h3 class="text-lg font-semibold text-gray-950 dark:text-white">
              Expected Deliverables
            </h3>
            <p class="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
              Dokumen riset, ringkasan temuan, dan publikasi terkait akan ditambahkan setelah proses kurasi konten selesai.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- BODY -->
    <section v-if="post" class="pb-20 sm:pb-24 lg:pb-32">
      <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-5xl border-t border-black/10 pt-14 dark:border-white/10">
          <div class="grid gap-10 lg:grid-cols-[180px_minmax(0,1fr)]">
            <aside class="hidden lg:block">
              <div class="sticky top-28">
                <p class="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
                  Research Note
                </p>
                <div class="mt-4 h-px w-16 bg-[#b88a2e]"></div>
              </div>
            </aside>

            <article class="max-w-[820px] text-gray-800 dark:text-gray-200">
              <div class="rounded-[1.8rem] border border-[#c49a3b]/20 bg-[#fffaf0] p-6 shadow-sm dark:border-[#c49a3b]/20 dark:bg-[#c49a3b]/10 sm:p-8">
                <p class="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b88a2e]">
                  Status
                </p>

                <h2 class="mt-4 text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
                  Full Research Content Is On Progress to Be Uploaded
                </h2>

                <p class="mt-5 text-base leading-8 text-gray-700 dark:text-gray-300">
                  The CISF team is currently preparing the complete research content for this page. The displayed information serves as a preliminary research page structure and will be updated once the official research brief, abstract, methodology, and related documents are ready to be published.
                </p>
              </div>

              <div class="mt-12">
                <h2 class="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
                  Preliminary Overview
                </h2>

                <p class="mt-5 text-base leading-8 text-gray-600 dark:text-gray-400">
                  Halaman ini disiapkan sebagai ruang publikasi riset CISF yang akan memuat informasi utama mengenai latar belakang kajian, fokus penelitian, pendekatan metodologis, keluaran riset, serta kontribusi akademik dan praktis yang relevan dengan pengembangan Islamic Social Finance.
                </p>

                <p class="mt-5 text-base leading-8 text-gray-600 dark:text-gray-400">
                  Konten lengkap tidak ditampilkan secara spekulatif agar informasi yang diterima pembaca tetap akurat, transparan, dan sesuai dengan dokumen resmi yang akan diunggah oleh tim. Setelah proses kurasi selesai, halaman ini dapat diperbarui dengan abstrak, ringkasan metode, temuan awal, dan tautan dokumen pendukung.
                </p>
              </div>

              <div v-if="post.excerpt" class="mt-12 border-t border-black/10 pt-10 dark:border-white/10">
                <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">
                  Existing Draft Snippet
                </p>

                <p class="mt-5 text-base leading-8 text-gray-600 dark:text-gray-400">
                  {{ post.excerpt }}
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>