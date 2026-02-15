import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

interface RawProvince {
  id: string
  name: string
}

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public/tr-addresses/il.json')
    const data = readFileSync(filePath, 'utf-8')
    const jsonData = JSON.parse(data)
    
    // JSON yapısından data array'ini al
    const rawProvinces: RawProvince[] = jsonData.find((item: any) => item.type === 'table')?.data || []
    
    // İlleri alfabetik sırala ve format dönüştür
    const provinces = rawProvinces
      .filter(p => !p.name.includes('KIBRIS')) // Kıbrıs'ı hariç tut
      .map(p => ({
        code: p.id,
        name: p.name
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'tr'))

    return NextResponse.json(provinces, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Provinces API error:', error)
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
      },
    })
  }
}
