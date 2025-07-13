import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { StateCreator } from 'zustand'

import type { ExpertSlice } from './slices/expertSlice'
import { createExpertSlice } from './slices/expertSlice'
import type { HerbSlice } from './slices/herbSlice'
import { createHerbSlice } from './slices/herbSlice'
import type { FormulaSlice } from './slices/formulaSlice'
import { createFormulaSlice } from './slices/formulaSlice'
import type { RelationSlice } from './slices/relationSlice'
import { createRelationSlice } from './slices/relationSlice'
import type { UISlice } from './slices/uiSlice'
import { createUISlice } from './slices/uiSlice'

export type AppState = ExpertSlice & HerbSlice & FormulaSlice & RelationSlice & UISlice

export type AppStateCreator<T> = StateCreator<
  AppState,
  [['zustand/devtools', never], ['zustand/immer', never], ['zustand/persist', unknown]],
  [],
  T
>

const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((set, get, store) => ({
        ...createExpertSlice(set as any, get, store),
        ...createHerbSlice(set as any, get, store),
        ...createFormulaSlice(set as any, get, store),
        ...createRelationSlice(set as any, get, store),
        ...createUISlice(set as any, get, store),
      })),
      {
        name: 'tcm-app-store',
        partialize: (state) => ({
          // Only persist UI preferences, not data
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: 'TCM Knowledge Graph Store',
    }
  )
)

export default useAppStore

// Initialization function
export async function initializeStore() {
  const { setLoading, setError, setExperts, setHerbs, setFormulas, setRelations } =
    useAppStore.getState()

  setLoading(true)
  setError(null)

  try {
    // Load all data in parallel
    const [expertsRes, herbsRes, formulasRes, relationsRes] = await Promise.all([
      fetch('/data/v2/experts.json'),
      fetch('/data/v2/herbs.json'),
      fetch('/data/v2/formulas.json'),
      fetch('/data/v2/relations.json'),
    ])

    if (!expertsRes.ok || !herbsRes.ok || !formulasRes.ok || !relationsRes.ok) {
      throw new Error('Failed to load data')
    }

    const [experts, herbs, formulas, relations] = await Promise.all([
      expertsRes.json(),
      herbsRes.json(),
      formulasRes.json(),
      relationsRes.json(),
    ])

    // Update store
    setExperts(experts)
    setHerbs(herbs)
    setFormulas(formulas)
    setRelations(relations)

    setLoading(false)
  } catch (error) {
    console.error('Failed to initialize store:', error)
    setError(error instanceof Error ? error.message : 'Failed to load data')
    setLoading(false)
  }
}
