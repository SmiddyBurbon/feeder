// Minimal axios-compatible `get` on top of fetch: resolves to `{ data }`.
export async function get<T = any>(url: string): Promise<{ data: T }> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`GET ${url} failed: ${response.status}`)
  return { data: (await response.json()) as T }
}

export const http = { get }
