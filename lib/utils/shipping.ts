/**
 * Aktif ücretsiz kargo kampanyalarını kontrol eder ve kargo ücretini hesaplar
 */
export async function calculateShippingFee(cartTotal: number): Promise<number> {
  const defaultShippingFee = 89.90

  try {
    // Aktif kampanyaları getir (detaylı bilgi ile)
    const response = await fetch('/api/campaigns/check-shipping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartTotal }),
      cache: 'no-store'
    })

    if (!response.ok) {
      return defaultShippingFee
    }

    const data = await response.json()
    return data.freeShipping ? 0 : defaultShippingFee
  } catch (error) {
    console.error('Kargo ücreti hesaplanırken hata:', error)
    return defaultShippingFee
  }
}

