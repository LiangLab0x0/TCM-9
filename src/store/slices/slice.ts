import { StateCreator } from 'zustand';
import { Slice } from '../../types/tcm-core';

export interface SliceSlice {
  // 数据
  slices: Slice[];
  selectedSlice: Slice | null;
  
  // 操作
  setSlices: (slices: Slice[]) => void;
  loadSlices: () => Promise<void>;
  setSelectedSlice: (slice: Slice | null) => void;
  
  // 工具方法
  getSliceById: (id: string) => Slice | undefined;
  getSlicesByMaterialId: (materialId: string) => Slice[];
  getSlicesByProcessingMethod: (method: string) => Slice[];
}

export const createSliceSlice: StateCreator<SliceSlice> = (set, get) => ({
  // 初始状态
  slices: [],
  selectedSlice: null,
  
  // 设置饮片数据
  setSlices: (slices) => {
    set({ slices });
  },
  
  // 加载饮片数据
  loadSlices: async () => {
    try {
      const response = await fetch('/data/new-schema/slices.json');
      if (!response.ok) {
        throw new Error('Failed to load slices data');
      }
      const slices = await response.json();
      get().setSlices(slices);
    } catch (error) {
      console.error('Error loading slices:', error);
      throw error;
    }
  },
  
  // 设置选中的饮片
  setSelectedSlice: (slice) => {
    set({ selectedSlice: slice });
  },
  
  // 根据ID获取饮片
  getSliceById: (id) => {
    return get().slices.find(s => s.id === id);
  },
  
  // 根据材料ID获取饮片
  getSlicesByMaterialId: (materialId) => {
    return get().slices.filter(s => s.materialId === materialId);
  },
  
  // 根据炮制方法获取饮片
  getSlicesByProcessingMethod: (method) => {
    return get().slices.filter(s => s.processing.method.includes(method));
  }
});