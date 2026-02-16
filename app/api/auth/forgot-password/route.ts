import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { sendResetEmail } from '@/lib/email';
import { checkRateLimit, getClientIdentifier } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const id = getClientIdentifier(req);
  const { ok, retryAfter } = checkRateLimit(id, 'forgot-password');
  if (!ok) {
    return NextResponse.json(
      { error: 'Çok fazla deneme. Lütfen bir süre sonra tekrar deneyin.' },
      { status: 429, headers: retryAfter ? { 'Retry-After': String(retryAfter) } : {} }
    );
  }
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email adresi gerekli' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    // Token üret (1 saat expire)
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 saat

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Email gönder (kullanıcı adıyla personalize)
    const emailResult = await sendResetEmail(email, resetToken, user.name);
    
    if (!emailResult.success) {
      return NextResponse.json({ error: 'Email gönderilemedi' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Şifre sıfırlama emaili gönderildi. Lütfen e-posta kutunuzu kontrol edin.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
