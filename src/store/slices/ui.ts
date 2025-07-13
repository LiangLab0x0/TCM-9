import { StateCreator } from 'zustand';

export type ViewType = 'gallery' | 'detail' | 'compare' | 'map' | 'experts' | 'expert-detail' | 'graph';
export type EntityType = 'material' | 'slice' | 'formula' | 'granule' | 'medicine';

export interface UISlice {
  // 视图状态
  currentView: ViewType;
  currentEntityType: EntityType;
  
  // 加载状态
  isLoading: boolean;
  error: string | null;
  
  // 历史记录
  viewHistory: { entityType: EntityType; id: string }[];
  
  // 选中的省份（地图视图）
  selectedProvinces: string[];
  
  // 操作
  setCurrentView: (view: ViewType) => void;
  setCurrentEntityType: (type: EntityType) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addToHistory: (entityType: EntityType, id: string) => void;
  setSelectedProvinces: (provinces: string[]) => void;
  
  // 工具方法
  getRecentHistory: (limit?: number) => { entityType: EntityType; id: string }[];
}

export const createUISlice: StateCreator<UISlice> = (set, get) => ({
  // 初始状态
  currentView: 'gallery',
  currentEntityType: 'material',
  isLoading: false,
  error: null,
  viewHistory: [],
  selectedProvinces: [],
  
  // 设置当前视图
  setCurrentView: (view) => {
    set({ currentView: view });
  },
  
  // 设置当前实体类型
  setCurrentEntityType: (type) => {
    set({ currentEntityType: type });
  },
  
  // 设置加载状态
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
  
  // 设置错误信息
  setError: (error) => {
    set({ error });
  },
  
  // 添加到历史记录
  addToHistory: (entityType, id) => {
    set(state => {
      const newItem = { entityType, id };
      const filteredHistory = state.viewHistory.filter(
        item => !(item.entityType === entityType && item.id === id)
      );
      return {
        viewHistory: [newItem, ...filteredHistory].slice(0, 50) // 保留最近50条
      };
    });
  },
  
  // 设置选中的省份
  setSelectedProvinces: (provinces) => {
    set({ selectedProvinces: provinces });
  },
  
  // 获取最近的历史记录
  getRecentHistory: (limit = 10) => {
    return get().viewHistory.slice(0, limit);
  }
});