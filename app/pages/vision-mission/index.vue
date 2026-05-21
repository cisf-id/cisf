<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => `${t('vision.pageTitle')} — CISF`,
  description: () => t('vision.visionText')
})
</script>

<template>
  <main class="min-h-screen bg-white">

    <!-- Page Header -->
    <div class="bg-gray-900 border-b border-gray-800">
      <div class="container mx-auto px-6 pt-36 pb-10">
        <p class="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2" v-reveal-right>
          {{ $t('vision.breadcrumb') }}
        </p>
        <h1 class="text-3xl sm:text-4xl font-normal text-white" v-reveal-left>
          {{ $t('vision.pageTitle') }}
        </h1>
        <div class="flex gap-2 mt-4" v-reveal-right>
          <div class="w-10 h-1 bg-[#1a3a6b]"></div>
          <div class="w-28 h-1 bg-[#eeba4b]"></div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-6 py-16 max-w-4xl">

      <!-- ── VISION ── -->
      <section class="mb-16 pb-16 border-b border-gray-200" v-reveal>
        <h2 class="text-5xl sm:text-6xl font-black uppercase text-gray-900 tracking-tight mb-4">
          {{ $t('vision.visionLabel') }}
        </h2>

        <!-- Double underline bar -->
        <div class="flex gap-2 mb-8">
          <div class="w-10 h-1 bg-[#1a3a6b]"></div>
          <div class="w-28 h-1 bg-[#eeba4b]"></div>
        </div>

        <p class="text-[15px] sm:text-base leading-relaxed text-gray-700 max-w-3xl">
          {{ $t('vision.visionText') }}
        </p>
      </section>

      <!-- ── MISSION ── -->
      <section v-reveal>
        <h2 class="text-5xl sm:text-6xl font-black uppercase text-gray-900 tracking-tight mb-4">
          {{ $t('vision.missionLabel') }}
        </h2>

        <!-- Double underline bar -->
        <div class="flex gap-2 mb-10">
          <div class="w-10 h-1 bg-[#1a3a6b]"></div>
          <div class="w-28 h-1 bg-[#eeba4b]"></div>
        </div>

        <!-- Mission items -->
        <div class="space-y-8">
          <div
            v-for="(item, i) in $tm('vision.missionItems')"
            :key="i"
            class="flex gap-6 pb-8 border-b border-gray-100 last:border-0"
            v-reveal
            :style="{ transitionDelay: `${i * 0.08}s` }"
          >
            <!-- Number -->
            <div class="flex-shrink-0 w-12">
              <span class="text-3xl font-black text-gray-200 leading-none select-none">
                {{ String(i + 1).padStart(2, '0') }}
              </span>
            </div>

            <!-- Content -->
            <div class="flex-1 pt-1">
              <p class="text-[14.5px] sm:text-[15px] leading-relaxed text-gray-700">
                <strong class="text-gray-900 font-bold">{{ $rt(item.title) }}:</strong>
                {{ $rt(item.desc) }}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  </main>
</template>
