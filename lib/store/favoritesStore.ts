import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product } from '@/types'

interface FavoritesStore {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isFavorite: (productId: string) => boolean
  getTotalItems: () => number
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const exists = state.items.find((item) => item.id === product.id)
          if (exists) return state
          return { items: [...state.items, product] }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }))
      },

      isFavorite: (productId) => {
        return get().items.some((item) => item.id === productId)
      },

      getTotalItems: () => {
        return get().items.length
      },
    }),
    {
      name: 'liora-favorites-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
    }
  )
)

