<script setup lang="ts">
const footerNavMain = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/2025/05/what-is-cisf.html' },
  { label: 'Statistics', to: '/statistic' },
]

const footerNavResources = [
  { label: 'Research', to: '/research' },
  { label: 'Publication', to: '/publication' },
  { label: 'Article', to: '/article' },
  { label: 'Webinar Series', to: '/webinar-series' },
]

const socials = [
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/cisf.indonesia',
    icon: `<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>`
  },
  {
    label: 'YouTube',
    url: 'https://www.youtube.com/@CenterofIslamicSocialFinance',
    icon: `<path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>`
  },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/company/center-of-islamic-social-finance',
    icon: `<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>`
  },
]
</script>

<template>
  <footer class="bg-[#0a0a0a] border-t border-white/10">
    <div class="container mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <!-- Main grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
        <!-- Col 1: Brand + Kontak -->
        <div class="sm:col-span-2 lg:col-span-1">
          <!-- Logo -->
          <NuxtLink to="/" class="inline-flex items-center gap-2 group mb-6">
            <div class="relative w-9 h-9">
              <img src="/assets/img/logo_cisf.png" class="absolute w-9 h-9 inset-0 transition-opacity duration-300 group-hover:opacity-0" alt="CISF Logo" />
              <img src="/assets/img/shadowlogo_cisf.png" class="absolute w-9 h-9 inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" alt="CISF Logo Hover" />
            </div>
            <div class="-mt-0.5">
              <div class="text-white font-bold tracking-[3px] text-xl group-hover:text-[#eeba4b] transition-colors">CISF</div>
              <div class="text-white/40 text-[9px] tracking-[1.5px] leading-tight group-hover:text-[#eeba4b] transition-colors">
                Center of Islamic Social Finance
              </div>
            </div>
          </NuxtLink>

          <div class="space-y-4 text-[12px] text-white/50">
            <!-- Kantor -->
            <div>
              <p class="text-[10px] tracking-widest uppercase text-white/30 mb-2">Kantor</p>
              <NuxtLink to="https://maps.app.goo.gl/g2SQQfDuyKXGj4sz8" target="_blank" class="hover:text-white transition-colors">
                <p class="leading-relaxed">
                    Semolowaru Elok Blok N-15, Semolowaru,<br>
                    Sukolilo, Surabaya, Jawa Timur<br>
                    Indonesia
                </p>
              </NuxtLink>
            </div>

            <!-- Kontak -->
            <div class="space-y-2">
              <p class="text-[10px] tracking-widest uppercase text-white/30 mb-2">Kontak</p>
              <a href="tel:+6231xxxxxxx" class="flex items-center gap-2 hover:text-white transition-colors">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
                </svg>
                +62 856-4129-6090
              </a>
              <a href="mailto:cs@cisf-id.com" class="flex items-center gap-2 hover:text-white transition-colors">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                </svg>
                cs@cisf-id.com
              </a>
            </div>
          </div>
        </div>

        <!-- Col 2: Navigasi -->
        <div>
          <p class="text-[10px] tracking-widest uppercase text-white/30 mb-5">Navigasi</p>
          <ul class="space-y-3">
            <li v-for="link in footerNavMain" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-[12px] text-white/50 hover:text-white transition-colors duration-200"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Col 3: Resources -->
        <div>
          <p class="text-[10px] tracking-widest uppercase text-white/30 mb-5">Resources</p>
          <ul class="space-y-3">
            <li v-for="link in footerNavResources" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-[12px] text-white/50 hover:text-white transition-colors duration-200"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-white/10 pt-6 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
        <!-- Copyright -->
        <div class="text-[11px] text-white/25 text-center sm:text-left">
          <p>© {{ new Date().getFullYear() }} CISF — Center of Islamic Social Finance.</p>
        </div>

        <!-- Sosmed -->
        <div class="flex items-center gap-3">
          <a
            v-for="social in socials"
            :key="social.label"
            :href="social.url"
            target="_blank"
            rel="noopener"
            :aria-label="social.label"
            class="w-8 h-8 flex items-center justify-center border border-white/10 rounded-lg text-white/30 hover:text-white hover:border-white/30 transition-all duration-200"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" v-html="social.icon"></svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
