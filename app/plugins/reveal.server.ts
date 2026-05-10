export default defineNuxtPlugin((nuxtApp) => {
  const ssrDirective = {
    getSSRProps() { return {} }
  }

  nuxtApp.vueApp.directive('reveal', ssrDirective)
  nuxtApp.vueApp.directive('reveal-left', ssrDirective)
  nuxtApp.vueApp.directive('reveal-right', ssrDirective)
})