import type { Season } from './schema'

/** Season used by the templates; change this one line when a new season starts. */
export const CURRENT_SEASON_ID = 's13'

const loaders = import.meta.glob<{ default: Season }>('./seasons/*.json')
const cache = new Map<string, Promise<Season>>()

export function listSeasonIds(): string[] {
  return Object.keys(loaders).map((path) => path.replace('./seasons/', '').replace('.json', ''))
}

/** Loads a season (a separate lazy chunk per file) and caches it. */
export function loadSeason(id: string = CURRENT_SEASON_ID): Promise<Season> {
  const load = loaders[`./seasons/${id}.json`]
  if (!load) return Promise.reject(new Error(`Unknown season "${id}"`))
  if (!cache.has(id)) cache.set(id, load().then((module) => module.default))
  return cache.get(id)!
}
