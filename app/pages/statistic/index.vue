<script setup lang="ts">
import { Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, LineElement, PointElement,
  Filler, Tooltip
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler, Tooltip)

useSeoMeta({
  title: 'Statistics — CISF',
  description: 'Data keuangan sosial Islam dalam format visual interaktif'
})

const activeSection = ref('zakat')
const sections = [
  { id: 'zakat', label: 'Zakat Watch' },
  { id: 'wakaf', label: 'Wakaf & Infak' },
  { id: 'finance', label: 'Islamic Finance' },
  { id: 'indeks', label: 'Indeks Umat' },
]

const scrollTo = (id: string) => {
  activeSection.value = id
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Chart options
const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 } } },
    y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 } } },
  }
}

// Data Zakat
const zakatBarData = {
  labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
  datasets: [{
    data: [10.2, 12.4, 17.5, 22.4, 27.7, 33],
    backgroundColor: '#eeba4b',
    borderRadius: 4,
  }]
}
const zakatMetrics = [
  { label: 'Potensi Zakat', value: 'Rp 327 T', sub: 'Estimasi BAZNAS 2024', badge: null },
  { label: 'Realisasi Terkumpul', value: 'Rp 33 T', sub: '10% dari potensi', badge: { text: 'Gap 90%', type: 'warn' } },
  { label: 'Muzakki Aktif', value: '4.2 Jt', sub: 'dari 93 jt wajib zakat', badge: { text: 'Rendah', type: 'down' } },
  { label: 'Pertumbuhan YoY', value: '+18.4%', sub: 'Penerimaan 2023–2024', badge: { text: 'Naik', type: 'up' } },
]
const zakatBars = [
  { label: 'Zakat Penghasilan', pct: 54 },
  { label: 'Zakat Perdagangan', pct: 22 },
  { label: 'Zakat Fitrah', pct: 14 },
  { label: 'Zakat Pertanian', pct: 6 },
  { label: 'Lainnya', pct: 4 },
]

// Data Wakaf
const wakafLineData = {
  labels: ['2020', '2021', '2022', '2023', '2024'],
  datasets: [{
    data: [0.4, 0.62, 0.87, 1.2, 1.4],
    borderColor: '#1D9E75',
    backgroundColor: 'rgba(29,158,117,0.08)',
    fill: true, tension: 0.4, pointRadius: 3,
    pointBackgroundColor: '#1D9E75'
  }]
}
const wakafMetrics = [
  { label: 'Aset Wakaf Tanah', value: '420 rb ha', sub: 'Tersebar 500 rb lokasi', badge: null },
  { label: 'Wakaf Uang Terkumpul', value: 'Rp 1.4 T', sub: '▲ 15% YoY', badge: { text: 'Produktif', type: 'up' } },
  { label: 'Infak Digital/Bulan', value: 'Rp 89 M', sub: 'Platform online', badge: { text: '▲ 23%', type: 'up' } },
  { label: 'Produktivitas Lahan', value: '56%', sub: '44% butuh inkubasi', badge: { text: 'Perlu Dorong', type: 'warn' } },
]
const wakafBars = [
  { label: 'Lahan Produktif', pct: 56, color: '#639922' },
  { label: 'Non-Produktif', pct: 30, color: '#E24B4A' },
  { label: 'Dalam Proses', pct: 14, color: '#BA7517' },
]

// Data Finance
const financeLineData = {
  labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
  datasets: [{
    data: [538, 593, 674, 728, 794, 868],
    borderColor: '#534AB7',
    backgroundColor: 'rgba(83,74,183,0.08)',
    fill: true, tension: 0.4, pointRadius: 3,
    pointBackgroundColor: '#534AB7'
  }]
}
const financeMetrics = [
  { label: 'Market Share', value: '7.03%', sub: 'Stagnan di bawah 10%', badge: { text: 'Stagnan', type: 'warn' } },
  { label: 'Total Aset', value: 'Rp 868 T', sub: '▲ 9.2% YoY', badge: { text: 'Tumbuh', type: 'up' } },
  { label: 'Jumlah Bank Syariah', value: '13 BUS', sub: '+ 20 UUS aktif', badge: null },
  { label: 'Pembiayaan Murabahah', value: '48.3%', sub: 'Dominasi akad', badge: null },
]
const financeBars = [
  { label: 'Konvensional', pct: 93, color: '#888780' },
  { label: 'Syariah', pct: 7, color: '#eeba4b' },
]
const pembiayaanBars = [
  { label: 'Murabahah', pct: 48 },
  { label: 'Musyarakah', pct: 29 },
  { label: 'Mudharabah', pct: 13 },
  { label: 'Lainnya', pct: 10 },
]

