import type { Season } from './schema'

/** What a template needs to fill a row: display name, flag/crest key and livery key. */
export interface EntryMatch {
  kind: 'driver' | 'team'
  name: string
  /** Key of the image in public/img/eformel/flags (country for drivers, crest for teams). */
  flag: string
  /** Key of the image in public/img/eformel/cars. */
  car: string
  /** Full team name, e.g. for Quali-style layouts. */
  teamName: string
}

function clean(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Lowercase, transliterate German umlauts (Müller -> mueller) and strip other diacritics (Güven -> guven). */
export function normalize(text: string): string {
  return clean(text.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss'))
}

/** Like normalize, but umlauts just lose their dots (Müller -> muller): how people type names without umlauts. */
function fold(text: string): string {
  return clean(text.toLowerCase())
}

/** All spellings a text can be compared in. */
function forms(text: string): string[] {
  return [...new Set([normalize(text), fold(text)])]
}

interface Candidate {
  entry: EntryMatch
  /** Name in every comparable spelling (see forms()). */
  names: string[]
  code: string
  number: number | null
  teamId: string
}

const indexCache = new WeakMap<Season, Candidate[]>()

function buildIndex(season: Season): Candidate[] {
  const cached = indexCache.get(season)
  if (cached) return cached

  const teamsById = new Map(season.teams.map((team) => [team.id, team]))
  const candidates: Candidate[] = [
    ...season.drivers.map((driver): Candidate => {
      const team = teamsById.get(driver.team)!
      return {
        entry: { kind: 'driver', name: driver.name, flag: driver.country, car: team.car, teamName: team.name },
        names: forms(driver.name),
        code: normalize(driver.code),
        number: driver.number,
        teamId: '',
      }
    }),
    ...season.teams.map((team): Candidate => {
      return {
        entry: { kind: 'team', name: team.name, flag: team.crest, car: team.car, teamName: team.name },
        names: forms(team.name),
        code: '',
        number: null,
        teamId: normalize(team.id),
      }
    }),
  ]
  indexCache.set(season, candidates)
  return candidates
}

/**
 * Finds the driver or team a user typed (or a CSV contained). Best tier wins; within a tier the first
 * entry in the season file wins:
 *   1. exact: full name, driver code, car number or team id
 *   2. a word of the name starts with the query ("van" -> Vandoorne)
 *   3. the name contains the query
 */
export function findEntry(season: Season, query: string): EntryMatch | null {
  const queries = forms(query).filter(Boolean)
  if (queries.length === 0) return null

  const candidates = buildIndex(season)
  const number = /^\d+$/.test(queries[0]) ? Number(queries[0]) : null
  const anyQuery = (test: (q: string) => boolean) => queries.some(test)

  const tiers: Array<(c: Candidate) => boolean> = [
    (c) =>
      anyQuery((q) => c.names.includes(q) || (!!c.code && c.code === q) || c.teamId === q) ||
      (number !== null && c.number === number),
    (c) => anyQuery((q) => c.names.some((name) => name.split(' ').some((word) => word.startsWith(q)))),
    (c) => anyQuery((q) => c.names.some((name) => name.includes(q))),
  ]

  for (const tier of tiers) {
    const hit = candidates.find(tier)
    if (hit) return hit.entry
  }
  return null
}
