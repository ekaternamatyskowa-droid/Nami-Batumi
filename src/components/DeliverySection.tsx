'use client'

import { useLocale } from '@/lib/locale-context'

export function DeliverySection() {
  const { t } = useLocale()
  const titleLines = t.delivery.title.split('\n')
  const deliveryZones = t.delivery.zones

  return (
    <section
      id="delivery"
      style={{
        background: 'var(--cream)',
        padding: '0',
        borderTop: '1px solid rgba(91,59,44,0.08)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '40% 60%',
          minHeight: '480px',
        }}
        className="delivery-layout"
      >
        {/* Left: text */}
        <div
          className="delivery-text"
          style={{
            padding: '64px 48px 64px 72px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            background: 'var(--cream)',
            position: 'relative',
          }}
        >
          <p
            className="reveal delivery-eyebrow"
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '13px',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'var(--brown)',
              opacity: 0.85,
              marginBottom: '32px',
            }}
          >
            {t.delivery.eyebrow}
          </p>

          <h2
            className="reveal reveal-delay-1"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(46px, 5vw, 64px)',
              fontWeight: 300,
              color: 'var(--brown)',
              lineHeight: 0.95,
              marginBottom: '40px',
            }}
          >
            {titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>

          <div
            className="reveal reveal-delay-2 delivery-items"
            style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
          >
            {t.delivery.items.map((item, i) => (
              <div
                key={i}
                style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-cormorant), serif',
                    fontSize: '28px',
                    fontWeight: 300,
                    color: 'rgba(91,59,44,0.18)',
                    lineHeight: 1,
                    minWidth: '40px',
                    flexShrink: 0,
                    userSelect: 'none',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div style={{ paddingTop: '4px' }}>
                  <p
                    style={{
                      fontFamily: 'var(--font-manrope), sans-serif',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'var(--brown)',
                      marginBottom: '6px',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-manrope), sans-serif',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: 'var(--brown)',
                      opacity: 0.55,
                      lineHeight: 1.7,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal reveal-delay-3" style={{ marginTop: '40px' }}>
            <svg width="100" height="16" viewBox="0 0 100 16" fill="none">
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
        </div>

        {/* Right: map */}
        <div
          className="delivery-map"
          style={{ position: 'relative', overflow: 'hidden', minHeight: '480px' }}
        >
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=41.58,41.60,41.69,41.65&layer=mapnik&marker=41.6168,41.6367"
            style={{ width: '100%', height: '100%', border: '0' }}
            loading="lazy"
          />

          {/* Delivery zone card — hidden on mobile via CSS */}
          <div
            className="delivery-zone-card"
            style={{
              position: 'absolute',
              top: '24px',
              left: '24px',
              right: '24px',
              maxWidth: '320px',
              background: '#F3E8DA',
              padding: '20px 24px',
              boxShadow: '0 8px 32px rgba(42,38,36,0.18)',
              pointerEvents: 'none',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '10px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'var(--brown-mid)',
                opacity: 0.7,
                marginBottom: '14px',
              }}
            >
              {t.delivery.zone}
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px 16px',
                marginBottom: '16px',
              }}
            >
              {deliveryZones.map((zone) => (
                <span
                  key={zone}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '12px',
                    fontWeight: 300,
                    color: 'var(--brown)',
                  }}
                >
                  <span style={{ color: '#7a9eb0', fontSize: '11px' }}>✓</span>
                  {zone}
                </span>
              ))}
            </div>

            <p
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: '28px',
                fontWeight: 300,
                color: 'var(--brown)',
                lineHeight: 1,
              }}
            >
              {t.delivery.time}
            </p>
          </div>

          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '1px',
              height: '100%',
              background: 'rgba(91,59,44,0.1)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .delivery-layout {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
          }
          #delivery .delivery-text {
            padding: 32px 24px 24px !important;
          }
          /* "ДОСТАВКА" — эталон: как «ЭКСКЛЮЗИВНАЯ КОЛЛЕКЦИЯ» в Signature */
          #delivery .delivery-eyebrow {
            font-size: 10px !important;
            letter-spacing: 0.35em !important;
            opacity: 0.5 !important;
            margin-bottom: 10px !important;
            line-height: 1 !important;
          }
          #delivery h2 {
            margin-bottom: 20px !important;
          }
          #delivery .delivery-items {
            gap: 16px !important;
          }
          #delivery .delivery-map {
            min-height: 300px !important;
          }
          /* Скрыть карточку зоны доставки поверх карты */
          #delivery .delivery-zone-card {
            display: none !important;
          }
        }
      `}</style>
    </section>
  )
}
