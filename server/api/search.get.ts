export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = String(query.q || '').trim()

  if (!q) {
    return {
      items: []
    }
  }

  const config = useRuntimeConfig()

  const blogId =
    config.bloggerBlogId ||
    config.public?.bloggerBlogId

  const apiKey =
    config.bloggerApiKey ||
    config.public?.bloggerApiKey

  if (!blogId || !apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Blogger configuration is missing.'
    })
  }

  const response = await $fetch(
    `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/search`,
    {
      query: {
        key: apiKey,
        q,
        maxResults: 20,
        fetchBodies: true
      }
    }
  )

  return response
})