<script setup lang="ts">
const loadingStore = useLoadingStore()

onMounted(() => {
  watch(() => loadingStore.isActive, (active) => {
    if (active) {
      document.body.style.overflow = 'hidden'
      document.body.setAttribute('inert', '')
    } else {
      document.body.style.overflow = ''
      document.body.removeAttribute('inert')
    }
  }, { immediate: true })
})

onUnmounted(() => {
  document.body.style.overflow = ''
  document.body.removeAttribute('inert')
})
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div v-if="loadingStore.isActive" class="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a]" aria-live="assertive" aria-label="Memuat, harap tunggu" tabindex="0">
      <div class="flex flex-col items-center">
        <div class="animate-spin">
          <img src="/assets/img/logo_cisf.png" width="50px" height="50px" alt="">
        </div>
        <p class="mt-4 text-white tracking-[3px] uppercase text-[10px] animate-pulse">Please Wait</p>
      </div>
    </div>
  </Transition>
</template>
