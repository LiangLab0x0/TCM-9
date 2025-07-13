import type { StateCreator } from 'zustand'
import type { Expert } from '../../core/entities'

export interface ExpertSlice {
  experts: Expert[]
  selectedExpertId: string | null
  expertSearchQuery: string
  expertFilters: {
    specialities: string[]
    institutions: string[]
  }

  // Actions
  setExperts: (experts: Expert[]) => void
  selectExpert: (id: string | null) => void
  setExpertSearchQuery: (query: string) => void
  setExpertFilters: (filters: Partial<ExpertSlice['expertFilters']>) => void

  // Selectors
  getExpertById: (id: string) => Expert | undefined
  getFilteredExperts: () => Expert[]
  getSelectedExpert: () => Expert | undefined
}

export const createExpertSlice: StateCreator<ExpertSlice> = (set, get) => ({
  experts: [],
  selectedExpertId: null,
  expertSearchQuery: '',
  expertFilters: {
    specialities: [],
    institutions: [],
  },

  setExperts: (experts) => set({ experts }),

  selectExpert: (id) => set({ selectedExpertId: id }),

  setExpertSearchQuery: (query) => set({ expertSearchQuery: query }),

  setExpertFilters: (filters) =>
    set((state) => ({
      expertFilters: { ...state.expertFilters, ...filters },
    })),

  getExpertById: (id) => {
    const { experts } = get()
    return experts.find((expert) => expert.id === id)
  },

  getFilteredExperts: () => {
    const { experts, expertSearchQuery, expertFilters } = get()

    return experts.filter((expert) => {
      // Search query filter
      if (expertSearchQuery) {
        const query = expertSearchQuery.toLowerCase()
        const matchesSearch =
          expert.name.toLowerCase().includes(query) ||
          expert.title.toLowerCase().includes(query) ||
          expert.institution.toLowerCase().includes(query) ||
          expert.specialities.some((s) => s.toLowerCase().includes(query))

        if (!matchesSearch) return false
      }

      // Speciality filter
      if (expertFilters.specialities.length > 0) {
        const hasSpeciality = expertFilters.specialities.some((filter) =>
          expert.specialities.includes(filter)
        )
        if (!hasSpeciality) return false
      }

      // Institution filter
      if (expertFilters.institutions.length > 0) {
        if (!expertFilters.institutions.includes(expert.institution)) return false
      }

      return true
    })
  },

  getSelectedExpert: () => {
    const { selectedExpertId, experts } = get()
    if (!selectedExpertId) return undefined
    return experts.find((expert) => expert.id === selectedExpertId)
  },
})
