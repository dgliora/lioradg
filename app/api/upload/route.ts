import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/auth-server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const auth = await checkAdminAuth()
    if (!auth.isAdmin) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Sadece resim dosyaları yüklenebilir (JPG, PNG, WEBP, GIF)' },
        { status: 400 }
      )
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Dosya boyutu 5MB\'dan küçük olmalıdır' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase()
    const fileName = `uploads/${timestamp}-${originalName}`

    const { error } = await supabaseAdmin.storage
      .from('products')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json({ error: 'Dosya yüklenirken hata oluştu' }, { status: 500 })
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from('products')
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      fileName,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Dosya yüklenirken hata oluştu' }, { status: 500 })
  }
}
