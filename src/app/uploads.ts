/**
 * Shows the image chosen in a file input inside a row's <img> (flag or car). Like before, the picture is only
 * displayed (and exported), not saved to localStorage, where data URLs would quickly exhaust the quota.
 */
export function showPickedImage(inputId: string, target: HTMLImageElement | null | undefined): void {
  const file = (document.getElementById(inputId) as HTMLInputElement | null)?.files?.[0]
  if (!file || !target) return

  const reader = new FileReader()
  reader.onload = () => {
    target.src = reader.result as string
  }
  reader.readAsDataURL(file)
}
