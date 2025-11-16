'use client'

import { useState } from 'react'

interface MobileFilterButtonProps {
  onClick: () => void
  activeFiltersCount?: number
}

export function MobileFilterButton({ onClick, activeFiltersCount = 0 }: MobileFilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed bottom-24 right-4 z-30 bg-sage text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 font-medium text-sm active:scale-95 transition-transform hover:shadow-xl"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
      <span>Filtrele</span>
      {activeFiltersCount > 0 && (
        <span className="bg-white text-sage w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center">
          {activeFiltersCount}
        </span>
      )}
    </button>
  )
}

