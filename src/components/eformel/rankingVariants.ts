export type RankingVariant = 'results' | 'drivers' | 'teams'

export interface RankingConfig {
  /** localStorage key prefix; kept identical to the old per-component keys so saved work survives. */
  storageKey: string
  defaultTitle: string
  placeholder: string
  /** Variant-specific overrides of the shared option defaults. */
  options: { gap: boolean; sponsor: boolean; points: boolean }
  car: { width: string; height: string; margin: string }
}

const standingsCar = { width: '221px', height: '56px', margin: '0 0 0 16px' }

export const rankingVariants: Record<RankingVariant, RankingConfig> = {
  results: {
    storageKey: 'EFormelResults',
    defaultTitle: 'Rating',
    placeholder: 'Driver / Team',
    options: { gap: true, sponsor: false, points: false },
    car: { width: '210px', height: '52px', margin: '2px 16px 0' },
  },
  drivers: {
    storageKey: 'EFormelDrivers',
    defaultTitle: 'Fahrerwertung',
    placeholder: 'Driver',
    options: { gap: false, sponsor: true, points: true },
    car: standingsCar,
  },
  teams: {
    storageKey: 'EFormelTeams',
    defaultTitle: 'Teamwertung',
    placeholder: 'Team',
    options: { gap: false, sponsor: true, points: true },
    car: standingsCar,
  },
}
