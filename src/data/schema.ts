import { z } from 'zod'

/** Two-letter-ish key of a file in public/img/eformel/flags (countries and team crests share the folder). */
const assetKey = z.string().regex(/^[a-z0-9_-]+$/, 'lowercase letters, digits, - or _ only')

export const teamSchema = z.object({
  id: assetKey,
  name: z.string().min(1),
  /** Image in public/img/eformel/flags/<crest>.png */
  crest: assetKey,
  /** Livery image in public/img/eformel/cars/<car>.png; point this at e.g. "porsche_berlin" for a special livery. */
  car: assetKey,
})

export const driverSchema = z.object({
  number: z.number().int().positive(),
  name: z.string().min(1),
  /** Three-letter code, e.g. VAN. */
  code: z.string().min(1),
  /** Flag in public/img/eformel/flags/<country>.png */
  country: assetKey,
  /** Team id. */
  team: assetKey,
})

export const venueSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  country: assetKey,
})

export const seasonSchema = z
  .object({
    id: assetKey,
    label: z.string().min(1),
    teams: z.array(teamSchema),
    drivers: z.array(driverSchema),
    venues: z.array(venueSchema),
  })
  .superRefine((season, ctx) => {
    const teamIds = new Set(season.teams.map((team) => team.id))
    if (teamIds.size !== season.teams.length) {
      ctx.addIssue({ code: 'custom', message: 'duplicate team id', path: ['teams'] })
    }
    season.drivers.forEach((driver, index) => {
      if (!teamIds.has(driver.team)) {
        ctx.addIssue({ code: 'custom', message: `unknown team "${driver.team}"`, path: ['drivers', index, 'team'] })
      }
    })
  })

export const venueAliasesSchema = z.array(z.object({ keyword: z.string().min(1), country: assetKey }))

export type Team = z.infer<typeof teamSchema>
export type Driver = z.infer<typeof driverSchema>
export type Venue = z.infer<typeof venueSchema>
export type Season = z.infer<typeof seasonSchema>
