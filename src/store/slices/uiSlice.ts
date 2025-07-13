import type { StateCreator } from 'zustand'

export interface UISlice {
  isLoading: boolean
  error: string | null
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  graphViewOpen: boolean
  selectedTab: 'experts' | 'herbs' | 'formulas'

  // Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setGraphViewOpen: (open: boolean) => void
  setSelectedTab: (tab: 'experts' | 'herbs' | 'formulas') => void
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  isLoading: false,
  error: null,
  theme: 'light',
  sidebarOpen: false,
  graphViewOpen: false,
  selectedTab: 'experts',

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  setTheme: (theme) => set({ theme }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setGraphViewOpen: (open) => set({ graphViewOpen: open }),

  setSelectedTab: (tab) => set({ selectedTab: tab }),
})
