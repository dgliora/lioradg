import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public/tr-addresses/provinces.json')
    const data = readFileSync(filePath, 'utf-8')
    const provinces = JSON.parse(data)

    return NextResponse.json(provinces, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
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

