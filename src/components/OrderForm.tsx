'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/locale-context'
import { useCart } from '@/lib/cart-context'

interface OrderFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function OrderForm({ isOpen, onClose, onSuccess }: OrderFormProps) {
  const { t } = useLocale()
  const { items, total, clearCart } = useCart()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError(t.cart.form.validationError)
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            qty: i.quantity,
          })),
          total,
          customer_name: form.name,
          customer_phone: form.phone,
          customer_address: form.address,
          notes: form.notes,
        }),
      })

      const result = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(result?.error || t.cart.form.sendError)
      }

      clearCart()
      onSuccess()
      setForm({ name: '', phone: '', address: '', notes: '' })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.cart.form.sendError)
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(243,232,218,0.2)',
    color: 'var(--cream)',
    padding: '12px 0',
    fontSize: '13px',
    fontFamily: 'var(--font-manrope), sans-serif',
    fontWeight: 300,
    outline: 'none',
    transition: 'border-color 0.3s',
  }

  const labelStyle = {
    fontFamily: 'var(--font-manrope), sans-serif',
    fontSize: '9px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color: 'rgba(243,232,218,0.4)',
    display: 'block',
    marginBottom: '2px',
  }

  return (
    <div
      className={`order-form-overlay ${isOpen ? 'open' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: '24px',
        pointerEvents: isOpen ? 'all' : 'none',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(42,38,36,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: -1,
        }}
      />

      {/* Form panel */}
      <div
        style={{
          background: 'var(--brown)',
          width: '100%',
          maxWidth: '420px',
          padding: '40px 36px',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={onClose}
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
          ×
        </button>

        <p
          style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontSize: '28px',
            fontWeight: 300,
            color: 'var(--cream)',
            marginBottom: '32px',
          }}
        >
          {t.cart.form.submit}
        </p>

        {/* Order summary */}
        <div
          style={{
            marginBottom: '28px',
            paddingBottom: '24px',
            borderBottom: '1px solid rgba(243,232,218,0.12)',
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '12px',
                color: 'rgba(243,232,218,0.7)',
                lineHeight: 2.2,
              }}
            >
              <span>
                {item.name}
                {item.quantity > 1 && (
                  <span style={{ opacity: 0.5 }}> ×{item.quantity}</span>
                )}
              </span>
              <span>{item.price * item.quantity} ₾</span>
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(243,232,218,0.1)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '11px',
                color: 'rgba(243,232,218,0.5)',
              }}
            >
              {t.cart.total}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: '22px',
                color: 'var(--cream)',
              }}
            >
              {total} ₾
            </span>
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>{t.cart.form.name} *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
              placeholder={t.cart.form.placeholderName}
            />
          </div>

          <div>
            <label style={labelStyle}>{t.cart.form.phone} *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={inputStyle}
              placeholder={t.cart.form.placeholderPhone}
            />
          </div>

          <div>
            <label style={labelStyle}>{t.cart.form.address} *</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              style={inputStyle}
              placeholder={t.cart.form.placeholderAddress}
            />
          </div>

          <div>
            <label style={labelStyle}>{t.cart.form.notes}</label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              style={inputStyle}
              placeholder={t.cart.form.placeholderNotes}
            />
          </div>
        </div>

        {error && (
          <p
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '11px',
              color: '#ffaa88',
              marginTop: '16px',
            }}
          >
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: '100%',
            background: 'var(--cream)',
            color: 'var(--brown)',
            border: 'none',
            padding: '16px',
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            cursor: submitting ? 'not-allowed' : 'pointer',
            marginTop: '28px',
            opacity: submitting ? 0.6 : 1,
            transition: 'opacity 0.3s',
          }}
        >
          {submitting ? '···' : t.cart.form.submit}
        </button>
      </div>
    </div>
  )
}