// Indeks Umat
const indeksMetrics = [
  { label: 'Tingkat Kemiskinan', value: '9.5%', sub: 'Penduduk Muslim', badge: { text: 'Kritis', type: 'down' } },
  { label: 'Literasi Keuangan Syariah', value: '9.1%', sub: 'Sangat rendah', badge: { text: 'Rendah', type: 'down' } },
  { label: 'Literasi Keuangan Umum', value: '49.6%', sub: 'Nasional', badge: { text: 'Sedang', type: 'warn' } },
  { label: 'IPM Basis Pesantren', value: '67.4', sub: 'Di bawah rata-rata', badge: { text: 'Perhatian', type: 'warn' } },
]
const indeksBars = [
  { label: 'Literasi Syariah', pct: 9.1, color: '#E24B4A' },
  { label: 'Literasi Umum', pct: 49.6, color: '#BA7517' },
  { label: 'Target 2030', pct: 75, color: '#639922' },
]

const { data: articlesData } = await useFetch('/api/blog/posts', {
  default: () => ({ items: [] })
})

function extractImage(content: string): string | null {
  return content?.match(/<img[^>]+src="([^">]+)"/)?.[1] ?? null
}

const articles = computed(() => {
  if (!(articlesData.value as any)?.items) return []
  return (articlesData.value as any).items.slice(0, 6).map((p: any) => ({
    id: p.id,
    title: p.title,
    label: p.labels?.[0] ?? 'Riset',
    date: new Date(p.published).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    image: extractImage(p.content),
    url: `/article/${p.id}`,
  }))
})

// Badge color helper
const badgeClass = (type: string) => ({
  up: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  down: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  warn: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
}[type] ?? '')
</script>

