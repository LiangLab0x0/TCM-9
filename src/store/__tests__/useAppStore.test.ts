import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useAppStore from '../useAppStore'
import type { Expert, Herb } from '@/core/entities'

// Mock data
const mockExperts: Expert[] = [
  {
    id: 'expert_1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    name: '张三',
    title: '主任医师',
    institution: '中医药大学附属医院',
    bio: '专家介绍',
    specialities: ['消化系统'],
    recommendedHerbs: ['herb_1'],
    classicalFormulas: [],
  },
  {
    id: 'expert_2',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    name: '李四',
    title: '副主任医师',
    institution: '中医院',
    bio: '专家介绍2',
    specialities: ['心血管系统'],
    recommendedHerbs: ['herb_2'],
    classicalFormulas: [],
  },
]

const mockHerbs: Herb[] = [
  {
    id: 'herb_1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    name: { cn: '人参', pinyin: 'Renshen' },
    qi: 'warm',
    flavor: ['sweet'],
    meridians: ['spleen', 'lung'],
    category: '补虚药',
    origin: [],
    images: { thumbnail: '', alt: '人参' },
    clinicalUses: ['大补元气'],
    recommendedBy: ['expert_1'],
  },
]

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useAppStore.getState()
    act(() => {
      store.setExperts([])
      store.setHerbs([])
      store.setExpertSearchQuery('')
      store.setHerbSearchQuery('')
    })
  })

  describe('Expert Slice', () => {
    it('sets and gets experts', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setExperts(mockExperts)
      })

      expect(result.current.experts).toEqual(mockExperts)
    })

    it('filters experts by search query', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setExperts(mockExperts)
        result.current.setExpertSearchQuery('张三')
      })

      const filtered = result.current.getFilteredExperts()
      expect(filtered).toHaveLength(1)
      expect(filtered[0].name).toBe('张三')
    })

    it('selects expert by id', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setExperts(mockExperts)
        result.current.selectExpert('expert_1')
      })

      const selected = result.current.getSelectedExpert()
      expect(selected?.id).toBe('expert_1')
    })
  })

  describe('Herb Slice', () => {
    it('sets and gets herbs', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setHerbs(mockHerbs)
      })

      expect(result.current.herbs).toEqual(mockHerbs)
    })

    it('gets herbs by ids', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setHerbs(mockHerbs)
      })

      const herbs = result.current.getHerbsByIds(['herb_1'])
      expect(herbs).toHaveLength(1)
      expect(herbs[0].name.cn).toBe('人参')
    })
  })

  describe('UI Slice', () => {
    it('sets loading state', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setLoading(true)
      })

      expect(result.current.isLoading).toBe(true)

      act(() => {
        result.current.setLoading(false)
      })

      expect(result.current.isLoading).toBe(false)
    })

    it('sets error state', () => {
      const { result } = renderHook(() => useAppStore())

      act(() => {
        result.current.setError('Test error')
      })

      expect(result.current.error).toBe('Test error')
    })

    it('toggles sidebar', () => {
      const { result } = renderHook(() => useAppStore())

      const initialState = result.current.sidebarOpen

      act(() => {
        result.current.toggleSidebar()
      })

      expect(result.current.sidebarOpen).toBe(!initialState)
    })
  })
})