'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/lib/store/cartStore'

export function CartSync() {
  const { data: session } = useSession()
  const items = useCartStore((s) => s.items)
  const syncTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!session?.user?.id) return

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
