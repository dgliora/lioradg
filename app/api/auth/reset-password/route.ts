import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { checkRateLimit, getClientIdentifier } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const id = getClientIdentifier(req);
  const { ok, retryAfter } = checkRateLimit(id, 'reset-password');
  if (!ok) {
    return NextResponse.json(
      { error: 'Çok fazla deneme. Lütfen bir süre sonra tekrar deneyin.' },
      { status: 429, headers: retryAfter ? { 'Retry-After': String(retryAfter) } : {} }
    );
  }
  try {
    const { token, newPassword } = await req.json();
    
    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token ve yeni şifre gerekli' }, { status: 400 });
    }

    // Şifre validasyonu (minimum 6 karakter)
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Şifre en az 6 karakter olmalı' }, { status: 400 });
    }

    // Token'ı bul
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date(), // Token süresi geçmemiş olmalı
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş token' }, { status: 400 });
    }

    // Yeni şifreyi hash'le ve güncelle
    const hashedPassword = await hashPassword(newPassword);
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null, // Token'ı sıfırla
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: 'Şifreniz başarıyla güncellendi' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

