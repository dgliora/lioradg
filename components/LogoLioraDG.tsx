import React from 'react'
import Image from 'next/image'

interface LogoLioraDGProps {
  className?: string
  width?: number
  height?: number
  variant?: 'full' | 'icon' | 'with-tagline' // full: LIORA DG, icon: sadece DG, with-tagline: ATELIER ISTANBUL ile
  showImage?: boolean // true ise gerçek logo görselini kullan (JPG/PNG), false ise SVG
}

export const LogoLioraDG: React.FC<LogoLioraDGProps> = ({
  className = '',
  width = 180,
  height = 50,
  variant = 'full',
  showImage = true
}) => {
  // Gerçek logo görselini kullan (JPG/PNG)
  if (showImage) {
    if (variant === 'with-tagline') {
      return (
        <Image
          src="/images/logo/logo.jpg"
          alt="LIORA DG - ATELIER ISTANBUL"
          width={width}
          height={height}
          className={className}
          style={{ objectFit: 'contain', width: 'auto', height: 'auto' }}
          priority
        />
      )
    }
    
    if (variant === 'icon') {
      return (
        <Image
          src="/images/logo/dgyazisi.jpg"
          alt="LIORA DG"
          width={width}
          height={height}
          className={className}
          style={{ objectFit: 'contain', width: 'auto', height: 'auto' }}
          priority
        />
      )
    }

    // full variant
    return (
      <Image
        src="/images/logo/dgyazisi.jpg"
        alt="LIORA DG"
        width={width}
        height={height}
        className={className}
        style={{ objectFit: 'contain', width: 'auto', height: 'auto' }}
        priority
      />
    )
  }

  // SVG fallback (eğer showImage=false)
  if (variant === 'icon') {
    // Sadece DG iç içe harf (favicon için)
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="LIORA DG"
      >
        <title>DG</title>
        {/* DG iç içe tasarım - gerçek logo'dan esinlenildi */}
        <text
          x="50"
          y="75"
          fontFamily="Georgia, serif"
          fontSize="80"
          fontWeight="700"
          fill="currentColor"
          letterSpacing="-8"
          style={{ fontStyle: 'italic' }}
        >
          DG
        </text>
      </svg>
    )
  }

  // Full logo: LIORA DG (SVG)
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
      
      {/* LIORA DG - serif, zarif, DG iç içe */}
      <text
        x="10"
        y="75"
        fontFamily="Georgia, serif"
        fontSize="70"
        fontWeight="600"
        fill="currentColor"
        letterSpacing="3"
      >
        LIORA{' '}
      </text>
      <text
        x="310"
        y="75"
        fontFamily="Georgia, serif"
        fontSize="70"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="-8"
        style={{ fontStyle: 'italic' }}
      >
        DG
      </text>
    </svg>
  )
}

export default LogoLioraDG

