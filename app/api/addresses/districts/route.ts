import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

interface RawDistrict {
  id: string
  il_id: string
  name: string
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const provinceCode = searchParams.get('province')

    if (!provinceCode) {
      return NextResponse.json([], {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
        },
      })
    }

    const filePath = join(process.cwd(), 'public/tr-addresses/ilce.json')
    const data = readFileSync(filePath, 'utf-8')
    const jsonData = JSON.parse(data)
    
    // JSON yapısından data array'ini al
    const rawDistricts: RawDistrict[] = jsonData.find((item: any) => item.type === 'table')?.data || []
    
    // İl koduna göre filtrele ve formatla
    const districts = rawDistricts
      .filter(d => d.il_id === provinceCode)
      .map(d => ({
        code: d.id,
        name: d.name,
        provinceCode: d.il_id
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'tr'))

    return NextResponse.json(districts, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Districts API error:', error)
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
      },
    })
  }
}
