// Validates src/data/seasons/*.json and src/data/venues.json, and checks that every referenced
// flag, crest and car image exists. Run with: npm run check:data
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { seasonSchema, venueAliasesSchema } from '../src/data/schema.ts'

const root = new URL('..', import.meta.url).pathname
const imageDir = join(root, 'public/img/eformel')
const seasonsDir = join(root, 'src/data/seasons')

const currentSeasonId = /CURRENT_SEASON_ID\s*=\s*'([^']+)'/.exec(readFileSync(join(root, 'src/data/seasons.ts'), 'utf8'))?.[1]

let errors = 0
let warnings = 0

function problem(isCurrent: boolean, message: string) {
  if (isCurrent) {
    errors++
    console.error(`  ✗ ${message}`)
  } else {
    warnings++
    console.warn(`  ! ${message}`)
  }
}

function checkImage(isCurrent: boolean, folder: 'flags' | 'cars', key: string, usedBy: string) {
  if (!existsSync(join(imageDir, folder, `${key}.png`))) problem(isCurrent, `missing img/eformel/${folder}/${key}.png (${usedBy})`)
}

for (const file of readdirSync(seasonsDir).filter((name) => name.endsWith('.json')).sort()) {
  const id = file.replace('.json', '')
  const isCurrent = id === currentSeasonId
  console.log(`${id}${isCurrent ? ' (current season: problems are errors)' : ' (older season: problems are warnings)'}`)

  const parsed = seasonSchema.safeParse(JSON.parse(readFileSync(join(seasonsDir, file), 'utf8')))
  if (!parsed.success) {
    for (const issue of parsed.error.issues) problem(true, `${issue.path.join('.')}: ${issue.message}`)
    continue
  }

  const season = parsed.data
  if (season.id !== id) problem(true, `id "${season.id}" does not match file name`)
  for (const team of season.teams) {
    checkImage(isCurrent, 'flags', team.crest, `team ${team.id} crest`)
    checkImage(isCurrent, 'cars', team.car, `team ${team.id} car`)
  }
  for (const driver of season.drivers) checkImage(isCurrent, 'flags', driver.country, `driver ${driver.name}`)
  for (const venue of season.venues) checkImage(isCurrent, 'flags', venue.country, `venue ${venue.name}`)
}

console.log('venues.json')
const aliases = venueAliasesSchema.safeParse(JSON.parse(readFileSync(join(root, 'src/data/venues.json'), 'utf8')))
if (!aliases.success) {
  for (const issue of aliases.error.issues) problem(true, `${issue.path.join('.')}: ${issue.message}`)
} else {
  for (const { keyword, country } of aliases.data) checkImage(true, 'flags', country, `venue keyword "${keyword}"`)
}

if (!currentSeasonId) {
  errors++
  console.error('Could not read CURRENT_SEASON_ID from src/data/seasons.ts')
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`)
process.exit(errors > 0 ? 1 : 0)
