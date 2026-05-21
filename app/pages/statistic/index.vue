<script setup lang="ts">
import { Bar, Line, Pie } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, LineElement, PointElement, ArcElement,
  Filler, Tooltip, Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Filler, Tooltip, Legend)

const { t, locale } = useI18n()

useSeoMeta({
  title: () => `${t('page.statistics')} — CISF`,
  description: () => locale.value === 'en' ? 'Islamic social finance data in an interactive visual format' : 'Data keuangan sosial Islam dalam format visual interaktif'
})

const activeSection = ref('zakat')
const sections = computed(() => locale.value === 'en' ? [
  { id: 'zakat', label: 'Zakat Watch' },
  { id: 'wakaf', label: 'Waqf & Infaq' },
  { id: 'finance', label: 'Islamic Finance' },
  { id: 'indeks', label: 'Ummah Index' },
] : [
  { id: 'zakat', label: 'Zakat Watch' },
  { id: 'wakaf', label: 'Wakaf & Infak' },
  { id: 'finance', label: 'Islamic Finance' },
  { id: 'indeks', label: 'Indeks Umat' },
])

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

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { 
      position: 'bottom' as const,
      labels: { font: { size: 11 }, padding: 15, usePointStyle: true }
    } 
  },
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
const zakatMetrics = computed(() => locale.value === 'en' ? [
  { label: 'Zakat Potential', value: 'Rp 327 T', sub: 'BAZNAS Estimate 2024', badge: null },
  { label: 'Collected Realization', value: 'Rp 33 T', sub: '10% of potential', badge: { text: '90% Gap', type: 'warn' } },
  { label: 'Active Muzakki', value: '4.2 M', sub: 'out of 93M obliged', badge: { text: 'Low', type: 'down' } },
  { label: 'YoY Growth', value: '+18.4%', sub: 'Revenue 2023–2024', badge: { text: 'Up', type: 'up' } },
] : [
  { label: 'Potensi Zakat', value: 'Rp 327 T', sub: 'Estimasi BAZNAS 2024', badge: null },
  { label: 'Realisasi Terkumpul', value: 'Rp 33 T', sub: '10% dari potensi', badge: { text: 'Gap 90%', type: 'warn' } },
  { label: 'Muzakki Aktif', value: '4.2 Jt', sub: 'dari 93 jt wajib zakat', badge: { text: 'Rendah', type: 'down' } },
  { label: 'Pertumbuhan YoY', value: '+18.4%', sub: 'Penerimaan 2023–2024', badge: { text: 'Naik', type: 'up' } },
])
const zakatPieData = computed(() => ({
  labels: locale.value === 'en' 
    ? ['Income', 'Trade', 'Fitrah', 'Agriculture', 'Others'] 
    : ['Penghasilan', 'Perdagangan', 'Fitrah', 'Pertanian', 'Lainnya'],
  datasets: [{
    data: [54, 22, 14, 6, 4],
    backgroundColor: ['#eeba4b', '#f5d688', '#d19824', '#f8e6b3', '#a17215'],
    borderWidth: 0,
  }]
}))

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
const wakafMetrics = computed(() => locale.value === 'en' ? [
  { label: 'Land Waqf Assets', value: '420k ha', sub: 'Spread across 500k locations', badge: null },
  { label: 'Collected Cash Waqf', value: 'Rp 1.4 T', sub: '▲ 15% YoY', badge: { text: 'Productive', type: 'up' } },
  { label: 'Digital Infaq/Month', value: 'Rp 89 B', sub: 'Online platforms', badge: { text: '▲ 23%', type: 'up' } },
  { label: 'Land Productivity', value: '56%', sub: '44% need incubation', badge: { text: 'Needs Push', type: 'warn' } },
] : [
  { label: 'Aset Wakaf Tanah', value: '420 rb ha', sub: 'Tersebar 500 rb lokasi', badge: null },
  { label: 'Wakaf Uang Terkumpul', value: 'Rp 1.4 T', sub: '▲ 15% YoY', badge: { text: 'Produktif', type: 'up' } },
  { label: 'Infak Digital/Bulan', value: 'Rp 89 M', sub: 'Platform online', badge: { text: '▲ 23%', type: 'up' } },
  { label: 'Produktivitas Lahan', value: '56%', sub: '44% butuh inkubasi', badge: { text: 'Perlu Dorong', type: 'warn' } },
])
const wakafPieData = computed(() => ({
  labels: locale.value === 'en' 
    ? ['Productive Land', 'Non-Productive', 'In Process'] 
    : ['Lahan Produktif', 'Non-Produktif', 'Dalam Proses'],
  datasets: [{
    data: [56, 30, 14],
    backgroundColor: ['#639922', '#E24B4A', '#BA7517'],
    borderWidth: 0,
  }]
}))

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
const financeMetrics = computed(() => locale.value === 'en' ? [
  { label: 'Market Share', value: '7.03%', sub: 'Stagnant below 10%', badge: { text: 'Stagnant', type: 'warn' } },
  { label: 'Total Assets', value: 'Rp 868 T', sub: '▲ 9.2% YoY', badge: { text: 'Growing', type: 'up' } },
  { label: 'Islamic Banks', value: '13 BUS', sub: '+ 20 UUS active', badge: null },
  { label: 'Murabahah Financing', value: '48.3%', sub: 'Contract dominance', badge: null },
] : [
  { label: 'Market Share', value: '7.03%', sub: 'Stagnan di bawah 10%', badge: { text: 'Stagnan', type: 'warn' } },
  { label: 'Total Aset', value: 'Rp 868 T', sub: '▲ 9.2% YoY', badge: { text: 'Tumbuh', type: 'up' } },
  { label: 'Jumlah Bank Syariah', value: '13 BUS', sub: '+ 20 UUS aktif', badge: null },
  { label: 'Pembiayaan Murabahah', value: '48.3%', sub: 'Dominasi akad', badge: null },
])
const financeAsetPieData = computed(() => ({
  labels: locale.value === 'en' ? ['Conventional', 'Islamic'] : ['Konvensional', 'Syariah'],
  datasets: [{
    data: [93, 7],
    backgroundColor: ['#888780', '#eeba4b'],
    borderWidth: 0,
  }]
}))
const pembiayaanPieData = computed(() => ({
  labels: locale.value === 'en' ? ['Murabahah', 'Musyarakah', 'Mudharabah', 'Others'] : ['Murabahah', 'Musyarakah', 'Mudharabah', 'Lainnya'],
  datasets: [{
    data: [48, 29, 13, 10],
    backgroundColor: ['#534AB7', '#7b74cc', '#3b3484', '#a19de0'],
    borderWidth: 0,
  }]
}))

