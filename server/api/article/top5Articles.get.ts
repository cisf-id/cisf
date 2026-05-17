export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    // const test = await $fetch(
    //   `https://www.googleapis.com/blogger/v3/blogs/${config.bloggerBlogId}/posts`,
    //   {
    //     params: {
    //       key: config.bloggerApiKey,
    //       maxResults: 5,
    //       labels: 'Blog', // 👈 filter label
    //     },
    //   },
    // );
    
    const get5Articles = defineCachedFunction(
      async (label: string) => {
        return await $fetch(
          `https://www.googleapis.com/blogger/v3/blogs/${config.bloggerBlogId}/posts`,
          {
            params: {
              key: config.bloggerApiKey,
              maxResults: 7,
              labels: label,
            },
          }
        );
      }
    );

    return await get5Articles('Article');
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Gagal mengambil data dari Blogger",
    });
  }
});