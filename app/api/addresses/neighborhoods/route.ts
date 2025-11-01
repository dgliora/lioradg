import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

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

    const filePath = join(process.cwd(), `public/tr-addresses/neighborhoods/${districtCode}.json`)
    const data = readFileSync(filePath, 'utf-8')
    const neighborhoods = JSON.parse(data)

    return NextResponse.json(neighborhoods, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
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

