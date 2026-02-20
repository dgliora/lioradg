import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdminAuth } from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  try {
    const auth = await checkAdminAuth()
    if (!auth.isAdmin) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const body = await request.json()
    
    const {
      name,
      slug,
      description,
      content,
      usage,
      features,
      benefits,
      barcode,
      price,
      salePrice,
      costPrice,
      sku,
      stock,
      images,
      categoryId,
      featured,
      active,
      metaTitle: rawMetaTitle,
      metaDescription: rawMetaDescription,
    } = body

    // SEO alanları boşsa otomatik üret
    const metaTitle = rawMetaTitle?.trim() || null
    const metaDescription = rawMetaDescription?.trim() ||
      (description ? description.slice(0, 155) + (description.length > 155 ? '...' : '') : null)

    // Validasyon
    if (!name || !slug || !price || !stock || !categoryId) {
      return NextResponse.json(
        { error: 'Zorunlu alanlar eksik' },
        { status: 400 }
      )
    }

    // Slug benzersiz mi kontrol et
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Bu slug zaten kullanılıyor' },
        { status: 400 }
      )
    }

    // Ürün oluştur
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || '',
        content: content || null,
        usage: usage || null,
        features: features || null,
        benefits: benefits || null,
        barcode: barcode || null,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        metaTitle,
        metaDescription,
        sku: sku || null,
        stock: parseInt(stock),
        images: images || '/images/placeholder.jpg',
        categoryId,
        featured: featured || false,
        active: active !== false,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({ 
      success: true, 
      product 
    })

  } catch (error) {
    console.error('Product create error:', error)
    return NextResponse.json(
      { error: 'Ürün oluşturulurken hata oluştu' },
      { status: 500 }
    )
  }
}

