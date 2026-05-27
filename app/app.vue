<script setup>
const nuxtApp = useNuxtApp()
const loadingStore = useLoadingStore()

nuxtApp.hook('page:finish', () => {
  loadingStore.finish()
})

nuxtApp.hook('vue:error', () => {
  loadingStore.finish()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
