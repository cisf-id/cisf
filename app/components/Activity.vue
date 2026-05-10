<script setup lang="ts">
const activities = [
  {
    title: 'Penelitian',
    icon: `<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>`,
    desc: 'Berbagai penelitian kebijakan ekonomi dan keuangan, baik dalam bentuk kerjasama dengan lembaga lain maupun penelitian mandiri.',
  },
  {
    title: 'Wacana Publik',
    icon: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
    desc: 'Aktif terlibat dalam diskursus kebijakan publik di berbagai media massa melalui artikel, opini/wawancara, talkshow, press conference, social media dan berbagai sarana komunikasi lainnya.',
  },
  {
    title: 'Publikasi',
    icon: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="11" y2="17"/>`,
    desc: 'Hasil-hasil analisis kebijakan dalam berbagai format dan beragam kegiatan dengan harapan dapat memberi pencerahan kepada masyarakat secara luas.',
  },
  {
    title: 'Pelatihan',
    icon: `<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>`,
    desc: 'Menyelenggarakan berbagai bentuk pelatihan analisis kebijakan publik, baik untuk mahasiswa, Lembaga Swadaya Masyarakat, wartawan media massa, dan umum.',
  },
]
</script>

<template>
  <section class="py-14 sm:py-16 lg:py-20 bg-white dark:bg-[#111]">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="text-center" v-reveal>
        <p class="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Activity</p>
        <h2 class="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white">Aktivitas</h2>
        <div class="w-8 h-0.5 bg-gray-900 dark:bg-white mt-3 mb-6 sm:mb-7 mx-auto"></div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mx-auto">
        <div
          v-for="(item, i) in activities"
          :key="item.title"
          v-reveal
          :style="{ transitionDelay: `${i as number * 0.15}s` }"
          class="flex flex-col items-center text-center"
        >
          <!-- Icon circle -->
          <div class="w-16 h-16 rounded-full border border-[#b0bec5] flex items-center justify-center mb-5 shrink-0">
            <svg
              class="w-7 h-7 text-[#90a4ae]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              v-html="item.icon"
            />
          </div>

          <h3 class="text-base font-medium text-gray-900 dark:text-white mb-3">
            {{ item.title }}
          </h3>

          <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {{ item.desc }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
