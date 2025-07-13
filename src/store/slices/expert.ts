import { StateCreator } from 'zustand';
import { TCMExpert } from '../../types';

export interface ExpertSlice {
  // 数据
  experts: TCMExpert[];
  selectedExpert: TCMExpert | null;
  
  // 操作
  setExperts: (experts: TCMExpert[]) => void;
  loadExperts: () => Promise<void>;
  setSelectedExpert: (expert: TCMExpert | null) => void;
  
  // 工具方法
  getExpertById: (id: string) => TCMExpert | undefined;
  getExpertsBySpecialization: (specialization: string) => TCMExpert[];
}

export const createExpertSlice: StateCreator<ExpertSlice> = (set, get) => ({
  // 初始状态
  experts: [],
  selectedExpert: null,
  
  // 设置专家数据
  setExperts: (experts) => {
    set({ experts });
  },
  
  // 加载专家数据
  loadExperts: async () => {
    try {
      const response = await fetch('/data/experts.json');
      if (!response.ok) {
        throw new Error('Failed to load experts data');
      }
      const experts = await response.json();
      get().setExperts(experts);
    } catch (error) {
      console.error('Error loading experts:', error);
      throw error;
    }
  },
  
  // 设置选中的专家
  setSelectedExpert: (expert) => {
    set({ selectedExpert: expert });
  },
  
  // 根据ID获取专家
  getExpertById: (id) => {
    return get().experts.find(e => e.id === id);
  },
  
  // 根据专长获取专家
  getExpertsBySpecialization: (specialization) => {
    return get().experts.filter(e => 
      e.specialization.includes(specialization)
    );
  }
});