'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useFavoritesStore } from '@/lib/store/favoritesStore'

export function FavoriteSync() {
  const { data: session } = useSession()
  const syncFromServer = useFavoritesStore((s) => s.syncFromServer)

  useEffect(() => {
    if (!session?.user?.id) return

    // Giriş yapıldığında DB'deki favorileri local store'a aktar
    fetch('/api/favorites')
      .then((r) => r.json())
      .then((productIds: string[]) => {
        if (!Array.isArray(productIds) || productIds.length === 0) return
        // id listesinden ürün detaylarını al
        return fetch(`/api/products/by-ids`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: productIds }),
        })
          .then((r) => r.json())
          .then((products) => {
            if (Array.isArray(products)) {
              syncFromServer(productIds, products)
            }
          })
      })
      .catch(() => {})
  }, [session?.user?.id, syncFromServer])

  return null
}
