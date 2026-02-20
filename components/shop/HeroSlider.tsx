'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface HeroSliderProps {
  images: string[]
  autoPlay?: boolean
  interval?: number
}

export function HeroSlider({ images, autoPlay = true, interval = 5000 }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval, images.length])

  if (images.length === 0) {
    return (
      <div className="relative rounded-card overflow-hidden bg-warm-50" style={{ aspectRatio: '4/5' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-16">
            <div className="text-6xl mb-6">🌿</div>
            <p className="text-2xl font-serif font-semibold text-neutral">Premium Doğal Bakım</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative rounded-card overflow-hidden group bg-white shadow-hover" style={{ aspectRatio: '4/5' }}>
      {/* Slider Images */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image}
              alt={`Slider ${index + 1}`}
              fill
              sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 600px"
              className="object-contain"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-neutral rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-soft"
            aria-label="Önceki fotoğraf"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-neutral rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-soft"
            aria-label="Sonraki fotoğraf"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-sage w-6' : 'bg-sage/30 w-2'
              }`}
              aria-label={`Fotoğraf ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
