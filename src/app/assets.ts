// Transparent 1x1 GIF used when a row has no flag/car yet. Without it the <img> would request
// e.g. /img/eformel/flags/undefined.png, which the SPA fallback answers with index.html (HTTP 200).
export const BLANK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export function flagSrc(country?: string | null): string {
  return country ? `/img/eformel/flags/${country}.png` : BLANK_IMAGE
}

export function carSrc(car?: string | null): string {
  return car ? `/img/eformel/cars/${car}.png` : BLANK_IMAGE
}
