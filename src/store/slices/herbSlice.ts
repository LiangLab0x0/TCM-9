import type { StateCreator } from 'zustand'
import type { Herb } from '../../core/entities'

export interface HerbSlice {
  herbs: Herb[]
  selectedHerbId: string | null
  herbSearchQuery: string
  herbFilters: {
    categories: string[]
    qi: string[]
    flavor: string[]
    meridians: string[]
  }

  // Actions
  setHerbs: (herbs: Herb[]) => void
  selectHerb: (id: string | null) => void
  setHerbSearchQuery: (query: string) => void
  setHerbFilters: (filters: Partial<HerbSlice['herbFilters']>) => void

  // Selectors
  getHerbById: (id: string) => Herb | undefined
  getFilteredHerbs: () => Herb[]
  getSelectedHerb: () => Herb | undefined
  getHerbsByIds: (ids: string[]) => Herb[]
}

export const createHerbSlice: StateCreator<HerbSlice> = (set, get) => ({
  herbs: [],
  selectedHerbId: null,
  herbSearchQuery: '',
  herbFilters: {
    categories: [],
    qi: [],
    flavor: [],
    meridians: [],
  },

  setHerbs: (herbs) => set({ herbs }),

  selectHerb: (id) => set({ selectedHerbId: id }),

  setHerbSearchQuery: (query) => set({ herbSearchQuery: query }),

  setHerbFilters: (filters) =>
    set((state) => ({
      herbFilters: { ...state.herbFilters, ...filters },
    })),

  getHerbById: (id) => {
    const { herbs } = get()
    return herbs.find((herb) => herb.id === id)
  },

  getFilteredHerbs: () => {
    const { herbs, herbSearchQuery, herbFilters } = get()

    return herbs.filter((herb) => {
      // Search query filter
      if (herbSearchQuery) {
        const query = herbSearchQuery.toLowerCase()
        const matchesSearch =
          herb.name.cn.toLowerCase().includes(query) ||
          herb.name.pinyin.toLowerCase().includes(query) ||
          (herb.name.en && herb.name.en.toLowerCase().includes(query)) ||
          herb.clinicalUses.some((use) => use.toLowerCase().includes(query))

        if (!matchesSearch) return false
      }

      // Category filter
      if (herbFilters.categories.length > 0) {
        if (!herbFilters.categories.includes(herb.category)) return false
      }

      // Qi filter
      if (herbFilters.qi.length > 0) {
        if (!herbFilters.qi.includes(herb.qi)) return false
      }

      // Flavor filter
      if (herbFilters.flavor.length > 0) {
        const hasFlavorMatch = herbFilters.flavor.some((f) => herb.flavor.includes(f as any))
        if (!hasFlavorMatch) return false
      }

      // Meridian filter
      if (herbFilters.meridians.length > 0) {
        const hasMeridianMatch = herbFilters.meridians.some((m) =>
          herb.meridians.includes(m as any)
        )
        if (!hasMeridianMatch) return false
      }

      return true
    })
  },

  getSelectedHerb: () => {
    const { selectedHerbId, herbs } = get()
    if (!selectedHerbId) return undefined
    return herbs.find((herb) => herb.id === selectedHerbId)
  },

  getHerbsByIds: (ids) => {
    const { herbs } = get()
    return herbs.filter((herb) => ids.includes(herb.id))
  },
})
