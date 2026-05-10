export default defineNuxtPlugin((nuxtApp) => {
  const makeDirective = (cls: string) => ({
    mounted(el: HTMLElement) {
      el.classList.add(cls)

      const observe = () => {
        const io = new IntersectionObserver(([e]) => {
          if (e && e.isIntersecting) {
            el.classList.add('in-view')
            io.disconnect()
          }
        }, { threshold: 0.12 })
        io.observe(el)
      }

      window.addEventListener('loading:done', observe, { once: true })
      observe()
    }
  })

  nuxtApp.vueApp.directive('reveal', makeDirective('reveal'))
  nuxtApp.vueApp.directive('reveal-left', makeDirective('reveal-left'))
  nuxtApp.vueApp.directive('reveal-right', makeDirective('reveal-right'))
})