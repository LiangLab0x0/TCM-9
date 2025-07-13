import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { MaterialSlice } from './slices/material'
import { createMaterialSlice } from './slices/material'
import type { SliceSlice } from './slices/slice'
import { createSliceSlice } from './slices/slice'
import type { FormulaSlice } from './slices/formula'
import { createFormulaSlice } from './slices/formula'
import type { GranuleSlice } from './slices/granule'
import { createGranuleSlice } from './slices/granule'
import type { MedicineSlice } from './slices/medicine'
import { createMedicineSlice } from './slices/medicine'
import type { UISlice } from './slices/ui'
import { createUISlice } from './slices/ui'
import type { ExpertSlice } from './slices/expert'
import { createExpertSlice } from './slices/expert'

// 合并所有slice类型
export type AppStore = MaterialSlice &
  SliceSlice &
  FormulaSlice &
  GranuleSlice &
  MedicineSlice &
  UISlice &
  ExpertSlice

// 创建store
export const useAppStore = create<AppStore>()(
  persist(
    (...args) => ({
      ...createMaterialSlice(...args),
      ...createSliceSlice(...args),
      ...createFormulaSlice(...args),
      ...createGranuleSlice(...args),
      ...createMedicineSlice(...args),
      ...createUISlice(...args),
      ...createExpertSlice(...args),
    }),
    {
      name: 'tcm-gallery-v2-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // 只持久化部分状态
        viewHistory: state.viewHistory,
        currentEntityType: state.currentEntityType,
      }),
    }
  )
)

// 初始化函数
export const initializeStore = async () => {
  const {
    loadMaterials,
    loadSlices,
    loadFormulas,
    loadGranules,
    loadMedicines,
    loadExperts,
    setLoading,
    setError,
  } = useAppStore.getState()

  setLoading(true)
  setError(null)

  try {
    // 并行加载所有数据
    await Promise.all([
      loadMaterials(),
      loadSlices(),
      loadFormulas(),
      loadGranules(),
      loadMedicines(),
      loadExperts(),
    ])
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Failed to load data')
  } finally {
    setLoading(false)
  }
}