<template>
  <main class="min-h-screen bg-[#f7f7f7] dark:bg-[#0a0a0a]">
    <!-- Hero -->
    <div class="bg-[#0a0a0a] pt-24 sm:pt-28 pb-10 sm:pb-12">
      <div class="container mx-auto px-4 sm:px-6">
        <div v-reveal>
          <p class="text-[10px] tracking-widest uppercase text-[#eeba4b] mb-2">Data & Visual</p>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-medium text-white mb-3">Statistik</h1>
          <p class="text-sm text-white/50 max-w-lg leading-relaxed">
            Data dan temuan riset CISF dalam format visual — zakat, wakaf, perbankan syariah, dan indeks kesejahteraan umat.
          </p>
        </div>

        <!-- Nav tabs -->
        <div class="flex gap-2 mt-8 flex-wrap" v-reveal>
          <button
            v-for="sec in sections"
            :key="sec.id"
            @click="scrollTo(sec.id)"
            :class="[
              'text-[10px] tracking-widest uppercase px-3 sm:px-4 py-2 border rounded transition-all duration-200',
              activeSection === sec.id
                ? 'border-white/40 text-white bg-white/10'
                : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white/80'
            ]"
          >
            {{ sec.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-[#111]">
      <!-- ZAKAT -->
      <section id="zakat" class="py-12 sm:py-16 border-b border-gray-100 dark:border-white/10">
        <div class="container mx-auto px-4 sm:px-6">
          <div v-reveal>
            <p class="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Zakat Watch</p>
            <h2 class="text-xl sm:text-2xl font-medium">Potensi vs Realisasi Zakat Nasional</h2>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Sumber Data: Badan Amil Zakat Nasional (BAZNAS)</p>
            <div class="w-8 h-0.5 bg-gray-900 dark:bg-white mt-3 mb-7"></div>
          </div>

          <!-- Metrics -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8" v-reveal>
            <div v-for="m in zakatMetrics" :key="m.label" class="bg-gray-50 dark:bg-white/5 rounded-lg p-3 sm:p-4">
              <p class="text-[11px] text-gray-400 mb-1.5">{{ m.label }}</p>
              <p class="text-lg sm:text-xl font-medium">{{ m.value }}</p>
              <p class="text-[11px] text-gray-400 mt-1">{{ m.sub }}</p>
              <span v-if="m.badge" :class="['inline-block text-[10px] px-2 py-0.5 rounded-full mt-2', badgeClass(m.badge.type)]">
                {{ m.badge.text }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <!-- Bar breakdown -->
            <div v-reveal-left>
              <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-4">Distribusi per Sektor</p>
              <div v-for="b in zakatBars" :key="b.label" class="mb-3">
                <div class="flex justify-between text-[12px] text-gray-600 dark:text-gray-400 mb-1.5">
                  <span>{{ b.label }}</span><span>{{ b.pct }}%</span>
                </div>
                <div class="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full rounded-full bg-[#eeba4b] transition-all duration-700" :style="{ width: b.pct + '%' }"></div>
                </div>
              </div>
            </div>

            <!-- Chart -->
            <div v-reveal-right>
              <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-4">Tren Penerimaan (Triliun Rp)</p>
              <div class="h-48">
                <Bar :data="zakatBarData" :options="baseOptions" />
              </div>
            </div>
          </div>

          <!-- Quote -->
          <blockquote class="border-l-2 border-[#eeba4b] pl-4 py-3 bg-gray-50 dark:bg-white/5 rounded-r-lg mt-8 ml-0" v-reveal>
            <p class="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed italic">
              "Jurang antara potensi dan realisasi masih sangat lebar. Digitalisasi dan literasi menjadi kunci membuka 90% potensi yang belum tergarap."
            </p>
            <cite class="text-[11px] text-gray-400 mt-2 block not-italic">— Riset CISF, 2024</cite>
          </blockquote>
        </div>
      </section>

      <!-- WAKAF -->
      <section id="wakaf" class="py-12 sm:py-16 border-b border-gray-100 dark:border-white/10">
        <div class="container mx-auto px-4 sm:px-6">
          <div v-reveal>
            <p class="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Wakaf & Infak</p>
            <h2 class="text-xl sm:text-2xl font-medium">Aset Wakaf & Tren Infak Digital</h2>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Sumber Data: Badan Wakaf Indonesia (BWI)</p>
            <div class="w-8 h-0.5 bg-gray-900 dark:bg-white mt-3 mb-7"></div>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8" v-reveal>
            <div v-for="m in wakafMetrics" :key="m.label" class="bg-gray-50 dark:bg-white/5 rounded-lg p-3 sm:p-4">
              <p class="text-[11px] text-gray-400 mb-1.5">{{ m.label }}</p>
              <p class="text-lg sm:text-xl font-medium">{{ m.value }}</p>
              <p class="text-[11px] text-gray-400 mt-1">{{ m.sub }}</p>
              <span v-if="m.badge" :class="['inline-block text-[10px] px-2 py-0.5 rounded-full mt-2', badgeClass(m.badge.type)]">
                {{ m.badge.text }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div v-reveal-left>
              <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-4">Status Lahan Wakaf</p>
              <div v-for="b in wakafBars" :key="b.label" class="mb-3">
                <div class="flex justify-between text-[12px] text-gray-600 dark:text-gray-400 mb-1.5">
                  <span>{{ b.label }}</span><span>{{ b.pct }}%</span>
                </div>
                <div class="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-700" :style="{ width: b.pct + '%', background: b.color }"></div>
                </div>
              </div>
            </div>
            <div v-reveal-right>
              <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-4">Tren Wakaf Uang (Triliun Rp)</p>
              <div class="h-48">
                <Line :data="wakafLineData" :options="baseOptions" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ISLAMIC FINANCE -->
      <section id="finance" class="py-12 sm:py-16 border-b border-gray-100 dark:border-white/10">
        <div class="container mx-auto px-4 sm:px-6">
          <div v-reveal>
            <p class="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Islamic Finance</p>
            <h2 class="text-xl sm:text-2xl font-medium">Perbankan Syariah Indonesia</h2>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Sumber Data: Otoritas Jasa Keuangan (OJK)</p>
            <div class="w-8 h-0.5 bg-gray-900 dark:bg-white mt-3 mb-7"></div>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8" v-reveal>
            <div v-for="m in financeMetrics" :key="m.label" class="bg-gray-50 dark:bg-white/5 rounded-lg p-3 sm:p-4">
              <p class="text-[11px] text-gray-400 mb-1.5">{{ m.label }}</p>
              <p class="text-lg sm:text-xl font-medium">{{ m.value }}</p>
              <p class="text-[11px] text-gray-400 mt-1">{{ m.sub }}</p>
              <span v-if="m.badge" :class="['inline-block text-[10px] px-2 py-0.5 rounded-full mt-2', badgeClass(m.badge.type)]">
                {{ m.badge.text }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div v-reveal-left class="space-y-6">
              <div>
                <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-4">Distribusi Aset Perbankan</p>
                <div v-for="b in financeBars" :key="b.label" class="mb-3">
                  <div class="flex justify-between text-[12px] text-gray-600 dark:text-gray-400 mb-1.5">
                    <span>{{ b.label }}</span><span>{{ b.pct }}%</span>
                  </div>
                  <div class="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-700" :style="{ width: b.pct + '%', background: b.color }"></div>
                  </div>
                </div>
              </div>
              <div>
                <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-4">Komposisi Pembiayaan</p>
                <div v-for="b in pembiayaanBars" :key="b.label" class="mb-3">
                  <div class="flex justify-between text-[12px] text-gray-600 dark:text-gray-400 mb-1.5">
                    <span>{{ b.label }}</span><span>{{ b.pct }}%</span>
                  </div>
                  <div class="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div class="h-full rounded-full bg-[#534AB7] transition-all duration-700" :style="{ width: b.pct + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-reveal-right>
              <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-4">Tren Aset Bank Syariah (Triliun Rp)</p>
              <div class="h-48">
                <Line :data="financeLineData" :options="baseOptions" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- INDEKS UMAT -->
      <section id="indeks" class="py-12 sm:py-16 border-b border-gray-100 dark:border-white/10">
        <div class="container mx-auto px-4 sm:px-6">
          <div v-reveal>
            <p class="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Indeks Umat</p>
            <h2 class="text-xl sm:text-2xl font-medium">Kemiskinan & Literasi Keuangan</h2>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Sumber Data: Bank Indonesia (BI) & Badan Pusat Statistik (BPS)</p>
            <div class="w-8 h-0.5 bg-gray-900 dark:bg-white mt-3 mb-7"></div>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8" v-reveal>
            <div v-for="m in indeksMetrics" :key="m.label" class="bg-gray-50 dark:bg-white/5 rounded-lg p-3 sm:p-4">
              <p class="text-[11px] text-gray-400 mb-1.5">{{ m.label }}</p>
              <p class="text-lg sm:text-xl font-medium">{{ m.value }}</p>
              <p class="text-[11px] text-gray-400 mt-1">{{ m.sub }}</p>
              <span v-if="m.badge" :class="['inline-block text-[10px] px-2 py-0.5 rounded-full mt-2', badgeClass(m.badge.type)]">
                {{ m.badge.text }}
              </span>
            </div>
          </div>

          <div v-reveal class="max-w-lg">
            <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-4">Perbandingan Literasi (%)</p>
            <div v-for="b in indeksBars" :key="b.label" class="mb-3">
              <div class="flex justify-between text-[12px] text-gray-600 dark:text-gray-400 mb-1.5">
                <span>{{ b.label }}</span><span>{{ b.pct }}%</span>
              </div>
              <div class="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700" :style="{ width: b.pct + '%', background: b.color }"></div>
              </div>
            </div>
          </div>

          <blockquote class="border-l-2 border-[#eeba4b] pl-4 py-3 bg-gray-50 dark:bg-white/5 rounded-r-lg mt-8" v-reveal>
            <p class="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed italic">
              "Literasi adalah benteng pertahanan ekonomi umat yang paling rapuh saat ini."
            </p>
          </blockquote>
        </div>
      </section>

      <!-- ARTIKEL TERKAIT -->
      <section class="py-12 sm:py-16">
        <div class="container mx-auto px-4 sm:px-6">
          <div class="flex justify-between items-end mb-7" v-reveal>
            <div>
              <p class="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Artikel</p>
              <h2 class="text-xl sm:text-2xl font-medium">Artikel Terkait</h2>
              <div class="w-8 h-0.5 bg-gray-900 dark:bg-white mt-3"></div>
            </div>
            <NuxtLink to="/article" class="text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5 group">
              Semua
              <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 16 16">
                <path d="M3 8h10M9 4l4 4-4 4"/>
              </svg>
            </NuxtLink>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NuxtLink
              v-for="(article, i) in articles"
              :key="article.id"
              :to="article.url"
              v-reveal
              :style="{ transitionDelay: `${(i as number % 3) * 0.07}s` }"
              class="group border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-white/20 transition-colors"
            >
              <div class="aspect-video bg-gray-100 dark:bg-white/5 overflow-hidden">
                <img v-if="article.image" :src="article.image" :alt="article.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              </div>
              <div class="p-4">
                <p class="text-[10px] tracking-wider uppercase text-[#eeba4b] mb-1.5">{{ article.label }}</p>
                <p class="text-[13px] font-medium leading-snug line-clamp-2 mb-2">{{ article.title }}</p>
                <p class="text-[11px] text-gray-400">{{ article.date }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>

    </div>
  </main>
</template>