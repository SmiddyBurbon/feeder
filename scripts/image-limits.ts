/**
 * Maximum useful widths (px) per image folder in public/img/eformel. Templates draw cars at ~220 px and
 * flags at ~56-140 px wide; the PNG export is 2x, so these leave comfortable headroom.
 */
export const MAX_WIDTH: Record<string, number> = {
  cars: 560,
  flags: 360,
}
