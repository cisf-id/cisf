export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    // const res = await $fetch(
    //   `https://www.googleapis.com/blogger/v3/blogs/${config.bloggerBlogId}/posts`,
    //   {
    //     params: {
    //       key: config.bloggerApiKey,
    //       maxResults: 5,
    //       labels: 'Publications', // 👈 filter label
    //     },
    //   },
    // );

    const get5Publications = defineCachedFunction(
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

    return await get5Publications('Publication');
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Gagal mengambil data dari Blogger",
    });
  }
});
