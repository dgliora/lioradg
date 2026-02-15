'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogoLioraDG } from '@/components/LogoLioraDG'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [contactInfo, setContactInfo] = useState({
    phone: '+90 530 208 47 47',
    email: 'info@lioradg.com.tr',
    address: 'İstanbul, Türkiye',
    instagram: 'https://instagram.com/dgliora',
  })

  useEffect(() => {
    fetch('/api/settings/contact', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setContactInfo(data))
      .catch(() => {})
  }, [])

  const socialLinks = [
    { icon: 'instagram', href: contactInfo.instagram },
  ]

  return (
    <footer className="bg-neutral text-warm-100">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <LogoLioraDG 
                variant="full"
                width={160}
                height={40}
                className="invert"
                showImage={true}
              />
            </div>
            <p className="text-sm leading-relaxed mb-6 text-neutral-light">
              Kişisel bakım ve temizlik kategorilerinde güvenilir, şeffaf ve erişilebilir ürünler sunuyoruz.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-rose flex items-center justify-center transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    {social.icon === 'instagram' && (
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-rose mb-5">
              Hızlı Linkler
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="text-neutral-light hover:text-rose transition-colors">Ana Sayfa</Link></li>
              <li><Link href="/hakkimizda" className="text-neutral-light hover:text-rose transition-colors">Hakkımızda</Link></li>
              <li><Link href="/iletisim" className="text-neutral-light hover:text-rose transition-colors">İletişim</Link></li>
              <li><Link href="/kampanyalar" className="text-neutral-light hover:text-rose transition-colors">Kampanyalar</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-rose mb-5">
              Müşteri Hizmetleri
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/account" className="text-neutral-light hover:text-rose transition-colors">Hesabım</Link></li>
              <li><Link href="/siparis-takip" className="text-neutral-light hover:text-rose transition-colors">Sipariş Takip</Link></li>
              <li><Link href="/iade-degisim" className="text-neutral-light hover:text-rose transition-colors">İade ve Değişim</Link></li>
              <li><Link href="/sss" className="text-neutral-light hover:text-rose transition-colors">SSS</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-rose mb-5">
              İletişim
            </h4>
            <ul className="space-y-3 text-sm text-neutral-light">
              <li>{contactInfo.address}</li>
              <li><a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="hover:text-rose transition-colors">{contactInfo.phone}</a></li>
              <li><a href={`mailto:${contactInfo.email}`} className="hover:text-rose transition-colors">{contactInfo.email}</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-light">
            <p>© {currentYear} LIORADG. Tüm hakları saklıdır.</p>
            <div className="flex gap-6">
              <Link href="/gizlilik-politikasi" className="hover:text-rose transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/kullanim-sartlari" className="hover:text-rose transition-colors">
                Kullanım Şartları
              </Link>
              <Link href="/kvkk" className="hover:text-rose transition-colors">
                KVKK Aydınlatma
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
