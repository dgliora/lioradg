'use client'

import { useState, useEffect } from 'react'

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number }

function calcTimeLeft(endDate: string): TimeLeft | null {
  const diff = new Date(endDate).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

function Box({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 min-w-[64px] text-center shadow-inner">
        <span className="text-3xl sm:text-4xl font-bold font-mono tabular-nums leading-none">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs mt-1.5 font-medium opacity-80 uppercase tracking-wide">{label}</span>
    </div>
  )
}

export function CampaignCountdown({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calcTimeLeft(endDate))

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(calcTimeLeft(endDate)), 1000)
    return () => clearInterval(t)
  }, [endDate])

  if (!timeLeft) {
    return (
      <div className="text-center py-2 text-sm font-semibold opacity-70">
        Kampanya sona erdi
      </div>
    )
  }

  return (
    <div className="flex items-end gap-2 sm:gap-3 justify-center">
      <Box value={timeLeft.days} label="Gün" />
      <span className="text-2xl font-bold mb-3 opacity-60">:</span>
      <Box value={timeLeft.hours} label="Saat" />
      <span className="text-2xl font-bold mb-3 opacity-60">:</span>
      <Box value={timeLeft.minutes} label="Dakika" />
      <span className="text-2xl font-bold mb-3 opacity-60">:</span>
      <Box value={timeLeft.seconds} label="Saniye" />
    </div>
  )
}

// Popup için küçük versiyon
export function CampaignCountdownSmall({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calcTimeLeft(endDate))

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(calcTimeLeft(endDate)), 1000)
    return () => clearInterval(t)
  }, [endDate])

  if (!timeLeft) return <span className="text-red-500 font-semibold text-xs">Sona erdi</span>

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 2

  return (
    <div className={`flex items-center gap-1.5 ${isUrgent ? 'text-red-500' : 'text-orange-500'}`}>
      {timeLeft.days > 0 && (
        <span className="font-mono font-bold text-sm">{timeLeft.days}g</span>
      )}
      <span className="font-mono font-bold text-sm">{String(timeLeft.hours).padStart(2,'0')}s</span>
      <span className="font-mono font-bold text-sm opacity-50">:</span>
      <span className="font-mono font-bold text-sm">{String(timeLeft.minutes).padStart(2,'0')}d</span>
      <span className="font-mono font-bold text-sm opacity-50">:</span>
      <span className="font-mono font-bold text-sm">{String(timeLeft.seconds).padStart(2,'0')}sn</span>
    </div>
  )
}
