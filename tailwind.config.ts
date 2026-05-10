export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/pages/**/*.vue',
    './app/layouts/**/*.vue',
    './app/app.vue'
  ],
  theme: {
    extend: {},
    screens: {
      xs: '281px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1430px'
    },
  },
  plugins: [],
}