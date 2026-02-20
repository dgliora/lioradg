import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product } from '@/types'

interface FavoritesStore {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  toggleFavorite: (product: Product, isLoggedIn: boolean) => void
  isFavorite: (productId: string) => boolean
  getTotalItems: () => number
  syncFromServer: (productIds: string[], allProducts: Product[]) => void
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

      toggleFavorite: (product, isLoggedIn) => {
        const { isFavorite, addItem, removeItem } = get()
        const alreadyFav = isFavorite(product.id)

        // Optimistic update
        if (alreadyFav) {
          removeItem(product.id)
        } else {
          addItem(product)
        }

        // DB sync for logged in users
        if (isLoggedIn) {
          fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: product.id }),
          }).catch(() => {
            // Rollback on error
            if (alreadyFav) addItem(product)
            else removeItem(product.id)
          })
        }
      },

      isFavorite: (productId) => {
        return get().items.some((item) => item.id === productId)
      },

      getTotalItems: () => {
        return get().items.length
      },

      syncFromServer: (productIds, allProducts) => {
        const products = allProducts.filter((p) => productIds.includes(p.id))
        set({ items: products })
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
