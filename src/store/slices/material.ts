import type { StateCreator } from 'zustand'
import type { Material, SearchFilters, QiType } from '../../types/tcm-core'
import { FlavorType, MeridianType } from '../../types/tcm-core'

export interface MaterialSlice {
  // 数据
  materials: Material[]
  filteredMaterials: Material[]
  selectedMaterial: Material | null

  // 操作
  setMaterials: (materials: Material[]) => void
  loadMaterials: () => Promise<void>
  setSelectedMaterial: (material: Material | null) => void
  filterMaterials: (filters: SearchFilters) => void

  // 工具方法
  getMaterialById: (id: string) => Material | undefined
  getMaterialsByCategory: (category: string) => Material[]
  getMaterialsByQi: (qi: QiType) => Material[]
  getStats: () => {
    total: number
    categories: Set<string>
    origins: Set<string>
    qiTypes: Record<QiType, number>
  }
}

export const createMaterialSlice: StateCreator<MaterialSlice> = (set, get) => ({
  // 初始状态
  materials: [],
  filteredMaterials: [],
  selectedMaterial: null,

  // 设置材料数据
  setMaterials: (materials) => {
    set({ materials, filteredMaterials: materials })
  },

  // 加载材料数据
  loadMaterials: async () => {
    try {
      const response = await fetch('/data/new-schema/materials.json')
      if (!response.ok) {
        throw new Error('Failed to load materials data')
      }
      const materials = await response.json()
      get().setMaterials(materials)
    } catch (error) {
      console.error('Error loading materials:', error)
      throw error
    }
  },

  // 设置选中的材料
  setSelectedMaterial: (material) => {
    set({ selectedMaterial: material })
  },

  // 过滤材料
  filterMaterials: (filters) => {
    const { materials } = get()
    let filtered = [...materials]

    // 全文搜索
    if (filters.query?.trim()) {
      const query = filters.query.toLowerCase()
      filtered = filtered.filter(
        (material) =>
          material.names.cn.toLowerCase().includes(query) ||
          material.names.pinyin.toLowerCase().includes(query) ||
          material.names.english?.toLowerCase().includes(query) ||
          material.functions.some((func) => func.toLowerCase().includes(query)) ||
          material.indications.some((ind) => ind.toLowerCase().includes(query))
      )
    }

    // 四气过滤
    if (filters.qi) {
      filtered = filtered.filter((material) => material.qi === filters.qi)
    }

    // 五味过滤
    if (filters.flavor && filters.flavor.length > 0) {
      filtered = filtered.filter((material) =>
        filters.flavor!.some((f) => material.flavor.includes(f))
      )
    }

    // 归经过滤
    if (filters.meridian && filters.meridian.length > 0) {
      filtered = filtered.filter((material) =>
        filters.meridian!.some((m) => material.meridians.includes(m))
      )
    }

    // 类别过滤
    if (filters.category) {
      filtered = filtered.filter((material) => material.category === filters.category)
    }

    // 产地过滤
    if (filters.origin) {
      filtered = filtered.filter((material) =>
        material.origin.some((o) => o.region.includes(filters.origin!))
      )
    }

    set({ filteredMaterials: filtered })
  },

  // 根据ID获取材料
  getMaterialById: (id) => {
    return get().materials.find((m) => m.id === id)
  },

  // 根据类别获取材料
  getMaterialsByCategory: (category) => {
    return get().materials.filter((m) => m.category === category)
  },

  // 根据四气获取材料
  getMaterialsByQi: (qi) => {
    return get().materials.filter((m) => m.qi === qi)
  },

  // 获取统计信息
  getStats: () => {
    const { materials } = get()
    const categories = new Set(materials.map((m) => m.category))
    const origins = new Set(materials.flatMap((m) => m.origin.map((o) => o.region)))

    const qiTypes: Record<QiType, number> = {
      寒: 0,
      凉: 0,
      平: 0,
      温: 0,
      热: 0,
    }

    materials.forEach((m) => {
      qiTypes[m.qi]++
    })

    return {
      total: materials.length,
      categories,
      origins,
      qiTypes,
    }
  },
})
