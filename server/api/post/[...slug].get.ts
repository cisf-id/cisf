export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { slug } = event.context.params!
  
  const url = `https://www.googleapis.com/blogger/v3/blogs/${config.bloggerBlogId}/posts/bypath?path=/${slug}`
  
  try {
    // const data = await $fetch(url, {
    //   query: {
    //     key: config.bloggerApiKey,
    //   }
    // }
    // )

    const getPost = defineCachedFunction(
      async (slug) => {
        return await $fetch(
          url,
          {
            query: {
              key: config.bloggerApiKey
            },
          }
        );
      }
    );
    
    return await getPost(slug);
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mengambil data dari Blogger',
    })
  }
})