import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Tek ürün getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: 'Ürün yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// PUT - Ürün güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const {
      name,
      slug,
      description,
      content,
      usage,
      price,
      salePrice,
      sku,
      stock,
      images,
      categoryId,
      featured,
      active,
    } = body

    // Validasyon
    if (!name || !slug || !price || !stock || !categoryId) {
      return NextResponse.json(
        { error: 'Zorunlu alanlar eksik' },
        { status: 400 }
      )
    }

    // Slug benzersiz mi kontrol et (kendi ID'si hariç)
    const existingProduct = await prisma.product.findFirst({
      where: {
        slug,
        NOT: { id: params.id },
      },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Bu slug başka bir ürün tarafından kullanılıyor' },
        { status: 400 }
      )
    }

    // Ürün güncelle
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description: description || '',
        content: content || null,
        usage: usage || null,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
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
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: 'Ürün güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE - Ürün sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Önce ürünün sipariş ilişkisi var mı kontrol et
    const orderItems = await prisma.orderItem.count({
      where: { productId: params.id },
    })

    if (orderItems > 0) {
      return NextResponse.json(
        { error: 'Bu ürün siparişlerde kullanıldığı için silinemiyor. Pasif yapabilirsiniz.' },
        { status: 400 }
      )
    }

    // Ürünü sil
    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ 
      success: true,
      message: 'Ürün başarıyla silindi' 
    })

  } catch (error) {
    console.error('Product delete error:', error)
    return NextResponse.json(
      { error: 'Ürün silinirken hata oluştu' },
      { status: 500 }
    )
  }
}

