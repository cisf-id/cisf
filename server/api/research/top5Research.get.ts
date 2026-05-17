export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    const get5Researchs = defineCachedFunction(
      async (label: string) => {
        return await $fetch(
          `https://www.googleapis.com/blogger/v3/blogs/${config.bloggerBlogId}/posts`,
          {
            params: {
              key: config.bloggerApiKey,
              maxResults: 5,
              labels: label,
            },
          }
        );
      }
    );

    return await get5Researchs('Research');
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Gagal mengambil data dari Blogger",
    });
  }
});
