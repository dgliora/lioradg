import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

interface RawNeighborhood {
  id: string
  ilce_id: string
  name: string
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const districtCode = searchParams.get('district')

    if (!districtCode) {
      return NextResponse.json([], {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
        },
      })
    }

    const filePath = join(process.cwd(), 'public/tr-addresses/koy.json')
    const data = readFileSync(filePath, 'utf-8')
    const jsonData = JSON.parse(data)
    
    // JSON yapısından data array'ini al
    const rawNeighborhoods: RawNeighborhood[] = jsonData.find((item: any) => item.type === 'table')?.data || []
    
    // İlçe koduna göre filtrele ve formatla
    const neighborhoods = rawNeighborhoods
      .filter(n => n.ilce_id === districtCode)
      .map(n => {
        // "MERKEZ-KÖYADI" formatını sadece "KÖYADI" olarak düzenle
        let name = n.name
        if (name.startsWith('MERKEZ-')) {
          name = name.replace('MERKEZ-', '')
        }
        
        return {
          code: n.id,
          name: name,
          districtCode: n.ilce_id,
          postalCode: '' // Posta kodu verisi yok
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'tr'))

    return NextResponse.json(neighborhoods, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Neighborhoods API error:', error)
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
      },
    })
  }
}