// Indeks Umat
const indeksMetrics = computed(() => locale.value === 'en' ? [
  { label: 'Poverty Rate', value: '9.5%', sub: 'Muslim Population', badge: { text: 'Critical', type: 'down' } },
  { label: 'Islamic Fin. Literacy', value: '9.1%', sub: 'Very low', badge: { text: 'Low', type: 'down' } },
  { label: 'General Fin. Literacy', value: '49.6%', sub: 'National', badge: { text: 'Medium', type: 'warn' } },
  { label: 'Pesantren HDI', value: '67.4', sub: 'Below average', badge: { text: 'Attention', type: 'warn' } },
] : [
  { label: 'Tingkat Kemiskinan', value: '9.5%', sub: 'Penduduk Muslim', badge: { text: 'Kritis', type: 'down' } },
  { label: 'Literasi Keuangan Syariah', value: '9.1%', sub: 'Sangat rendah', badge: { text: 'Rendah', type: 'down' } },
  { label: 'Literasi Keuangan Umum', value: '49.6%', sub: 'Nasional', badge: { text: 'Sedang', type: 'warn' } },
  { label: 'IPM Basis Pesantren', value: '67.4', sub: 'Di bawah rata-rata', badge: { text: 'Perhatian', type: 'warn' } },
])
const indeksPieData = computed(() => ({
  labels: locale.value === 'en' ? ['Islamic Literacy', 'General Literacy', 'Target 2030'] : ['Literasi Syariah', 'Literasi Umum', 'Target 2030'],
  datasets: [{
    data: [9.1, 49.6, 75],
    backgroundColor: ['#E24B4A', '#BA7517', '#639922'],
    borderWidth: 0,
  }]
}))

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
    title: parseLocaleText(p.title, locale.value),
    label: parseLocaleText(p.labels?.[0] ?? 'Riset', locale.value),
    date: new Date(p.published).toLocaleDateString(locale.value === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
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
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-medium text-white mb-3">{{ $t('page.statistics') }}</h1>
          <p class="text-sm text-white/50 max-w-lg leading-relaxed">
            {{ locale === 'en' ? 'Data and research findings of CISF in a visual format — zakat, waqf, Islamic banking, and ummah welfare index.' : 'Data dan temuan riset CISF dalam format visual — zakat, wakaf, perbankan syariah, dan indeks kesejahteraan umat.' }}
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
            <h2 class="text-xl sm:text-2xl font-medium">{{ locale === 'en' ? 'Potential vs Realization of National Zakat' : 'Potensi vs Realisasi Zakat Nasional' }}</h2>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{{ locale === 'en' ? 'Data Source:' : 'Sumber Data:' }} Badan Amil Zakat Nasional (BAZNAS)</p>
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
            <!-- Pie breakdown -->
            <div v-reveal-left>
              <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-4">{{ locale === 'en' ? 'Distribution by Sector' : 'Distribusi per Sektor' }}</p>
              <div class="h-48 md:h-56">
                <Pie :data="zakatPieData" :options="pieOptions" />
              </div>
            </div>

            <!-- Chart -->
            <div v-reveal-right>
              <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-4">{{ locale === 'en' ? 'Revenue Trend (Trillion Rp)' : 'Tren Penerimaan (Triliun Rp)' }}</p>
              <div class="h-48">
                <Bar :data="zakatBarData" :options="baseOptions" />
              </div>
            </div>
          </div>

          <!-- Quote -->
          <blockquote class="border-l-2 border-[#eeba4b] pl-4 py-3 bg-gray-50 dark:bg-white/5 rounded-r-lg mt-8 ml-0" v-reveal>
            <p class="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed italic">
              {{ locale === 'en' ? '"The gap between potential and realization is still very wide. Digitalization and literacy are the keys to unlocking the 90% untapped potential."' : '"Jurang antara potensi dan realisasi masih sangat lebar. Digitalisasi dan literasi menjadi kunci membuka 90% potensi yang belum tergarap."' }}
            </p>
            <cite class="text-[11px] text-gray-400 mt-2 block not-italic font-medium">— {{ locale === 'en' ? 'Data Source:' : 'Sumber Data:' }} BAZNAS (Badan Amil Zakat Nasional) & {{ locale === 'en' ? 'CISF Research' : 'Riset CISF' }} 2024</cite>
          </blockquote>
        </div>
      </section>

      <!-- WAKAF -->
      <section id="wakaf" class="py-12 sm:py-16 border-b border-gray-100 dark:border-white/10">
        <div class="container mx-auto px-4 sm:px-6">
          <div v-reveal>
            <p class="text-[10px] tracking-widest uppercase text-gray-400 mb-1">{{ locale === 'en' ? 'Waqf & Infaq' : 'Wakaf & Infak' }}</p>
            <h2 class="text-xl sm:text-2xl font-medium">{{ locale === 'en' ? 'Waqf Assets & Digital Infaq Trend' : 'Aset Wakaf & Tren Infak Digital' }}</h2>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{{ locale === 'en' ? 'Data Source:' : 'Sumber Data:' }} Badan Wakaf Indonesia (BWI)</p>
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
              <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-4">{{ locale === 'en' ? 'Waqf Land Status' : 'Status Lahan Wakaf' }}</p>
              <div class="h-48 md:h-56">
                <Pie :data="wakafPieData" :options="pieOptions" />
              </div>
            </div>
            <div v-reveal-right>
              <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-4">{{ locale === 'en' ? 'Cash Waqf Trend (Trillion Rp)' : 'Tren Wakaf Uang (Triliun Rp)' }}</p>
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
            <h2 class="text-xl sm:text-2xl font-medium">{{ locale === 'en' ? 'Indonesian Islamic Banking' : 'Perbankan Syariah Indonesia' }}</h2>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{{ locale === 'en' ? 'Data Source:' : 'Sumber Data:' }} Otoritas Jasa Keuangan (OJK)</p>
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
                <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-4">{{ locale === 'en' ? 'Banking Assets Distribution' : 'Distribusi Aset Perbankan' }}</p>
                <div class="h-40 md:h-48">
                  <Pie :data="financeAsetPieData" :options="pieOptions" />
                </div>
              </div>
              <div>
                <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-4">{{ locale === 'en' ? 'Financing Composition' : 'Komposisi Pembiayaan' }}</p>
                <div class="h-40 md:h-48">
                  <Pie :data="pembiayaanPieData" :options="pieOptions" />
                </div>
              </div>
            </div>
            <div v-reveal-right>
              <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-4">{{ locale === 'en' ? 'Islamic Bank Assets Trend (Trillion Rp)' : 'Tren Aset Bank Syariah (Triliun Rp)' }}</p>
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
            <p class="text-[10px] tracking-widest uppercase text-gray-400 mb-1">{{ locale === 'en' ? 'Ummah Index' : 'Indeks Umat' }}</p>
            <h2 class="text-xl sm:text-2xl font-medium">{{ locale === 'en' ? 'Poverty & Financial Literacy' : 'Kemiskinan & Literasi Keuangan' }}</h2>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{{ locale === 'en' ? 'Data Source:' : 'Sumber Data:' }} Bank Indonesia (BI) & Badan Pusat Statistik (BPS)</p>
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
            <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-4">{{ locale === 'en' ? 'Literacy Comparison (%)' : 'Perbandingan Literasi (%)' }}</p>
            <div class="h-40 md:h-48">
              <Pie :data="indeksPieData" :options="pieOptions" />
            </div>
          </div>

          <blockquote class="border-l-2 border-[#eeba4b] pl-4 py-3 bg-gray-50 dark:bg-white/5 rounded-r-lg mt-8" v-reveal>
            <p class="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed italic">
              {{ locale === 'en' ? '"Literacy is the most fragile economic defense of the ummah today."' : '"Literasi adalah benteng pertahanan ekonomi umat yang paling rapuh saat ini."' }}
            </p>
            <cite class="text-[11px] text-gray-400 mt-2 block not-italic font-medium">— {{ locale === 'en' ? 'Data Source:' : 'Sumber Data:' }} BPS & Survei Literasi Keuangan OJK 2024</cite>
          </blockquote>
        </div>
      </section>

      <!-- ARTIKEL TERKAIT -->
      <section class="py-12 sm:py-16">
        <div class="container mx-auto px-4 sm:px-6">
          <div class="flex justify-between items-end mb-7" v-reveal>
            <div>
              <p class="text-[10px] tracking-widest uppercase text-gray-400 mb-1">{{ $t('article.label') }}</p>
              <h2 class="text-xl sm:text-2xl font-medium">{{ locale === 'en' ? 'Related Articles' : 'Artikel Terkait' }}</h2>
              <div class="w-8 h-0.5 bg-gray-900 dark:bg-white mt-3"></div>
            </div>
            <NuxtLink to="/article" class="text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5 group">
              {{ $t('article.allMobile') }}
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