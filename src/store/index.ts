import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Herb, SearchFilters, UIState, TCMExpert } from '../types';

interface AppState extends UIState {
  // 数据状态
  herbs: Herb[];
  experts: TCMExpert[];
  filteredHerbs: Herb[];
  searchFilters: SearchFilters;
  
  // 数据操作
  setHerbs: (herbs: Herb[]) => void;
  setExperts: (experts: TCMExpert[]) => void;
  loadHerbs: () => Promise<void>;
  loadExperts: () => Promise<void>;
  
  // 搜索和过滤
  updateSearchFilters: (filters: Partial<SearchFilters>) => void;
  filterHerbs: () => void;
  
  // 专业功能
  viewHistory: string[];
  addToHistory: (herbId: string) => void;
  
  // UI状态管理
  setCurrentView: (view: UIState['currentView']) => void;
  setSelectedHerb: (herb: Herb | null) => void;
  setSelectedExpert: (expert: TCMExpert | null) => void;
  addToCompare: (herb: Herb) => void;
  removeFromCompare: (herbId: string) => void;
  clearCompare: () => void;
  setSelectedProvinces: (provinces: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // 统计数据
  getStats: () => {
    total: number;
    categories: number;
    provinces: number;
  };
}

const initialFilters: SearchFilters = {
  searchTerm: '',
  category: '',
  nature: '',
  taste: '',
  meridian: '',
  origin: ''
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始状态
      herbs: [],
      experts: [],
      filteredHerbs: [],
      searchFilters: initialFilters,
      viewHistory: [],
      currentView: 'gallery',
      selectedHerb: null,
      selectedExpert: null,
      compareList: [],
      selectedProvinces: [],
      isLoading: false,
      error: null,

      // 数据操作
      setHerbs: (herbs) => {
        set({ herbs });
        get().filterHerbs();
      },

      setExperts: (experts) => {
        set({ experts });
      },

      loadHerbs: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/data/herbs_with_images.json');
          if (!response.ok) {
            throw new Error('Failed to load herbs data');
          }
          const herbs = await response.json();
          get().setHerbs(herbs);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
          set({ isLoading: false });
        }
      },

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
        }
      },

      // 搜索和过滤
      updateSearchFilters: (newFilters) => {
        set(state => ({
          searchFilters: { ...state.searchFilters, ...newFilters }
        }));
        get().filterHerbs();
      },

      filterHerbs: () => {
        const { herbs, searchFilters } = get();
        let filtered = [...herbs];

        // 文本搜索
        if (searchFilters.searchTerm.trim()) {
          const term = searchFilters.searchTerm.toLowerCase();
          filtered = filtered.filter(herb =>
            herb.name.toLowerCase().includes(term) ||
            herb.pinyin.toLowerCase().includes(term) ||
            herb.englishName?.toLowerCase().includes(term) ||
            herb.functions.some(func => func.toLowerCase().includes(term)) ||
            herb.indications.some(indication => indication.toLowerCase().includes(term))
          );
        }

        // 类别过滤
        if (searchFilters.category) {
          filtered = filtered.filter(herb => herb.category === searchFilters.category);
        }

        // 性味过滤
        if (searchFilters.nature) {
          filtered = filtered.filter(herb => herb.nature === searchFilters.nature);
        }

        if (searchFilters.taste) {
          filtered = filtered.filter(herb => herb.taste.includes(searchFilters.taste));
        }

        // 归经过滤
        if (searchFilters.meridian) {
          filtered = filtered.filter(herb => 
            herb.meridians?.includes(searchFilters.meridian)
          );
        }

        // 产地过滤
        if (searchFilters.origin) {
          filtered = filtered.filter(herb => 
            herb.origin?.includes(searchFilters.origin)
          );
        }

        set({ filteredHerbs: filtered });
      },

      // 专业功能
      addToHistory: (herbId) => {
        set(state => {
          const newHistory = [herbId, ...state.viewHistory.filter(id => id !== herbId)];
          return { viewHistory: newHistory.slice(0, 20) }; // 保留最近20条记录
        });
      },

      // UI状态管理
      setCurrentView: (view) => set({ currentView: view }),
      
      setSelectedHerb: (herb) => {
        set({ selectedHerb: herb });
        if (herb) {
          get().addToHistory(herb.id);
        }
      },

      setSelectedExpert: (expert) => {
        set({ selectedExpert: expert });
      },

      addToCompare: (herb) => {
        set(state => {
          if (state.compareList.length >= 3) return state; // 最多比较3个
          if (state.compareList.find(h => h.id === herb.id)) return state; // 避免重复
          return { compareList: [...state.compareList, herb] };
        });
      },

      removeFromCompare: (herbId) => {
        set(state => ({
          compareList: state.compareList.filter(h => h.id !== herbId)
        }));
      },

      clearCompare: () => set({ compareList: [] }),

      setSelectedProvinces: (provinces) => set({ selectedProvinces: provinces }),

      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),

      // 统计数据
      getStats: () => {
        const { herbs } = get();
        const categories = new Set(herbs.map(h => h.category));
        const provinces = new Set(herbs.flatMap(h => h.origin || []));
        
        return {
          total: herbs.length,
          categories: categories.size,
          provinces: provinces.size
        };
      }
    }),
    {
      name: 'professional-tcm-gallery-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        viewHistory: state.viewHistory
      })
    }
  )
);
