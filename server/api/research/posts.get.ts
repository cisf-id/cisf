export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  try {
    const params: Record<string, any> = {
      key: config.bloggerApiKey,
      maxResults: 10,
      labels: 'Research',
      fetchBodies: true,
      fetchImages: true,
      status: 'live',
    }

    // Hanya tambahkan pageToken jika ada dan tidak kosong
    if (query.pageToken && query.pageToken !== '') {
      params.pageToken = query.pageToken
    }

    // Tambahkan search query jika ada
    if (query.q) params.q = query.q

    const result = await $fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${config.bloggerBlogId}/posts`,
      { params }
    )

    return result

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mengambil data dari Blogger',
    })
  }
})