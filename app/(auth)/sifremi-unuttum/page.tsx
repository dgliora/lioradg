'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, Input, Button } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { LogoLioraDG } from '@/components/LogoLioraDG';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || 'Bir hata oluştu', 'error');
        return;
      }

      showToast('Şifre sıfırlama emaili gönderildi. Lütfen e-posta kutunuzu kontrol edin.', 'success');
      router.push('/giris');
    } catch (error) {
      showToast('Sunucu hatası, lütfen tekrar deneyin.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Şifrenizi Sıfırlayın
          </h1>
          <p className="text-neutral-600">
            E-posta adresinizi girin, size yeni şifre belirleme linki göndereceğiz.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="E-posta Adresi"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
            />

            <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
              Email Gönder
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
