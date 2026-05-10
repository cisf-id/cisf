export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const url = `https://www.googleapis.com/blogger/v3/blogs/${config.bloggerBlogId}/posts`
  
  try {
    return await $fetch(
      url,
      {
        query: {
          key: config.bloggerApiKey
        },
      }
    );
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mengambil data dari Blogger',
    })
  }
})