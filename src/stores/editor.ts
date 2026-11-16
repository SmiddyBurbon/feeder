import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

/**
 * Shared state between the active template (preview) and the Sidebar.
 *
 * Replaces the former `$root.$emit/$on` event bus: the template registers its `options` object, the
 * Sidebar edits it, and templates react to the counters/values below with `$watch`.
 */
export const useEditorStore = defineStore('editor', () => {
  /** Options object of the template that is currently mounted (shared by reference). */
  const options = ref<Record<string, any>>({})

  /** Bumped whenever the Sidebar changed an option that needs the template to rebuild (lines, columns). */
  const optionsRevision = ref(0)

  /** Latest imported CSV; `id` makes re-importing the same file trigger watchers again. */
  const csvImport = shallowRef<{ id: number; rows: string[][] } | null>(null)

  /** Bumped when the user presses "Auto-Fill Data". */
  const autoFillRequests = ref(0)

  const font = ref('')
  const colors = ref<{ primary?: string; secondary?: string } | null>(null)

  /** Options sidebar visibility on small screens. */
  const sidebarOpen = ref(false)

  let csvCounter = 0

  function registerOptions(next: Record<string, any>) {
    options.value = next
  }
  function notifyOptionsChanged() {
    optionsRevision.value++
  }
  function importCsv(rows: string[][]) {
    csvImport.value = { id: ++csvCounter, rows }
  }
  function requestAutoFill() {
    autoFillRequests.value++
  }
  function setFont(family: string) {
    font.value = family
  }
  function setColors(next: { primary?: string; secondary?: string } | null) {
    colors.value = next ? { ...next } : null
  }
  function toggleSidebar(open = !sidebarOpen.value) {
    sidebarOpen.value = open
  }

  return {
    options, optionsRevision, csvImport, autoFillRequests, font, colors, sidebarOpen,
    registerOptions, notifyOptionsChanged, importCsv, requestAutoFill, setFont, setColors, toggleSidebar,
  }
})
