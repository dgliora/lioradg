import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

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

    const filePath = join(process.cwd(), `public/tr-addresses/districts/${provinceCode}.json`)
    const data = readFileSync(filePath, 'utf-8')
    const districts = JSON.parse(data)

    return NextResponse.json(districts, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
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

