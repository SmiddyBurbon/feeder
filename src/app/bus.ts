import mitt from 'mitt'

// Interim replacement for Vue 2's `$root.$on/$emit`. Phase 1c replaces this with Pinia stores.
export const bus = mitt<Record<string, any>>()
