export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { slug } = event.context.params!

  const blogId = config.bloggerBlogId
  const apiKey = config.bloggerApiKey

  // Helper: ambil post berdasarkan path exact
  async function fetchByPath(path: string) {
    return await $fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/bypath`,
      { query: { path, key: apiKey } }
    )
  }

  // Helper: cari post yang URL-nya cocok dengan slug (tanpa angka ID)
  async function searchBySlugPrefix(slugPath: string): Promise<any> {
    // Buat regex: cocokkan path yang mengandung slug prefix + optional _XXXXXXXX
    // contoh slugPath: article/2026/05/organisasi-multinasional-energi-dan
    const pathPrefix = '/' + slugPath

    // Ambil daftar artikel dengan label Article (atau semua post)
    const result = await $fetch<any>(
      `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts`,
      {
        query: {
          key: apiKey,
          maxResults: 500,
          fetchBodies: false,
          fetchImages: false,
          status: 'live',
          fields: 'items(id,url)',
        }
      }
    )

    if (!result?.items) return null

    // Cari artikel yang URL-nya mengandung path prefix
    const matched = result.items.find((item: any) => {
      try {
        const itemPath = new URL(item.url).pathname
        // Cocokkan path tanpa angka ID di akhir
        const cleanItemPath = itemPath
          .replace(/\.html$/, '')
          .replace(/_\d{8,}$/, '')
        const cleanSlugPath = '/' + slugPath
          .replace(/\.html$/, '')
          .replace(/_\d{8,}$/, '')
        return cleanItemPath === cleanSlugPath
      } catch {
        return false
      }
    })

    if (!matched) return null

    // Fetch post lengkap berdasarkan ID
    return await $fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${matched.id}`,
      { query: { key: apiKey } }
    )
  }

  try {
    // Coba 1: path asli dengan .html
    try {
      return await fetchByPath(`/${slug}`)
    } catch (e1: any) {
      if (e1?.status !== 404 && e1?.statusCode !== 404) throw e1
    }

    // Coba 2: path asli + .html (jika belum ada)
    if (!slug.endsWith('.html')) {
      try {
        return await fetchByPath(`/${slug}.html`)
      } catch (e2: any) {
        if (e2?.status !== 404 && e2?.statusCode !== 404) throw e2
      }
    }

    // Coba 3: cari berdasarkan slug prefix (tanpa angka ID)
    const found = await searchBySlugPrefix(slug)
    if (found) return found

    throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })

  } catch (error: any) {
    if (error?.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mengambil data dari Blogger',
    })
  }
})