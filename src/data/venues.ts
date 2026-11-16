import venueAliases from './venues.json'

/** Country key (flag file name) for free text like "Berlin E-Prix"; first matching keyword wins. */
export function countryForVenue(text: string): string {
  const haystack = text.toLowerCase()
  return venueAliases.find(({ keyword }) => haystack.includes(keyword))?.country ?? ''
}
