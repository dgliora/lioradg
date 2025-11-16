import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      )
    }

    // Dosya tipini kontrol et
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Sadece resim dosyaları yüklenebilir (JPG, PNG, WEBP, GIF)' },
        { status: 400 }
      )
    }

    // Dosya boyutunu kontrol et (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Dosya boyutu 5MB\'dan küçük olmalıdır' },
        { status: 400 }
      )
    }

    // Dosya adını oluştur (benzersiz)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Benzersiz dosya adı oluştur
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-')
    const fileName = `${timestamp}-${originalName}`
    
    // Uploads klasörünü oluştur (yoksa)
    const uploadsDir = path.join(process.cwd(), 'public', 'images', 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Klasör zaten varsa hata vermez
    }

    // Dosyayı kaydet
    const filePath = path.join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    // URL'i döndür
    const imageUrl = `/images/uploads/${fileName}`

    return NextResponse.json({ 
      success: true,
      url: imageUrl,
      fileName 
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Dosya yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}

