import type { StateCreator } from 'zustand'
import type { Formula } from '../../types/tcm-core'

export interface FormulaSlice {
  // 数据
  formulas: Formula[]
  selectedFormula: Formula | null
  compareFormulas: Formula[]

  // 操作
  setFormulas: (formulas: Formula[]) => void
  loadFormulas: () => Promise<void>
  setSelectedFormula: (formula: Formula | null) => void
  addToCompareFormulas: (formula: Formula) => void
  removeFromCompareFormulas: (formulaId: string) => void
  clearCompareFormulas: () => void

  // 工具方法
  getFormulaById: (id: string) => Formula | undefined
  getFormulasByCategory: (category: string) => Formula[]
  getFormulasContainingSlice: (sliceId: string) => Formula[]
}

export const createFormulaSlice: StateCreator<FormulaSlice> = (set, get) => ({
  // 初始状态
  formulas: [],
  selectedFormula: null,
  compareFormulas: [],

  // 设置方剂数据
  setFormulas: (formulas) => {
    set({ formulas })
  },

  // 加载方剂数据
  loadFormulas: async () => {
    try {
      const response = await fetch('/data/new-schema/formulas.json')
      if (!response.ok) {
        throw new Error('Failed to load formulas data')
      }
      const formulas = await response.json()
      get().setFormulas(formulas)
    } catch (error) {
      console.error('Error loading formulas:', error)
      throw error
    }
  },

  // 设置选中的方剂
  setSelectedFormula: (formula) => {
    set({ selectedFormula: formula })
  },

  // 添加到比较列表
  addToCompareFormulas: (formula) => {
    set((state) => {
      if (state.compareFormulas.length >= 3) return state
      if (state.compareFormulas.find((f) => f.id === formula.id)) return state
      return { compareFormulas: [...state.compareFormulas, formula] }
    })
  },

  // 从比较列表移除
  removeFromCompareFormulas: (formulaId) => {
    set((state) => ({
      compareFormulas: state.compareFormulas.filter((f) => f.id !== formulaId),
    }))
  },

  // 清空比较列表
  clearCompareFormulas: () => {
    set({ compareFormulas: [] })
  },

  // 根据ID获取方剂
  getFormulaById: (id) => {
    return get().formulas.find((f) => f.id === id)
  },

  // 根据类别获取方剂
  getFormulasByCategory: (category) => {
    return get().formulas.filter((f) => f.category === category)
  },

  // 获取包含特定饮片的方剂
  getFormulasContainingSlice: (sliceId) => {
    return get().formulas.filter((f) => f.components.some((c) => c.sliceId === sliceId))
  },
})
