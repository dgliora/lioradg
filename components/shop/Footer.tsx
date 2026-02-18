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

      {/* Ödeme Yöntemleri */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-light">Güvenli Ödeme Yöntemleri</p>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {/* Visa */}
              <div className="bg-white rounded-md px-3 py-1.5 flex items-center">
                <svg viewBox="0 0 780 500" className="h-5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="780" height="500" rx="40" fill="white"/>
                  <path d="M293.2 348.73L321.82 152.12H366.72L338.08 348.73H293.2Z" fill="#00579F"/>
                  <path d="M524.28 156.07C515.24 152.54 500.93 148.71 483.07 148.71C438.72 148.71 407.12 171.59 406.9 204.88C406.67 229.71 429.84 243.55 447.41 251.85C465.42 260.35 471.46 265.74 471.39 273.28C471.28 284.97 457.27 290.26 444.17 290.26C425.81 290.26 416.07 287.63 400.96 281.03L395.04 278.32L388.6 319.12C399.19 323.73 418.79 327.71 439.14 327.91C486.36 327.91 517.34 305.3 517.67 269.81C517.84 250.27 506.04 235.27 480.64 222.88C464.37 214.79 454.51 209.45 454.61 201.43C454.61 194.28 462.88 186.64 480.96 186.64C496.21 186.41 507.4 189.83 516.1 193.36L520.32 195.29L526.58 155.77L524.28 156.07Z" fill="#00579F"/>
                  <path d="M640.81 152.12H606.38C595.86 152.12 588.01 155.12 583.47 165.91L517.04 348.72H564.22C564.22 348.72 571.83 328.16 573.55 323.53C578.63 323.53 624.48 323.6 631.01 323.6C632.35 329.5 636.46 348.72 636.46 348.72H678.05L640.81 152.12ZM586.43 288.06C590.06 278.4 604.45 239.49 604.45 239.49C604.22 239.86 607.97 229.86 610.12 223.78L612.97 238.13C612.97 238.13 621.42 277.95 623.1 288.06H586.43V288.06Z" fill="#00579F"/>
                  <path d="M236.27 152.12L192.32 279.23L187.57 255.81C179.37 228.89 153.72 199.55 124.99 185.01L165.15 348.62H212.68L284.86 152.12H236.27V152.12Z" fill="#00579F"/>
                  <path d="M151.23 152.12H77.25L76.62 155.54C133.73 169.73 172.06 203.14 187.57 255.82L171.79 166.11C169.12 155.57 161.42 152.47 151.23 152.12Z" fill="#FAA61A"/>
                </svg>
              </div>
              {/* Mastercard */}
              <div className="bg-white rounded-md px-3 py-1.5 flex items-center">
                <svg viewBox="0 0 131.39 86.9" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
                  <rect width="131.39" height="86.9" rx="8" fill="white"/>
                  <circle cx="49.75" cy="43.45" r="32.45" fill="#EB001B"/>
                  <circle cx="81.64" cy="43.45" r="32.45" fill="#F79E1B"/>
                  <path d="M65.7 19.2A32.36 32.36 0 0 1 81.64 43.45 32.36 32.36 0 0 1 65.7 67.7a32.36 32.36 0 0 1-15.95-24.25A32.36 32.36 0 0 1 65.7 19.2z" fill="#FF5F00"/>
                </svg>
              </div>
              {/* iyzico */}
              <div className="bg-white rounded-md px-3 py-1.5 flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="#00A86B"/>
                </svg>
                <span className="text-xs font-bold text-[#00A86B]">iyzico</span>
              </div>
              {/* SSL */}
              <div className="bg-white rounded-md px-3 py-1.5 flex items-center gap-1.5">
                <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <span className="text-xs font-bold text-green-600">SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-light">
            <p>© {currentYear} LIORADG. Tüm hakları saklıdır.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/gizlilik-politikasi" className="hover:text-rose transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/kullanim-sartlari" className="hover:text-rose transition-colors">
                Kullanım Şartları
              </Link>
              <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-rose transition-colors">
                Mesafeli Satış Sözleşmesi
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
