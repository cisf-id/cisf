export default defineNuxtRouteMiddleware((to, from) => {
  const loadingStore = useLoadingStore()
  
  if (to.path !== from.path) {
    loadingStore.start()
  }
})