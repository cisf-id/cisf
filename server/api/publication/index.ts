export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()

  // Ambil parameter dari URL
  const searchQ = (query.q as string) || null
  
  const getPublications = defineCachedFunction(
    async (q: string | null) => {
      const combinedQuery = q ? `${q} label:Publication` : 'label:Publication';

      return await $fetch(`https://www.googleapis.com/blogger/v3/blogs/${config.bloggerBlogId}/posts/search`, {
        params: {
          key: config.bloggerApiKey,
          q: combinedQuery,
        }
      });
    }
  );

  try {
    return await getPublications(searchQ);
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Gagal mengambil data dari Blogger API",
    });
  }
})