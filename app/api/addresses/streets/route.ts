import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const neighborhoodCode = searchParams.get('neighborhood')

    if (!neighborhoodCode) {
      return NextResponse.json([], {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
        },
      })
    }

    const filePath = join(process.cwd(), `public/tr-addresses/streets/${neighborhoodCode}.json`)
    const data = readFileSync(filePath, 'utf-8')
    const streets = JSON.parse(data)

    return NextResponse.json(streets, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('Streets API error:', error)
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
      },
    })
  }
}

