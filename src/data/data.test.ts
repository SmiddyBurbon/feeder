import { describe, expect, it } from 'vitest'
import { findEntry, normalize } from './match'
import { seasonSchema, venueAliasesSchema } from './schema'
import type { Season } from './schema'
import { countryForVenue } from './venues'
import venueAliases from './venues.json'

const seasonModules = import.meta.glob<{ default: Season }>('./seasons/*.json', { eager: true })
const seasons = Object.entries(seasonModules).map(([path, module]) => ({ path, season: module.default }))
const s13 = seasons.find(({ season }) => season.id === 's13')!.season

describe('season files', () => {
  it.each(seasons)('$path matches the schema', ({ path, season }) => {
    const result = seasonSchema.safeParse(season)
    expect(result.error?.issues ?? []).toEqual([])
    expect(path).toContain(`/${season.id}.json`)
  })

  it('venue aliases match the schema', () => {
    expect(venueAliasesSchema.safeParse(venueAliases).success).toBe(true)
  })
})

describe('normalize', () => {
  it('transliterates umlauts and strips diacritics', () => {
    expect(normalize('Nico Müller')).toBe('nico mueller')
    expect(normalize('Ayhancan Güven')).toBe('ayhancan gueven')
    expect(normalize("Zak O'Sullivan")).toBe('zak o sullivan')
    expect(normalize('  José   María ')).toBe('jose maria')
  })
})

describe('findEntry (season 13)', () => {
  it('matches regardless of case', () => {
    for (const query of ['vandoorne', 'Vandoorne', 'VANDOORNE', 'Stoffel Vandoorne']) {
      expect(findEntry(s13, query)).toMatchObject({ kind: 'driver', name: 'Stoffel Vandoorne', flag: 'be', car: 'jaguar' })
    }
  })

  it('matches umlaut-free spellings', () => {
    expect(findEntry(s13, 'Nico Mueller')?.name).toBe('Nico Müller')
    expect(findEntry(s13, 'Muller')?.name).toBe('Nico Müller')
    expect(findEntry(s13, 'Guven')?.name).toBe('Ayhancan Güven')
  })

  it('matches by three-letter code and car number', () => {
    expect(findEntry(s13, 'WEH')?.name).toBe('Pascal Wehrlein')
    expect(findEntry(s13, '51')?.name).toBe('Nico Müller')
    expect(findEntry(s13, '0')).toBeNull()
  })

  it('prefers a word prefix over a substring', () => {
    // "Evans" contains "van" but only Vandoorne has a word starting with it.
    expect(findEntry(s13, 'van')?.name).toBe('Stoffel Vandoorne')
  })

  it('finds teams by id and name, using the team crest as flag', () => {
    expect(findEntry(s13, 'porsche')).toMatchObject({ kind: 'team', name: 'Porsche', flag: 'porsche', car: 'porsche' })
    expect(findEntry(s13, 'Jaguar TCS Racing')).toMatchObject({ kind: 'team', flag: 'jaguar' })
  })

  it('returns null for empty or unknown input', () => {
    expect(findEntry(s13, '')).toBeNull()
    expect(findEntry(s13, '   ')).toBeNull()
    expect(findEntry(s13, 'zzzzzz')).toBeNull()
  })
})

describe('countryForVenue', () => {
  it('finds the country in free text', () => {
    expect(countryForVenue('Berlin E-Prix')).toBe('de')
    expect(countryForVenue('TOKYO')).toBe('jp')
    expect(countryForVenue('São Paulo')).toBe('') // keyword is "sao" without the accent, as before
    expect(countryForVenue('Sao Paulo')).toBe('br')
    expect(countryForVenue('Marrakesh')).toBe('ma')
  })

  it('returns an empty string when nothing matches', () => {
    expect(countryForVenue('Nowhere')).toBe('')
    expect(countryForVenue('')).toBe('')
  })
})
