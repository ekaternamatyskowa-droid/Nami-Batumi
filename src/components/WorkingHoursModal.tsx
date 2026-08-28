'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/lib/locale-context'
import { useCart } from '@/lib/cart-context'

const SESSION_KEY = 'nami_hours_modal_shown'
const BATUMI_TIME_ZONE = 'Asia/Tbilisi' // Georgia — no DST, matches Batumi local time
const OPEN_HOUR = 15
const CLOSE_HOUR = 23

/**
 * Reads the current hour in Batumi local time regardless of the visitor's
 * own device timezone, using the Intl API (no extra date library needed).
 */
function getBatumiHour(): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: BATUMI_TIME_ZONE,
    hour: '2-digit',
    hour12: false,
  }).formatToParts(new Date())

  const hourPart = parts.find((p) => p.type === 'hour')?.value ?? '0'
  // Some environments format midnight as "24" — normalize to 0.
  return parseInt(hourPart, 10) % 24
}

function isWithinWorkingHours(hour: number): boolean {
  return hour >= OPEN_HOUR && hour < CLOSE_HOUR
}

export function WorkingHoursModal() {
  const { t } = useLocale()
  const { openCart } = useCart()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only ever show once per browser tab session.
    if (sessionStorage.getItem(SESSION_KEY)) return

    const hour = getBatumiHour()
    if (!isWithinWorkingHours(hour)) {
      setVisible(true)
      sessionStorage.setItem(SESSION_KEY, '1')
    }
  }, [])

  function close() {
    setVisible(false)
  }

  function handleOrderClick() {
    setVisible(false)
    openCart()
  }

  if (!visible) return null

  return (
    <div
      className="working-hours-overlay"
      onClick={close}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 700,
        background: 'rgba(42,38,36,0.55)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'modalFadeIn 0.3s ease',
      }}
    >
      <div
        className="working-hours-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t.workingHours.title}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          background: 'var(--cream)',
          borderTop: '3px solid var(--blue)',
          padding: '40px 32px',
          textAlign: 'center',
          animation: 'modalSlideUp 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
      >
        <button
          onClick={close}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            width: '32px',
            height: '32px',
            background: 'transparent',
            border: 'none',
            color: 'var(--brown)',
            cursor: 'pointer',
            fontSize: '20px',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ×
        </button>

        <p
          style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '10px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--blue)',
            marginBottom: '16px',
          }}
        >
          NAMI · Batumi
        </p>

        <h3
          style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontSize: 'clamp(24px, 5vw, 30px)',
            fontWeight: 500,
            color: 'var(--brown)',
            margin: '0 0 14px',
            lineHeight: 1.2,
          }}
        >
          {t.workingHours.title}
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '14px',
            lineHeight: 1.6,
            color: 'var(--brown)',
            opacity: 0.85,
            margin: '0 0 28px',
          }}
        >
          {t.workingHours.body}
        </p>

        <button
          onClick={handleOrderClick}
          style={{
            background: 'var(--brown)',
            color: 'var(--cream)',
            border: 'none',
            padding: '14px 28px',
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'opacity 0.3s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
        >
          {t.workingHours.cta}
        </button>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (max-width: 480px) {
          .working-hours-panel {
            padding: 32px 22px !important;
          }
        }
      `}</style>
    </div>
  )
}
