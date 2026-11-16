/** localStorage access that never throws (private mode, blocked storage, corrupt JSON). */
export function loadStored<T = unknown>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? null : (JSON.parse(raw) as T)
  } catch {
    return null
  }
}

export function saveStored(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable: the editor keeps working, the work just isn't remembered.
  }
}
