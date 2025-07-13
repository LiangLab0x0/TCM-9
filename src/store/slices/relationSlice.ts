import type { StateCreator } from 'zustand'
import type { Relation } from '../../core/entities'

export interface RelationSlice {
  relations: Relation[]

  // Actions
  setRelations: (relations: Relation[]) => void

  // Selectors
  getRelationsByExpert: (expertId: string) => Relation[]
  getRelationsByHerb: (herbId: string) => Relation[]
  getRelationsByType: (type: Relation['type']) => Relation[]
  getExpertHerbRelations: (expertId: string) => string[] // Returns herb IDs
  getHerbExpertRelations: (herbId: string) => string[] // Returns expert IDs
}

export const createRelationSlice: StateCreator<RelationSlice> = (set, get) => ({
  relations: [],

  setRelations: (relations) => set({ relations }),

  getRelationsByExpert: (expertId) => {
    const { relations } = get()
    return relations.filter((rel) => rel.fromId === expertId || rel.toId === expertId)
  },

  getRelationsByHerb: (herbId) => {
    const { relations } = get()
    return relations.filter((rel) => rel.fromId === herbId || rel.toId === herbId)
  },

  getRelationsByType: (type) => {
    const { relations } = get()
    return relations.filter((rel) => rel.type === type)
  },

  getExpertHerbRelations: (expertId) => {
    const { relations } = get()
    return relations
      .filter((rel) => rel.type === 'EXPERT_RECOMMENDS_HERB' && rel.fromId === expertId)
      .map((rel) => rel.toId)
  },

  getHerbExpertRelations: (herbId) => {
    const { relations } = get()
    return relations
      .filter((rel) => rel.type === 'EXPERT_RECOMMENDS_HERB' && rel.toId === herbId)
      .map((rel) => rel.fromId)
  },
})
