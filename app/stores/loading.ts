export const useLoadingStore = defineStore('loading', {
  state: () => ({ isActive: import.meta.server ? true : false }),

  actions: {
    start() { this.isActive = true },
    finish() { this.isActive = false }
  }
})