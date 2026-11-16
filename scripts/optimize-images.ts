// Shrinks oversized car and flag images in place so the repo and the app stay small.
// Run after adding new liveries or flags: npm run optimize:images
import { readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'
import { MAX_WIDTH } from './image-limits.ts'

const imageDir = join(new URL('..', import.meta.url).pathname, 'public/img/eformel')
let savedBytes = 0
let changed = 0

for (const [folder, maxWidth] of Object.entries(MAX_WIDTH)) {
  for (const file of readdirSync(join(imageDir, folder)).filter((name) => name.endsWith('.png'))) {
    const path = join(imageDir, folder, file)
    const before = statSync(path).size
    const { width = 0 } = await sharp(path).metadata()
    if (width <= maxWidth) continue

    const resized = await sharp(path)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .png({ compressionLevel: 9, effort: 10 })
      .toBuffer()
    writeFileSync(path, resized)

    savedBytes += before - resized.length
    changed++
    console.log(`${folder}/${file}: ${width}px, ${(before / 1024).toFixed(0)} KB -> ${maxWidth}px, ${(resized.length / 1024).toFixed(0)} KB`)
  }
}

console.log(`\n${changed} image(s) resized, ${(savedBytes / 1024 / 1024).toFixed(1)} MB saved`)
