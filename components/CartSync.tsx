'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/lib/store/cartStore'

export function CartSync() {
  const { data: session } = useSession()
  const items = useCartStore((s) => s.items)
  const setItems = useCartStore((s) => s.setItems)
  const syncTimer = useRef<NodeJS.Timeout | null>(null)
  const loadedForUser = useRef<string | null>(null)
  const isSyncing = useRef(false)

  // Giriş yapıldığında (veya yeni sekme/gizli sekme): DB'den sepeti yükle
  useEffect(() => {
    const userId = session?.user?.id
    if (!userId || loadedForUser.current === userId) return

    loadedForUser.current = userId

    fetch('/api/cart/sync')
      .then((r) => r.json())
      .then(({ items: serverItems }) => {
        if (!Array.isArray(serverItems) || serverItems.length === 0) return

        // Yerel sepet boşsa direkt DB'dekini yükle
        // Yerel sepet doluysa: DB'deki ürünleri yerel ile birleştir (yerel öncelikli)
        const localItems = useCartStore.getState().items
        if (localItems.length === 0) {
          isSyncing.current = true
          setItems(serverItems)
          setTimeout(() => { isSyncing.current = false }, 100)
        } else {
          // Merge: DB'de olup local'de olmayanları ekle
          const merged = [...localItems]
          for (const serverItem of serverItems) {
            const exists = merged.find((i) => i.product.id === serverItem.product.id)
            if (!exists) merged.push(serverItem)
          }
          if (merged.length > localItems.length) {
            isSyncing.current = true
            setItems(merged)
            setTimeout(() => { isSyncing.current = false }, 100)
          }
        }
      })
      .catch(() => {})
  }, [session?.user?.id, setItems])

  // Sepet değişince DB'ye kaydet (debounced)
  useEffect(() => {
    if (!session?.user?.id || isSyncing.current) return

    if (syncTimer.current) clearTimeout(syncTimer.current)

    syncTimer.current = setTimeout(() => {
      const syncItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.salePrice || item.product.price,
      }))

      fetch('/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: syncItems }),
      }).catch(() => {})
    }, 1500)

    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current)
    }
  }, [items, session?.user?.id])

  return null
}
