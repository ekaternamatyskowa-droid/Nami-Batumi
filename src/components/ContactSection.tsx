'use client'

import { useLocale } from '@/lib/locale-context'

export function ContactSection() {
  const { t } = useLocale()
  const titleLines = t.contact.title.split('\n')

  return (
    <section
      id="contact"
      style={{
        padding: '32px 60px 120px',
        background: 'var(--cream)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: '1300px' }}>
        {/* Header row */}
        <div
          className="contact-header flex justify-between items-end"
          style={{ marginBottom: '64px', gap: '24px', flexWrap: 'wrap' }}
        >
          <p
            className="reveal contact-eyebrow"
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '13px',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'var(--brown)',
              opacity: 0.85,
              margin: 0,
            }}
          >
            {t.contact.eyebrow}
          </p>

          <p
            className="reveal reveal-delay-1 contact-tagline"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontStyle: 'italic',
              fontSize: '18px',
              color: 'var(--brown)',
              opacity: 0.75,
              lineHeight: 1.8,
              textAlign: 'right',
              maxWidth: '320px',
              margin: 0,
            }}
          >
            {t.contact.tagline}
          </p>
        </div>

        {/* Main heading */}
        <div style={{ textAlign: 'center' }}>
          <h2
            className="reveal reveal-delay-1 contact-title"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(54px, 5vw, 72px)',
              fontWeight: 300,
              lineHeight: 0.9,
              color: 'var(--brown)',
              marginBottom: '24px',
            }}
          >
            {titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>

          <p
            className="reveal reveal-delay-2 contact-subtitle"
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '14px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--brown)',
              opacity: 0.6,
              marginBottom: '0',
            }}
          >
            {t.contact.sub}
          </p>

          {/* Decorative wave */}
          <div className="reveal reveal-delay-2 contact-wave" style={{ margin: '40px auto 48px' }}>
            <svg width="100" height="16" viewBox="0 0 100 16" fill="none" style={{ display: 'block', margin: '0 auto' }}>
              <path
                d="M2 12 C12 12, 16 4, 26 4 C36 4, 40 12, 50 12 C60 12, 64 4, 74 4 C84 4, 88 12, 98 12"
                stroke="#5B3B2C"
                strokeWidth="0.8"
                fill="none"
                strokeLinecap="round"
                opacity="0.3"
              />
            </svg>
          </div>

          {/* Contact cards */}
          <div
            className="contact-cards reveal reveal-delay-2"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: '40px',
              flexWrap: 'wrap',
              marginBottom: '64px',
            }}
          >
            {/* Instagram */}
            <a
              href="https://instagram.com/nami.batumi"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
              style={{
                width: '120px',
                height: '120px',
                border: '1px solid rgba(91,59,44,0.12)',
                background: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                textDecoration: 'none',
                color: 'var(--brown)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'rgba(91,59,44,0.03)'
                el.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'transparent'
                el.style.transform = 'translateY(0)'
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5B3B2C" strokeWidth="1">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.3" cy="6.7" r="0.9" fill="#5B3B2C" stroke="none" />
              </svg>
              <span
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  opacity: 0.6,
                }}
              >
                {t.contact.instagram}
              </span>
            </a>

            {/* Phone */}
            <a
              href="tel:+99500000000"
              className="contact-card"
              style={{
                width: '120px',
                height: '120px',
                border: '1px solid rgba(91,59,44,0.12)',
                background: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                textDecoration: 'none',
                color: 'var(--brown)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'rgba(91,59,44,0.03)'
                el.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'transparent'
                el.style.transform = 'translateY(0)'
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5B3B2C" strokeWidth="1">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
              </svg>
              <span
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  opacity: 0.6,
                }}
              >
                {t.contact.phone}
              </span>
            </a>
          </div>

          {/* Main CTA */}
          <a
            href="#menu"
            className="reveal reveal-delay-3 contact-cta"
            style={{
              display: 'inline-block',
              border: '1px solid var(--brown)',
              background: 'transparent',
              color: 'var(--brown)',
              padding: '20px 64px',
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '11px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'var(--brown)'
              el.style.color = 'var(--cream)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'transparent'
              el.style.color = 'var(--brown)'
            }}
          >
            {t.contact.cta}
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #contact {
            padding: 24px 24px 40px !important;
          }
          #contact .contact-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            margin-bottom: 16px !important;
            gap: 0 !important;
          }
          /* "КОНТАКТЫ" — эталон: как «ЭКСКЛЮЗИВНАЯ КОЛЛЕКЦИЯ» в Signature */
          #contact .contact-eyebrow {
            font-size: 10px !important;
            letter-spacing: 0.35em !important;
            opacity: 0.5 !important;
            margin-bottom: 10px !important;
            line-height: 1 !important;
          }
          #contact .contact-tagline {
            display: none !important;
          }
          #contact .contact-title {
            font-size: clamp(28px, 8vw, 40px) !important;
            margin-bottom: 14px !important;
            line-height: 1 !important;
          }
          #contact .contact-subtitle {
            font-size: 10px !important;
            margin-bottom: 0 !important;
          }
          #contact .contact-wave {
            margin: 14px auto 14px !important;
          }
          #contact .contact-cards {
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            gap: 10px !important;
            justify-content: center !important;
            margin-bottom: 22px !important;
          }
          #contact .contact-card {
            width: auto !important;
            height: auto !important;
            flex: 1 !important;
            max-width: 96px !important;
            padding: 12px 6px !important;
            gap: 7px !important;
          }
          #contact .contact-card svg {
            width: 19px !important;
            height: 19px !important;
          }
          #contact .contact-card span {
            font-size: 7px !important;
          }
          #contact .contact-cta {
            padding: 12px 28px !important;
            font-size: 9px !important;
            letter-spacing: 0.2em !important;
          }
        }
      `}</style>
    </section>
  )
}
