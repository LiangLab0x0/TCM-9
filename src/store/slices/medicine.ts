import type { StateCreator } from 'zustand'

export interface Medicine {
  id: string
  names: {
    cn: string
    pinyin: string
    tradeName?: string
    english?: string
  }
  dosageForm?: string
  mainFunction?: string
  composition?: string[]
  manufacturer?: string
  specification?: string
  approvalNumber?: string
  category?: string
  otcType?: 'OTC甲' | 'OTC乙' | '处方药'
  thumbnail?: string
  createdAt?: string
  updatedAt?: string
}

export interface MedicineSlice {
  medicines: Medicine[]
  selectedMedicineId: string | null

  // Actions
  setMedicines: (medicines: Medicine[]) => void
  addMedicine: (medicine: Medicine) => void
  updateMedicine: (id: string, updates: Partial<Medicine>) => void
  deleteMedicine: (id: string) => void
  setSelectedMedicineId: (id: string | null) => void

  // Getters
  getMedicineById: (id: string) => Medicine | undefined
  searchMedicines: (query: string) => Medicine[]

  // Data loading
  loadMedicines: () => Promise<void>
}

export const createMedicineSlice: StateCreator<MedicineSlice> = (set, get) => ({
  medicines: [],
  selectedMedicineId: null,

  setMedicines: (medicines) => set({ medicines }),

  addMedicine: (medicine) =>
    set((state) => ({
      medicines: [...state.medicines, medicine],
    })),

  updateMedicine: (id, updates) =>
    set((state) => ({
      medicines: state.medicines.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),

  deleteMedicine: (id) =>
    set((state) => ({
      medicines: state.medicines.filter((m) => m.id !== id),
    })),

  setSelectedMedicineId: (id) => set({ selectedMedicineId: id }),

  getMedicineById: (id) => {
    return get().medicines.find((m) => m.id === id)
  },

  searchMedicines: (query) => {
    const lowerQuery = query.toLowerCase()
    return get().medicines.filter(
      (medicine) =>
        medicine.names.cn.includes(query) ||
        medicine.names.pinyin.toLowerCase().includes(lowerQuery) ||
        (medicine.names.tradeName && medicine.names.tradeName.includes(query)) ||
        (medicine.mainFunction && medicine.mainFunction.includes(query))
    )
  },

  loadMedicines: async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockMedicines: Medicine[] = [
        {
          id: 'med-001',
          names: {
            cn: '六味地黄丸',
            pinyin: 'Liuwei Dihuang Wan',
            tradeName: '同仁堂六味地黄丸',
            english: 'Liuwei Dihuang Pills',
          },
          dosageForm: '浓缩丸',
          mainFunction: '滋阴补肾。用于肾阴亏损，头晕耳鸣，腰膝酸软，骨蒸潮热，盗汗遗精。',
          composition: ['熟地黄', '山茱萸', '山药', '泽泻', '牡丹皮', '茯苓'],
          manufacturer: '北京同仁堂科技发展股份有限公司',
          specification: '每8丸相当于原生药3g',
          approvalNumber: '国药准字Z11020123',
          category: '补益剂',
          otcType: 'OTC甲',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'med-002',
          names: {
            cn: '藿香正气水',
            pinyin: 'Huoxiang Zhengqi Shui',
            tradeName: '太极藿香正气水',
            english: 'Huoxiang Zhengqi Liquid',
          },
          dosageForm: '口服液',
          mainFunction: '解表化湿，理气和中。用于外感风寒、内伤湿滞或夏伤暑湿所致的感冒。',
          composition: [
            '苍术',
            '陈皮',
            '厚朴',
            '白芷',
            '茯苓',
            '大腹皮',
            '生半夏',
            '甘草浸膏',
            '广藿香油',
            '紫苏叶油',
          ],
          manufacturer: '太极集团重庆涪陵制药厂有限公司',
          specification: '每支10ml',
          approvalNumber: '国药准字Z50020409',
          category: '解表剂',
          otcType: 'OTC乙',
          createdAt: new Date().toISOString(),
        },
      ]

      set({ medicines: mockMedicines })
    } catch (error) {
      console.error('Failed to load medicines:', error)
      throw error
    }
  },
})
