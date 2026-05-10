export default defineEventHandler<any>(async () => {
  const config = useRuntimeConfig()
  const params = new URLSearchParams({
    key: config.bloggerApiKey,
    maxResults: '6',
    fetchBodies: 'true',
    status: 'live',
    labels: 'Statistic',
  })
  return await $fetch<any>(
    `https://www.googleapis.com/blogger/v3/blogs/${config.bloggerBlogId}/posts?${params}`
  )
})