'use client'

import { useEffect } from 'react'
import { useLocale } from '@/lib/locale-context'
import { useCart } from '@/lib/cart-context'
import type { MenuItem } from '@/types'

interface ProductModalProps {
  item: MenuItem | null
  onClose: () => void
}

export function ProductModal({ item, onClose }: ProductModalProps) {
  const { locale, t } = useLocale()
  const { addItem } = useCart()

  // Lock body scroll while modal open
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [item])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!item) return null

  const name =
    locale === 'ru' ? item.name_ru : locale === 'en' ? item.name_en : item.name_ka

  const desc =
    locale === 'ru'
      ? item.description_ru
      : locale === 'en'
        ? item.description_en
        : item.description_ka

  return (
    <div
      className="product-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 600,
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
        className="product-modal-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--cream)',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '88vh',
          overflowY: 'auto',
          position: 'relative',
          animation: 'modalSlideUp 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            background: 'rgba(243,232,218,0.9)',
            border: '1px solid rgba(91,59,44,0.15)',
            color: 'var(--brown)',
            cursor: 'pointer',
            fontSize: '20px',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          ×
        </button>

        {/* Photo */}
        <div
          className="product-modal-img"
          style={{
            width: '100%',
            aspectRatio: '16/10',
            overflow: 'hidden',
            background: 'rgba(91,59,44,0.06)',
          }}
        >
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: '15px',
                color: 'rgba(91,59,44,0.3)',
                letterSpacing: '0.1em',
              }}
            >
              NAMI
            </div>
          )}
        </div>

        {/* Content */}
        <div className="product-modal-body" style={{ padding: '40px 44px 44px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(30px, 4vw, 40px)',
              fontWeight: 300,
              color: 'var(--brown)',
              lineHeight: 1.05,
              marginBottom: '14px',
            }}
          >
            {name}
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '14px',
              fontWeight: 300,
              color: 'var(--brown)',
              opacity: 0.7,
              lineHeight: 1.8,
              marginBottom: '24px',
            }}
          >
            {desc}
          </p>

          {/* Weight + price row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '20px',
              marginBottom: '32px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(91,59,44,0.1)',
            }}
          >
            {item.weight_g && (
              <span
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '12px',
                  color: 'var(--brown)',
                  opacity: 0.5,
                  letterSpacing: '0.05em',
                }}
              >
                {item.weight_g} {t.unit.gram}
              </span>
            )}
            <span
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: '30px',
                fontWeight: 400,
                color: 'var(--brown)',
                marginLeft: 'auto',
              }}
            >
              {item.price} ₾
            </span>
          </div>

          {/* Add to cart */}
          <button
            onClick={() => {
              addItem(item)
              onClose()
            }}
            style={{
              width: '100%',
              background: 'var(--brown)',
              color: 'var(--cream)',
              border: 'none',
              padding: '16px',
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'opacity 0.3s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
          >
            {t.signature.addToCart}
          </button>
        </div>
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

        @media (max-width: 900px) {
          .product-modal-overlay {
            padding: 0 !important;
            align-items: flex-end !important;
          }
          .product-modal-panel {
            max-width: 100% !important;
            max-height: 92vh !important;
            border-radius: 0 !important;
          }
          .product-modal-body {
            padding: 28px 22px 32px !important;
          }
        }
      `}</style>
    </div>
  )
}
