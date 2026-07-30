'use client'

import { useLocale } from '@/lib/locale-context'

export function Footer() {
  const { t } = useLocale()

  return (
    <footer
      style={{
        padding: '36px 60px',
        borderTop: '1px solid rgba(91,59,44,0.12)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--cream)',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: '20px',
          color: 'var(--brown)',
          opacity: 0.5,
          letterSpacing: '0.12em',
        }}
      >
        NAMI
      </span>

      {/* Decorative wave */}
      <svg width="80" height="14" viewBox="0 0 80 14" fill="none">
        <path
          d="M2 10 C10 10, 14 4, 22 4 C30 4, 34 10, 42 10 C50 10, 54 4, 62 4 C70 4, 74 10, 80 10"
          stroke="#5B3B2C"
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="round"
          opacity="0.25"
        />
      </svg>

      <span
        style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: '10px',
          color: 'var(--brown)',
          opacity: 0.35,
          letterSpacing: '0.1em',
        }}
      >
        {t.footer.copy}
      </span>

      <style>{`
        @media (max-width: 900px) {
          footer {
            padding: 20px 24px !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
            gap: 0 !important;
          }
          footer svg {
            display: none !important;
          }
        }
      `}</style>
    </footer>
  )
}
