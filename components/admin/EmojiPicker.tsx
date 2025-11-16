'use client'

import { useState } from 'react'

interface EmojiPickerProps {
  value: string
  onChange: (emoji: string) => void
}

const EMOJI_CATEGORIES = [
  {
    name: 'Doğa & Bitkiler',
    emojis: ['🌸', '🌺', '🌻', '🌹', '🌷', '🌿', '🍃', '🌾', '🌱', '🪴', '🌵', '🍀']
  },
  {
    name: 'Kozmetik & Bakım',
    emojis: ['💄', '💅', '💆', '💇', '🧴', '🧼', '🧽', '🧹', '🪥', '🪒', '✨', '💎']
  },
  {
    name: 'Koku & Parfüm',
    emojis: ['🌬️', '💐', '🕯️', '🧯', '🎋', '🎍', '💮', '🏵️', '🌼', '🥀']
  },
  {
    name: 'Ev & Yaşam',
    emojis: ['🏠', '🏡', '🛋️', '🛏️', '🪑', '🚪', '🪟', '🧺', '🧻', '🔔', '💡', '🕯️']
  },
  {
    name: 'Sağlık & Wellness',
    emojis: ['💚', '❤️', '🧡', '💛', '💙', '💜', '🤍', '💖', '💗', '💓', '💝', '🎀']
  },
  {
    name: 'Hediye & Kampanya',
    emojis: ['🎁', '🎀', '🎉', '🎊', '🎈', '🏆', '🥇', '🥈', '🥉', '⭐', '🌟', '✨']
  },
  {
    name: 'Diğer',
    emojis: ['💧', '🔥', '⚡', '☀️', '🌙', '⭐', '🌈', '☁️', '❄️', '🌊', '🍂', '🎨']
  }
]

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(0)

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        İkon (Emoji)
      </label>
      
      {/* Seçili Emoji */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-sage focus:ring-2 focus:ring-sage focus:border-transparent transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          {value ? (
            <>
              <span className="text-3xl">{value}</span>
              <span className="text-gray-600">Emoji seçildi</span>
            </>
          ) : (
            <span className="text-gray-400">Emoji seç (opsiyonel)</span>
          )}
        </div>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Emoji Picker Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          {/* Kategori Sekmeleri */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {EMOJI_CATEGORIES.map((category, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedCategory(index)}
                className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === index
                    ? 'bg-sage text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
            {EMOJI_CATEGORIES[selectedCategory].emojis.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onChange(emoji)
                  setIsOpen(false)
                }}
                className={`text-3xl p-2 rounded-lg hover:bg-sage/10 transition-all ${
                  value === emoji ? 'bg-sage/20 ring-2 ring-sage' : ''
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Temizle & Kapat */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange('')
                  setIsOpen(false)
                }}
                className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
              >
                Temizle
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

