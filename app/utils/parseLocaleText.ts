export function parseLocaleText(text: string | undefined, locale: string): string {
  if (!text) return ''
  const hasID = /\[ID\]/i.test(text)
  const hasEN = /\[EN\]/i.test(text)
  
  if (!hasID && !hasEN) return text

  const parts = text.split(/\[(ID|EN)\]/i)
  let result = ''
  let currentLang = null
  
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i]
    if (p.toUpperCase() === 'ID' || p.toUpperCase() === 'EN') {
      currentLang = p.toLowerCase()
    } else {
      if (currentLang === locale || currentLang === null) {
        result += p
      }
    }
  }
  
  return result.trim() || text.replace(/\[(ID|EN)\]/gi, '').trim()
}
