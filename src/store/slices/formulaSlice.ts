import type { StateCreator } from 'zustand'
import type { Formula } from '../../core/entities'

export interface FormulaSlice {
  formulas: Formula[]
  selectedFormulaId: string | null
  formulaSearchQuery: string

  // Actions
  setFormulas: (formulas: Formula[]) => void
  selectFormula: (id: string | null) => void
  setFormulaSearchQuery: (query: string) => void

  // Selectors
  getFormulaById: (id: string) => Formula | undefined
  getFilteredFormulas: () => Formula[]
  getSelectedFormula: () => Formula | undefined
  getFormulasByHerbId: (herbId: string) => Formula[]
}

export const createFormulaSlice: StateCreator<FormulaSlice> = (set, get) => ({
  formulas: [],
  selectedFormulaId: null,
  formulaSearchQuery: '',

  setFormulas: (formulas) => set({ formulas }),

  selectFormula: (id) => set({ selectedFormulaId: id }),

  setFormulaSearchQuery: (query) => set({ formulaSearchQuery: query }),

  getFormulaById: (id) => {
    const { formulas } = get()
    return formulas.find((formula) => formula.id === id)
  },

  getFilteredFormulas: () => {
    const { formulas, formulaSearchQuery } = get()

    if (!formulaSearchQuery) return formulas

    const query = formulaSearchQuery.toLowerCase()
    return formulas.filter(
      (formula) =>
        formula.name.cn.toLowerCase().includes(query) ||
        formula.name.pinyin.toLowerCase().includes(query) ||
        formula.source.toLowerCase().includes(query) ||
        formula.indications.some((ind) => ind.toLowerCase().includes(query))
    )
  },

  getSelectedFormula: () => {
    const { selectedFormulaId, formulas } = get()
    if (!selectedFormulaId) return undefined
    return formulas.find((formula) => formula.id === selectedFormulaId)
  },

  getFormulasByHerbId: (herbId) => {
    const { formulas } = get()
    return formulas.filter((formula) => formula.ingredients.some((ing) => ing.herbId === herbId))
  },
})
