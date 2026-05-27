<script setup lang="ts">
const { locale } = useI18n()

useSeoMeta({
  title: 'What is CISF? — Center of Islamic Social Finance',
  description:
    'Center of Islamic Social Finance is a collaborative research center focused on Islamic social finance, data, community empowerment, and sustainable impact.'
})
</script>

<template>
  <main class="min-h-screen bg-[#f5f1e8] dark:bg-[#090909] overflow-x-hidden">
    <!-- HERO -->
    <section class="relative overflow-hidden pt-36 pb-20 sm:pt-40 lg:pt-44 lg:pb-28">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-white/80 blur-3xl dark:bg-white/[0.03]"></div>
        <div class="absolute right-0 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[#c49a3b]/10 blur-3xl"></div>
      </div>

      <div class="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <NuxtLink
          to="/"
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
          {{ locale === 'en' ? 'Back to Home' : 'Kembali ke Beranda' }}
        </NuxtLink>

        <div class="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <!-- LEFT -->
          <div>
            <div class="mb-7 flex items-center gap-3">
              <span class="h-px w-12 bg-[#b88a2e]"></span>
              <span class="text-[11px] font-bold uppercase tracking-[0.28em] text-[#b88a2e]">
                About CISF
              </span>
            </div>

            <h1 class="max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight text-gray-950 dark:text-white sm:text-5xl lg:text-6xl">
              What is Center of Islamic Social Finance?
            </h1>

            <p class="mt-8 max-w-2xl text-base leading-8 text-gray-600 dark:text-gray-400">
              Center of Islamic Social Finance atau CISF adalah pusat kolaborasi riset,
              edukasi, data, dan pengembangan ekosistem Islamic social finance yang
              berfokus pada zakat, wakaf, filantropi Islam, keuangan sosial, ekonomi
              syariah, dan pembangunan berkelanjutan.
            </p>

            <div class="mt-10 flex flex-wrap gap-3">
              <NuxtLink
                to="/research"
                class="rounded-full bg-gray-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-[#b88a2e] dark:bg-white dark:text-gray-950 dark:hover:bg-[#eeba4b]"
              >
                Explore Research
              </NuxtLink>

              <NuxtLink
                to="/publication"
                class="rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-900 transition hover:border-[#b88a2e] hover:text-[#b88a2e] dark:border-white/20 dark:text-white"
              >
                View Publication
              </NuxtLink>
            </div>
          </div>

          <!-- RIGHT VISUAL -->
          <div class="relative">
            <div class="absolute -inset-4 rounded-[2.5rem] bg-[#c49a3b]/10 blur-2xl"></div>

            <div class="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white p-4 shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
              <div class="flex min-h-[420px] flex-col justify-between rounded-[1.4rem] bg-[#1f2933] p-8 text-white">
                <div>
                  <p class="text-[11px] uppercase tracking-[0.26em] text-[#eeba4b]">
                    Center of Islamic Social Finance
                  </p>

                  <h2 class="mt-8 max-w-md text-3xl font-semibold leading-tight sm:text-4xl">
                    Research, Data, Community, and Impact
                  </h2>
                </div>

                <p class="max-w-sm text-sm leading-7 text-white/70">
                  Advancing Islamic social finance as a pathway toward inclusive,
                  ethical, and sustainable development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- HIGHLIGHT -->
    <section class="pb-12">
      <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <p class="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#b88a2e]">
              01
            </p>
            <h3 class="text-lg font-semibold text-gray-950 dark:text-white">
              Research
            </h3>
            <p class="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
              Mengembangkan kajian akademik dalam zakat, wakaf, Islamic microfinance,
              halal ecosystem, dan keberlanjutan.
            </p>
          </div>

          <div class="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <p class="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#b88a2e]">
              02
            </p>
            <h3 class="text-lg font-semibold text-gray-950 dark:text-white">
              Data
            </h3>
            <p class="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
              Menguatkan inisiatif Islamic social finance melalui data, riset berbasis
              bukti, dan analisis kebijakan.
            </p>
          </div>

          <div class="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <p class="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#b88a2e]">
              03
            </p>
            <h3 class="text-lg font-semibold text-gray-950 dark:text-white">
              Community
            </h3>
            <p class="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
              Mendukung proyek berbasis komunitas, pemberdayaan UMKM, sertifikasi
              halal, mentoring, dan pelatihan.
            </p>
          </div>

          <div class="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <p class="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#b88a2e]">
              04
            </p>
            <h3 class="text-lg font-semibold text-gray-950 dark:text-white">
              Impact
            </h3>
            <p class="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
              Menghubungkan pengetahuan akademik dengan solusi nyata untuk keadilan
              sosial, ekonomi, dan pembangunan berkelanjutan.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTENT -->
    <section class="pb-20 sm:pb-24 lg:pb-32">
      <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-5xl border-t border-black/10 pt-14 dark:border-white/10">
          <div class="grid gap-10 lg:grid-cols-[180px_minmax(0,1fr)]">
            <aside class="hidden lg:block">
              <div class="sticky top-28">
                <p class="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
                  Overview
                </p>
                <div class="mt-4 h-px w-16 bg-[#b88a2e]"></div>
              </div>
            </aside>

            <article class="max-w-[820px] text-gray-800 dark:text-gray-200">
              <p class="text-lg leading-9 text-gray-900 dark:text-white">
                CISF hadir sebagai ruang kolaboratif untuk memperkuat pengembangan
                Islamic social finance melalui pendekatan akademik, data-driven,
                dan berbasis dampak sosial.
              </p>

              <p class="mt-6 text-base leading-8 text-gray-600 dark:text-gray-400">
                Fokus CISF tidak hanya berada pada pengembangan teori, tetapi juga pada
                penguatan praktik dan ekosistem. Melalui riset, publikasi, webinar,
                pelatihan, dan program kolaboratif, CISF berupaya menghubungkan
                akademisi, praktisi, lembaga sosial, regulator, komunitas, dan masyarakat
                luas dalam satu ekosistem pengetahuan yang produktif.
              </p>

              <h2 class="mt-12 text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
                Our Focus
              </h2>

              <p class="mt-5 text-base leading-8 text-gray-600 dark:text-gray-400">
                CISF menaruh perhatian pada isu-isu strategis seperti tata kelola zakat,
                pengembangan wakaf produktif, Islamic social entrepreneurship,
                pemberdayaan ekonomi umat, sertifikasi halal, keuangan inklusif,
                transformasi digital, dan integrasi Islamic social finance dengan agenda
                Sustainable Development Goals.
              </p>

              <h2 class="mt-12 text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
                Our Approach
              </h2>

              <p class="mt-5 text-base leading-8 text-gray-600 dark:text-gray-400">
                Pendekatan CISF menggabungkan kekuatan riset akademik, analisis data,
                kolaborasi lintas institusi, dan program berbasis komunitas. Dengan
                pendekatan ini, CISF berupaya menghasilkan pengetahuan yang tidak hanya
                relevan secara ilmiah, tetapi juga bermanfaat bagi pengambilan keputusan,
                inovasi kelembagaan, dan penguatan dampak sosial.
              </p>

              <h2 class="mt-12 text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
                Our Commitment
              </h2>

              <p class="mt-5 text-base leading-8 text-gray-600 dark:text-gray-400">
                CISF berkomitmen menjadi pusat pengetahuan dan kolaborasi yang mendorong
                Islamic social finance sebagai instrumen penting dalam membangun
                masyarakat yang lebih adil, inklusif, berdaya, dan berkelanjutan.
              </p>

              <div class="mt-12 rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                <p class="text-sm leading-7 text-gray-600 dark:text-gray-400">
                  Through research, collaboration, and community engagement, CISF aims to
                  strengthen Islamic social finance as a meaningful pathway toward
                  inclusive development and sustainable social impact.
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>