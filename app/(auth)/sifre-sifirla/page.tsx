'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, Input, Button } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { LogoLioraDG } from '@/components/LogoLioraDG';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      showToast('Geçersiz şifre sıfırlama bağlantısı', 'error');
      router.push('/sifremi-unuttum');
    }
  }, [searchParams, router, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast('Şifreler eşleşmiyor', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Şifre en az 6 karakter olmalı', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || 'Bir hata oluştu', 'error');
        return;
      }

      showToast('Şifreniz başarıyla güncellendi! Giriş yapabilirsiniz.', 'success');
      setTimeout(() => {
        router.push('/giris');
      }, 2000);
    } catch (error) {
      showToast('Sunucu hatası, lütfen tekrar deneyin.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <LogoLioraDG 
              variant="full"
              width={200}
              height={50}
              className="text-sage"
              showImage={true}
            />
          </Link>
          <h1 className="text-h2 font-bold text-neutral-900 mb-4">
            Yeni Şifre Belirleyin
          </h1>
          <p className="text-neutral-600">
            Hesabınız için yeni bir şifre oluşturun.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Yeni Şifre"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="En az 6 karakter"
              required
              helperText="Güçlü bir şifre seçin"
            />

            <Input
              label="Şifre Tekrar"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Şifrenizi tekrar girin"
              required
            />

            <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
              Şifreyi Güncelle
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-small text-neutral-600">
              Giriş yapmak için{' '}
              <Link href="/giris" className="text-primary hover:text-primary-hover font-medium">
                buraya tıklayın
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

