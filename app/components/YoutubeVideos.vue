<script setup>  
const activeVideoId = ref('lYOXNVXM9gk')

const videos = [
  { id: 'lYOXNVXM9gk', title: 'PODCAST SPECIAL RAMADHAN BERSAMA MITRA ACCESS (FAIZA AULIA AFIFAH) | EPISODE #2', duration: '17:45' },
  { id: '5uk-5QY0jEo', title: 'PODCAST CISF SPECIAL RAMADHAN BERSAMA USTADZ DR. DIAN BERKAH., S.H.I., M.H.I | EPISODE #2', duration: '26:40' },
  { id: 'T6uLNdJ0b5U', title: 'PODCAST CISF SPESIAL RAMADHAN PART 2 BERSAMA ARVA ATHALLAH SUSANTO M.SEI DAN MUHAMMAD RAUF ALFARIZI', duration: '23:25' },
  { id: 'QvATQO0fNUw', title: 'PODCAST CISF SPESIAL RAMADHAN 🌙', duration: '25:55' },
  { id: '3-8pPAVxX7s', title: 'RESEARCH COACHING (METODE SLR) #3', duration: '58:14' },
  // { id: 'rAtJgF1v4q8', title: 'RESEARCH COACHING (MENYUSUN INTRODUCTION ARTIKEL ILMIAH YANG TEMBUS SCOPUS) #2 / 17 JANUARI 2026', duration: '1:05:22' },
]
</script>

<template>
    <!-- YouTube -->
    <section class="py-16 bg-[#ffffff] dark:bg-white/3">
      <div class="container mx-auto sm:px-4">
        <div class="flex justify-between items-end" v-reveal>
          <div>
            <p class="text-[10px] tracking-widest uppercase text-gray-400 mb-1">Video</p>
            <h2 class="text-2xl font-medium">Kanal YouTube</h2>
            <div class="w-8 h-0.5 bg-gray-900 dark:bg-white mt-3 mb-7"></div>
          </div>
          <a href="https://www.youtube.com/@CenterofIslamicSocialFinance" target="_blank" class="text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-7 flex items-center gap-1.5 group">
            Tonton semua
            <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 16 16">
              <path d="M3 8h10M9 4l4 4-4 4"/>
            </svg>
          </a>
        </div>

        <div class="lg:grid lg:grid-cols-2 gap-8 items-center sm:flex sm:flex-col">
          <!-- Main embed -->
          <div v-reveal-left class="rounded-xl overflow-hidden aspect-video bg-black w-full">
            <iframe
              :src="`https://www.youtube.com/embed/${activeVideoId}?rel=0`"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>

          <!-- Playlist -->
          <div v-reveal-right class="flex flex-col">
            <div
              v-for="(vid, i) in videos"
              :key="i"
              @click="activeVideoId = vid.id"
              class="grid grid-cols-[80px_1fr] gap-3 py-3 border-b border-gray-200 dark:border-white/10 last:border-0 cursor-pointer group"
            >
              <div class="aspect-video bg-black rounded overflow-hidden flex items-center justify-center">
                <img :src="`https://img.youtube.com/vi/${vid.id}/mqdefault.jpg`" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <p class="text-[12px] font-medium leading-snug mb-1" :class="activeVideoId === vid.id ? 'text-blue-600 dark:text-blue-400' : ''">
                  {{ vid.title }}
                </p>
                <p class="text-[11px] text-gray-400">{{ vid.duration }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
</template>

<style scoped></style>