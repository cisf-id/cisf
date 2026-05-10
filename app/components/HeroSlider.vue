<script setup>
// Data Slide (State)
const slides = [
  { 
    title: "Center of Islamic Social Finance", 
    sub: "Advancing social impact through research, mentoring, and community-driven projects.",
    image: "/assets/img/slide1.jpg"
  },
  { 
    title: "Research & Impact", 
    sub: "30+ groundbreaking studies on Waqf, Zakat, and the Halal Ecosystem published globally.",
    image: "/assets/img/slide2.jpg"
  },
  { 
    title: "Community Empowerment", 
    sub: "Driving economic equity through MSME mentoring, halal certification, and financial training.",
    image: "/assets/img/slide3.jpg"
  },
];

const current = ref(0);
const progressActive = ref(true);
let timer = null;

// Logika Navigasi
const nextSlide = () => {
  current.value = (current.value + 1) % slides.length;
  resetProgress();
};

const prevSlide = () => {
  current.value = (current.value - 1 + slides.length) % slides.length;
  resetProgress();
};

const goTo = (idx) => {
  current.value = idx;
  resetProgress();
};

// Auto-play & Progress Bar Logic
const resetProgress = () => {
  progressActive.value = false;
  nextTick(() => {
    progressActive.value = true;
  });
  
  if (timer) clearInterval(timer);
  startTimer();
};

const startTimer = () => {
  timer = setInterval(nextSlide, 4000);
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <section class="relative w-full h-screen overflow-hidden">
    <div 
      v-for="(slide, index) in slides" 
      :key="index"
      class="absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center"
      :class="[index === current ? 'opacity-100 z-10' : 'opacity-0 z-0']"
      :style="{ backgroundImage: `url(${slide.image})` }"
    >
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/50"></div>
    </div>

    <div class="absolute inset-0 bg-black/15 z-10"></div>

    <div class="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-16 lg:px-6 pointer-events-none">
      <Transition name="hero-text" mode="out-in">
        <div :key="current">
          <h1 class="text-xl md:text-5xl lg:text-6xl font-bold tracking-widest text-white drop-shadow-2xl mb-3 uppercase">
            {{ slides[current].title }}
          </h1>
          <p class="text-[10px] lg:text-lg tracking-widest text-white/80">
            {{ slides[current].sub }}
          </p>
        </div>
      </Transition>
    </div>

    <button @click="prevSlide" class="cursor-pointer absolute left-5 top-1/2 -translate-y-1/2 z-30 p-4 text-white rounded-full">
      <span class="sm:text-xl lg:text-4xl lg:hover:text-5xl hover:text-2xl transition-all duration-100"><i class="fa-solid fa-angle-left"></i></span>
    </button>
    <button @click="nextSlide" class="cursor-pointer absolute right-5 top-1/2 -translate-y-1/2 z-30 p-4 text-white rounded-full">
      <span class="sm:text-xl lg:text-4xl lg:hover:text-5xl hover:text-2xl transition-all duration-100"><i class="fa-solid fa-angle-right"></i></span>
    </button>

    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2 items-center">
      <button 
        v-for="(_, i) in slides" 
        :key="i"
        @click="goTo(i)"
        class="h-1.5 rounded-full transition-all duration-300"
        :class="[i === current ? 'w-8 bg-white' : 'w-2 bg-white/40']"
      ></button>
    </div>

    <div class="absolute bottom-0 left-0 h-[3px] bg-white/60 z-30 transition-none"
      :class="{ 'animate-progress': progressActive }"
    ></div>
  </section>
</template>

<style scoped>
/* Animasi Teks */
.hero-text-enter-active, .hero-text-leave-active {
  transition: all 0.6s ease;
}
.hero-text-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.hero-text-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Animasi Progress Bar */
.animate-progress {
  animation: progress 4s linear forwards;
}

@keyframes progress {
  from { width: 0%; }
  to { width: 100%; }
}
</style>