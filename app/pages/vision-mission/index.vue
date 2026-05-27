<script setup lang="ts">
const { t, tm, rt } = useI18n()

useSeoMeta({
  title: () => `${t('vision.pageTitle')} — CISF`,
  description: () => t('vision.visionText')
})
</script>

<template>
  <main class="min-h-screen bg-white">

    <!-- Page Header -->
    <section class="bg-gray-900">
      <div class="container mx-auto px-6 pt-36 pb-10">
        <p
          class="mb-2 text-[10px] tracking-[0.2em] uppercase text-gray-400"
          v-reveal-right
        >
          {{ t('vision.breadcrumb') }}
        </p>

        <h1
          class="text-3xl sm:text-4xl font-normal text-white"
          v-reveal-left
        >
          {{ t('vision.pageTitle') }}
        </h1>

        <div class="flex gap-2 mt-4" v-reveal-right>
          <div class="w-10 h-1 bg-[#1a3a6b]"></div>
          <div class="w-28 h-1 bg-[#eeba4b]"></div>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-6 py-16 max-w-4xl">

      <!-- Vision -->
      <section class="mb-16 pb-16 border-b border-gray-200" v-reveal>
        <h2
          class="mb-5 text-5xl sm:text-6xl font-black uppercase text-gray-900 tracking-tight"
        >
          {{ t('vision.visionLabel') }}
        </h2>

        <div class="flex gap-2 mb-8">
          <div class="w-10 h-1 bg-[#1a3a6b]"></div>
          <div class="w-28 h-1 bg-[#eeba4b]"></div>
        </div>

        <p class="max-w-3xl text-[15px] sm:text-base leading-relaxed text-gray-700">
          {{ t('vision.visionText') }}
        </p>
      </section>

      <!-- Mission -->
      <section class="mb-16" v-reveal>
        <h2
          class="mb-5 text-5xl sm:text-6xl font-black uppercase text-gray-900 tracking-tight"
        >
          {{ t('vision.missionLabel') }}
        </h2>

        <div class="flex gap-2 mb-10">
          <div class="w-10 h-1 bg-[#1a3a6b]"></div>
          <div class="w-28 h-1 bg-[#eeba4b]"></div>
        </div>

        <div>
          <div
            v-for="(item, i) in tm('vision.missionItems')"
            :key="i"
            class="flex gap-6 py-7 border-b border-gray-100 last:border-0"
            v-reveal
            :style="{ transitionDelay: `${i * 0.08}s` }"
          >
            <div class="flex-shrink-0 w-10 pt-0.5">
              <span
                class="text-2xl font-black text-gray-300 leading-none select-none tabular-nums"
              >
                {{ String(i + 1).padStart(2, '0') }}
              </span>
            </div>

            <div class="flex-1">
              <p class="text-[14.5px] sm:text-[15px] leading-relaxed text-gray-700">
                <strong class="font-bold text-gray-900">
                  {{ rt(item.title) }}:
                </strong>
                {{ rt(item.desc) }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Core Value section intentionally removed -->

    </div>
  </main>
</template>