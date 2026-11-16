const loaded = new Set<string>()

// Loads a Google Font by family name (replaces font-picker-vue, which needed an API key).
export function loadGoogleFont(family: string, variants = '400;700') {
  if (loaded.has(family)) return
  loaded.add(family)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${variants}&display=swap`
  document.head.appendChild(link)
}
