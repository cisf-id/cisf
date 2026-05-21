<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('seo.title'),
  description: () => t('seo.description')
})
</script>

<template>
  <main>
    <HeroSlider />
    <Activity />
    <Articles />
    <Publications />
    <Research />
    <Medsos />
    <YoutubeVideos />
  </main>
</template>