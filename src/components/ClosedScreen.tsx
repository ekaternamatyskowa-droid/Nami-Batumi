'use client'

import type { Locale } from '@/types'
import { useLocale } from '@/lib/locale-context'

/**
 * Full-screen "we're closed today" announcement.
 *
 * Reuses the existing LocaleProvider (useLocale) for language state and
 * text — no separate translation mechanism. Renders instead of the normal
 * site when NEXT_PUBLIC_SITE_CLOSED=true (see src/app/page.tsx).
 */
export function ClosedScreen() {
  const { locale, t, setLocale } = useLocale()
  const locales: Locale[] = ['ru', 'en', 'ge']
  const localeLabels: Record<Locale, string> = { ru: 'RU', en: 'EN', ge: 'ქა' }

  return (
    <main
      style={{
        minHeight: '100dvh',
        width: '100%',
        overflowX: 'hidden',
        background: 'var(--cream)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        textAlign: 'center',
      }}
    >
      {/* NAMI logo */}
      <img
        src="/images/logo-main.png"
        alt="NAMI — Inspired by Batumi"
        style={{
          width: '100%',
          maxWidth: '280px',
          height: 'auto',
          marginBottom: '40px',
        }}
      />

      {/* Language selector */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '36px',
        }}
      >
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => setLocale(loc)}
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 300,
              color: 'var(--brown)',
              opacity: locale === loc ? 1 : 0.4,
              transition: 'opacity 0.3s',
              padding: '4px 2px',
            }}
          >
            {localeLabels[loc]}
          </button>
        ))}
      </div>

      {/* Message */}
      <p
        style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontWeight: 300,
          fontSize: 'clamp(22px, 4.5vw, 32px)',
          color: 'var(--brown)',
          lineHeight: 1.5,
          maxWidth: '560px',
          margin: 0,
        }}
      >
        {t.closedScreen.line1}
        <br />
        {t.closedScreen.line2}
      </p>
    </main>
  )
}
