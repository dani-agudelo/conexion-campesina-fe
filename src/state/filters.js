import { create } from 'zustand'

export const useFilters = create((set) => ({
  query: '',
  category: 'Todas',
  sort: 'Relevancia',

  setQuery: (query) => set({ query }),
  setCategory: (category) => set({ category }),
  setSort: (sort) => set({ sort }),
}))
