import React from 'react'
import Image from 'next/image'

interface LogoLioraDGProps {
  className?: string
  width?: number
  height?: number
  variant?: 'full' | 'icon' | 'with-tagline'
  showImage?: boolean
  /** footer gibi koyu zeminlerde true yap — logo beyaz kutu içinde gösterilir */
  darkBg?: boolean
}

export const LogoLioraDG: React.FC<LogoLioraDGProps> = ({
  className = '',
  width = 180,
  height = 50,
  variant = 'full',
  showImage = true,
  darkBg = false,
}) => {
  if (showImage) {
    const src = variant === 'icon' ? '/images/logo/dgyazisi.jpg' : '/images/logo/logo.jpg'
    const alt = variant === 'icon' ? 'LIORA DG' : 'LIORA DG — ATELIER ISTANBUL'

    const img = (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{ objectFit: 'contain', width: 'auto', height: 'auto', maxHeight: height }}
        priority
      />
    )

    // Koyu zemin: logo etrafına küçük beyaz/yarı saydam hap
    if (darkBg) {
      return (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 inline-flex items-center">
          {img}
        </div>
      )
    }

    return img
  }

  // SVG fallback
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 420 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="LIORA DG"
    >
      <title>LIORA DG</title>
      <text x="10" y="75" fontFamily="Georgia, serif" fontSize="70" fontWeight="600" fill="currentColor" letterSpacing="3">
        LIORA{' '}
      </text>
      <text x="310" y="75" fontFamily="Georgia, serif" fontSize="70" fontWeight="700" fill="currentColor" letterSpacing="-8" style={{ fontStyle: 'italic' }}>
        DG
      </text>
    </svg>
  )
}

export default LogoLioraDG
