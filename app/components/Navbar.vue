<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const isHomePage = computed(() => route.path === '/')
const isScrolled = ref(false)
const menuOpen = ref(false)
const searchQuery = ref('')
const searchOpen = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)
const currentPath = computed(() => route.path)
const { t, locale, setLocale } = useI18n()

const toggleLanguage = () => {
  setLocale(locale.value === 'en' ? 'id' : 'en')
}

const isActive = (link: any) => {
  if (link.to === currentPath.value) return true
  if (link.dropdown) {
    return link.dropdown.some((sub: { to: string }) => sub.to === currentPath.value)
  }
  return false
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

watch(() => route.path, () => {
  menuOpen.value = false
  // searchOpen.value = false
})

watch(menuOpen, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

watch(searchOpen, async (val) => {
  if (val) {
    await nextTick()
    searchInput.value?.focus()
  }
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})

const submitSearch = () => {
  const q = searchQuery.value.trim()
  if (!q) return

  router.push({
    path: '/search',
    query: { q }
  })

  searchQuery.value = ''
  searchOpen.value = false
  menuOpen.value = false
}

const navLinks = computed(() => [
  { label: t('nav.home'), to: '/' },
  { label: t('nav.resources'), to: '', dropdown: [
    { label: t('nav.research'), to: '/research' },
    { label: t('nav.publication'), to: '/publication' },
    { label: t('nav.article'), to: '/article' },
    { label: t('nav.webinarSeries'), to: '/webinar-series' },
  ]},
  { label: t('nav.aboutUs'), to: '', dropdown: [
    { label: t('nav.visionMission'), to: '/vision-mission' },
    { label: 'What is CISF?', to: '/about-cisf' },
  ]},
  { label: t('nav.statistics'), to: '/statistic' },
])

const navLinkMobiles = computed(() => [
  { label: t('nav.home'), to: '/' },
  { label: t('nav.research'), to: '/research' },
  { label: t('nav.publication'), to: '/publication' },
  { label: t('nav.article'), to: '/article' },
  { label: t('nav.webinarSeries'), to: '/webinar-series' },
  { label: t('nav.visionMission'), to: '/vision-mission' },
  { label: t('nav.aboutUs'), to: '/about-cisf.html' },
  { label: t('nav.statistics'), to: '/statistic' },
])

const navBg = computed(() => {
  if (isScrolled.value || !isHomePage.value || menuOpen.value) {
    return 'bg-black/80 backdrop-blur-lg py-2'
  }
  return 'bg-transparent py-5'
})

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
  <nav :class="['fixed top-0 left-0 w-full z-[100] transition-all duration-300', navBg]">
    <div class="container mx-auto sm:px-4 flex justify-between items-center h-16 sm:h-18 lg:h-20">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 sm:gap-3 group shrink-0">
        <div class="relative w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12">
          <img src="/assets/img/logo_cisf.png" class="absolute inset-0 w-full transition-opacity duration-300 group-hover:opacity-0" alt="CISF Logo" />
          <img src="/assets/img/shadowlogo_cisf.png" class="absolute inset-0 w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" alt="CISF Logo Hover" />
        </div>
        <div class="flex flex-col sm:mt-[-3.5px]">
          <span class="text-white font-bold tracking-[3px] text-lg lg:text-xl xl:text-3xl transition-colors duration-300 group-hover:text-[#eeba4b]">CISF</span>
          <span class="hidden sm:block text-white text-xs sm:text-[10px] xl:text-[11px] font-light tracking-[2px] w-70 leading-tight transition-colors duration-300 group-hover:text-[#eeba4b]">
            Center of Islamic Social Finance
          </span>
        </div>
      </NuxtLink>

      <!-- Desktop nav -->
      <div class="hidden lg:flex items-center gap-6 xl:gap-8 text-white text-xs lg:text-sm font-medium tracking-[2px] uppercase">
        <div v-for="link in navLinks" :key="link.label" class="relative group">
          <template v-if="link.dropdown">
            <button class="flex items-center gap-1 py-1.5 overflow-hidden group relative outline-none">
              <span :class="[
                'relative z-10 transition-colors duration-300 uppercase',
                isActive(link) ? 'text-[#eeba4b]' : 'text-white group-hover:text-[#eeba4b]'
              ]">
                {{ link.label }}
              </span>

              <span :class="[
                'rounded-full absolute left-1/2 -translate-x-1/2 w-full h-7 bg-[#eeba4b] blur-[5px] transition-all duration-300 ease-out',
                isActive(link) ? 'opacity-60 -bottom-7' : 'opacity-0 -bottom-8 group-hover:opacity-60 group-hover:-bottom-7'
              ]"></span>

              <svg :class="['w-3 h-3 transition-transform duration-300 group-hover:rotate-180', isActive(link) ? 'text-[#eeba4b]' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div class="absolute left-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div class="bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg py-2 shadow-2xl">
                <NuxtLink
                  v-for="sub in link.dropdown"
                  :key="sub.to"
                  :to="sub.to"
                  :class="[
                    'block px-4 py-2 text-[11px] transition-colors duration-200',
                    currentPath === sub.to ? 'bg-[#eeba4b] text-black' : 'text-white hover:bg-[#eeba4b] hover:text-black'
                  ]"
                >
                  {{ sub.label }}
                </NuxtLink>
              </div>
            </div>
          </template>

          <NuxtLink
            v-else
            :to="link.to"
            class="relative py-1.5 overflow-hidden block group"
          >
            <span :class="[
              'relative z-10 transition-colors duration-300',
              currentPath === link.to ? 'text-[#eeba4b]' : 'text-white group-hover:text-[#eeba4b]'
            ]">
              {{ link.label }}
            </span>
            
            <span :class="[
              'rounded-full absolute left-1/2 -translate-x-1/2 w-full h-7 bg-[#eeba4b] blur-[5px] transition-all duration-300 ease-out',
              currentPath === link.to ? 'opacity-60 -bottom-7' : 'opacity-0 -bottom-8 group-hover:opacity-60 group-hover:-bottom-7'
            ]"></span>
          </NuxtLink>
        </div>

        <!-- Search bar desktop -->
        <div class="relative flex items-center">
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Cari di website..."
            class="bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs px-3 py-[9px] rounded-l-full focus:outline-none focus:border-white/40 w-44 xl:w-56"
            @keyup.enter="submitSearch"
          />

          <button
            @click="submitSearch"
            class="flex items-center justify-center w-9 h-9 border border-white/20 text-white hover:bg-white/30 transition-all duration-200 bg-white/10 rounded-r-full border-l-0"
            aria-label="Search"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
            </svg>
          </button>
        </div>

        <!-- Language Switcher Desktop -->
        <button
          @click="toggleLanguage"
          class="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-colors duration-200"
        >
          <span :class="['text-xs font-bold transition-colors duration-200', locale === 'en' ? 'text-[#eeba4b]' : 'text-white/60']">EN</span>
          <span class="text-white/30 text-xs">/</span>
          <span :class="['text-xs font-bold transition-colors duration-200', locale === 'id' ? 'text-[#eeba4b]' : 'text-white/60']">ID</span>
        </button>
      </div>

      <!-- Hamburger -->
      <button
        class="lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 z-[110]"
        @click="menuOpen = !menuOpen"
        aria-label="Toggle menu"
      >
        <span :class="['block w-6 h-0.5 bg-white transition-all duration-300', menuOpen ? 'rotate-45 translate-y-2' : '']"></span>
        <span :class="['block w-6 h-0.5 bg-white transition-all duration-300', menuOpen ? 'opacity-0' : '']"></span>
        <span :class="['block w-6 h-0.5 bg-white transition-all duration-300', menuOpen ? '-rotate-45 -translate-y-2' : '']"></span>
      </button>
    </div>

    <!-- Mobile drawer -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="menuOpen" class="lg:hidden bg-black/95 backdrop-blur-lg border-t border-white/10">
        <div class="container mx-auto px-4 py-6 flex flex-col gap-1">
          <!-- Search bar mobile -->
          <div class="flex gap-2 mb-2 pb-4 border-b border-white/10">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari di website..."
              class="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm px-4 py-2.5 rounded-full focus:outline-none focus:border-white/40"
              @keyup.enter="submitSearch"
            />
            <button
              @click="submitSearch"
              class="flex items-center justify-center w-10 h-10 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition shrink-0"
              aria-label="Search"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
              </svg>
            </button>
          </div>
          <NuxtLink
            v-for="link in navLinkMobiles"
            :key="link.to"
            :to="link.to"
            class="text-white/80 hover:text-[#eeba4b] text-sm font-medium tracking-[2px] uppercase py-3.5 border-b border-white/10 last:border-0 transition-colors duration-200"
          >
            {{ link.label }}
          </NuxtLink>

          <!-- Language Switcher Mobile -->
          <div class="py-3.5 border-b border-white/10 flex justify-between items-center">
            <span class="text-white/80 text-sm font-medium tracking-[2px] uppercase">Language</span>
            <button
              @click="toggleLanguage"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/5"
            >
              <span :class="['text-xs font-bold', locale === 'en' ? 'text-[#eeba4b]' : 'text-white/60']">EN</span>
              <span class="text-white/30 text-xs">/</span>
              <span :class="['text-xs font-bold', locale === 'id' ? 'text-[#eeba4b]' : 'text-white/60']">ID</span>
            </button>
          </div>

          <!-- Sosmed -->
          <div class="flex justify-between items-center gap-3 py-3.5 border-b border-white/10 last:border-0 transition-colors duration-200">
            <a
              v-for="social in socials"
              :key="social.label"
              :href="social.url"
              target="_blank"
              rel="noopener"
              :aria-label="social.label"
              class="w-8 h-8 flex items-center justify-center border border-white/10 rounded-lg text-white/50 hover:text-white hover:border-white/30 transition-all duration-200 text-sm font-medium tracking-[2px] uppercase"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" v-html="social.icon"></svg>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>