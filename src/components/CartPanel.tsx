'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/locale-context'
import { useCart } from '@/lib/cart-context'
import { trackInitiateCheckout } from '@/lib/pixel'
import { OrderForm } from './OrderForm'

export function CartPanel() {
  const { t } = useLocale()
  const { items, count, total, isOpen, closeCart, removeItem, updateQty } = useCart()
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleSuccess() {
    setShowForm(false)
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      closeCart()
    }, 3000)
  }

  return (
    <>
      {/* Cart panel */}
      <div
        className="cart-panel"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--brown)',
          color: 'var(--cream)',
          padding: '28px 32px',
          minWidth: '320px',
          maxWidth: '380px',
          width: '100%',
          zIndex: 300,
          transform: isOpen ? 'translateY(0)' : 'translateY(120px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'all 0.45s cubic-bezier(0.25,0.46,0.45,0.94)',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        {/* Close */}
        <button
          onClick={closeCart}
          style={{
            position: 'absolute',
            top: '16px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'rgba(243,232,218,0.4)',
            cursor: 'pointer',
            fontSize: '20px',
            lineHeight: 1,
            padding: 0,
          }}
        >
          {t.cart.close}
        </button>

        <p
          style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            opacity: 0.5,
            marginBottom: '20px',
          }}
        >
          {t.cart.eyebrow}
        </p>

        {/* Success state */}
        {success && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: '20px',
                color: 'var(--cream)',
                lineHeight: 1.5,
              }}
            >
              {t.cart.success}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!success && items.length === 0 && (
          <p
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: '18px',
              color: 'rgba(243,232,218,0.4)',
              fontStyle: 'italic',
              textAlign: 'center',
              padding: '20px 0',
            }}
          >
            {t.cart.empty}
          </p>
        )}

        {/* Items */}
        {!success && items.length > 0 && (
          <>
            <div style={{ marginBottom: '16px' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '12px',
                    marginBottom: '12px',
                    borderBottom: '1px solid rgba(243,232,218,0.08)',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-manrope), sans-serif',
                        fontSize: '12px',
                        color: 'rgba(243,232,218,0.85)',
                        marginBottom: '4px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        style={{
                          width: '20px',
                          height: '20px',
                          background: 'none',
                          border: '1px solid rgba(243,232,218,0.2)',
                          color: 'rgba(243,232,218,0.6)',
                          cursor: 'pointer',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          fontFamily: 'var(--font-manrope), sans-serif',
                          fontSize: '12px',
                          color: 'rgba(243,232,218,0.7)',
                          minWidth: '16px',
                          textAlign: 'center',
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        style={{
                          width: '20px',
                          height: '20px',
                          background: 'none',
                          border: '1px solid rgba(243,232,218,0.2)',
                          color: 'rgba(243,232,218,0.6)',
                          cursor: 'pointer',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-cormorant), serif',
                        fontSize: '18px',
                        color: 'var(--cream)',
                      }}
                    >
                      {item.price * item.quantity} ₾
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(243,232,218,0.25)',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: 0,
                        lineHeight: 1,
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(243,232,218,0.7)')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(243,232,218,0.25)')}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                paddingTop: '16px',
                borderTop: '1px solid rgba(243,232,218,0.15)',
                marginBottom: '20px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '11px',
                  color: 'rgba(243,232,218,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                }}
              >
                {t.cart.total}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontSize: '28px',
                  color: 'var(--cream)',
                }}
              >
                {total} ₾
              </span>
            </div>

            {/* Order button */}
            <button
              onClick={() => {
                trackInitiateCheckout({ value: total })
                setShowForm(true)
              }}
              style={{
                width: '100%',
                background: 'var(--cream)',
                color: 'var(--brown)',
                border: 'none',
                padding: '14px',
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
              {t.cart.order}
            </button>
          </>
        )}
      </div>

      {/* Order form modal */}
      <OrderForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleSuccess}
      />

      <style>{`
        @media (max-width: 900px) {
          .cart-panel {
            /* Full width at bottom on mobile */
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            max-width: 100% !important;
            min-width: unset !important;
            border-radius: 0 !important;
            padding: 24px 20px !important;
            max-height: 75vh !important;
          }
        }
      `}</style>
    </>
  )
}
