import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MaterialSlice, createMaterialSlice } from './slices/material';
import { SliceSlice, createSliceSlice } from './slices/slice';
import { FormulaSlice, createFormulaSlice } from './slices/formula';
import { UISlice, createUISlice } from './slices/ui';
import { ExpertSlice, createExpertSlice } from './slices/expert';

// 合并所有slice类型
export type AppStore = MaterialSlice & SliceSlice & FormulaSlice & UISlice & ExpertSlice;

// 创建store
export const useAppStore = create<AppStore>()(
  persist(
    (...args) => ({
      ...createMaterialSlice(...args),
      ...createSliceSlice(...args),
      ...createFormulaSlice(...args),
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
);

// 初始化函数
export const initializeStore = async () => {
  const { loadMaterials, loadSlices, loadFormulas, loadExperts, setLoading, setError } = useAppStore.getState();
  
  setLoading(true);
  setError(null);
  
  try {
    // 并行加载所有数据
    await Promise.all([
      loadMaterials(),
      loadSlices(),
      loadFormulas(),
      loadExperts(),
    ]);
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Failed to load data');
  } finally {
    setLoading(false);
  }
};