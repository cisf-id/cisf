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
<<<<<<< HEAD
<<<<<<< HEAD
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
=======
=======
>>>>>>> parent of a1da6d1 (fix: prevent horizontal overflow)
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
    <LoadingOverlay />
    <Navbar />
    <main>
      <NuxtPage />
    </main>
    <Footer />
  </div>
>>>>>>> parent of a1da6d1 (fix: prevent horizontal overflow)
</template>
