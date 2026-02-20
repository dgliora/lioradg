'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { motion } from 'framer-motion'
import { Parallax } from 'react-scroll-parallax'
import { HeroSlider } from './HeroSlider'

export function Hero() {
  const [sliderData, setSliderData] = useState<{
    images: string[]
    autoPlay: boolean
    interval: number
  }>({ images: [], autoPlay: true, interval: 5000 })

  useEffect(() => {
    fetch('/api/settings/hero-slider')
      .then((res) => res.json())
      .then((data) => setSliderData(data))
      .catch(() => {})
  }, [])

  return (
    <section className="relative min-h-[70vh] lg:min-h-screen flex items-center gradient-hero overflow-hidden">
      {/* Parallax Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Parallax speed={-10} className="absolute top-20 right-20 w-96 h-96">
          <div className="w-full h-full bg-sage/10 rounded-full blur-3xl" />
        </Parallax>
        <Parallax speed={-5} className="absolute bottom-20 left-20 w-96 h-96">
          <div className="w-full h-full bg-rose/10 rounded-full blur-3xl" />
        </Parallax>
      </div>

      <div className="container mx-auto px-4 relative z-10 py-10 lg:py-0">
        <div className="max-w-container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center">

            {/* Mobil: Slider önce göster */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="lg:hidden"
            >
              <HeroSlider
                images={sliderData.images}
                autoPlay={sliderData.autoPlay}
                interval={sliderData.interval}
              />
            </motion.div>

            {/* Sol: İçerik */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-block mb-4 lg:mb-6"
              >
                <span className="inline-block px-5 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-sage border border-sage/20">
                  ✨ Premium Bitkisel Kozmetik
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-[2rem] sm:text-[2.8rem] lg:text-hero font-serif font-bold mb-5 lg:mb-8 text-neutral leading-tight"
              >
                Doğanın Gücü,
                <br />
                <span className="text-sage">Cildinizde</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-base lg:text-body-large text-neutral-medium mb-8 lg:mb-12 max-w-xl mx-auto lg:mx-0"
              >
                %100 organik ve bitkisel içeriklerle formüle edilmiş premium cilt bakım ürünleri.
                Doğal güzelliğinizi ortaya çıkarın.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start"
              >
                <Link href="/urunler/bitkisel-yaglar">
                  <Button size="lg" className="w-full sm:min-w-[200px]">
                    Ürünleri Keşfet
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Button>
                </Link>
                <Link href="/hakkimizda">
                  <Button size="lg" variant="secondary" className="w-full sm:min-w-[200px]">
                    Hikayemiz
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="mt-8 lg:mt-16 flex flex-wrap gap-4 lg:gap-8 justify-center lg:justify-start"
              >
                {['Ücretsiz Kargo', 'Doğal İçerik', 'Güvenli Ödeme'].map((badge) => (
                  <div key={badge} className="flex items-center gap-2 text-sm text-neutral-medium">
                    <svg className="w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{badge}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Sağ: Slider (sadece desktop) */}
            <Parallax speed={5} className="relative hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <HeroSlider
                  images={sliderData.images}
                  autoPlay={sliderData.autoPlay}
                  interval={sliderData.interval}
                />
              </motion.div>
            </Parallax>

          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-neutral-medium uppercase tracking-wider">Kaydır</span>
          <svg className="w-6 h-6 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </section>
  )
}
