'use client'

import { useRef, useState } from 'react'
import { useLocale } from '@/lib/locale-context'
import { useCart } from '@/lib/cart-context'
import { trackPurchase } from '@/lib/pixel'

interface OrderFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

type PaymentMethod = 'cash' | 'card'
type ChangeOption = 'no_change' | 'need_change'

export function OrderForm({ isOpen, onClose, onSuccess }: OrderFormProps) {
  const { t } = useLocale()
  const { items, total, clearCart } = useCart()

  const [form, setForm] = useState({
    name: '',
    phoneDigits: '',   // только цифры после +995
    street: '',
    building: '',
    notes: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [changeOption, setChangeOption] = useState<ChangeOption>('no_change')
  const [changeFrom, setChangeFrom] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  // Guards against firing Purchase more than once for the same order
  // (e.g. if handleSubmit were somehow triggered again before unmount).
  const purchaseTrackedOrderId = useRef<string | null>(null)

  // Формируем полный номер для отправки
  const fullPhone = `+995${form.phoneDigits}`

  // Формируем полный адрес
  const fullAddress = `${form.street}, д. ${form.building}`

  function handlePhoneInput(raw: string) {
    // Разрешаем только цифры, пробелы, дефисы; макс 9 символов (грузинский номер после кода)
    const cleaned = raw.replace(/[^\d\s\-]/g, '').slice(0, 12)
    setForm((prev) => ({ ...prev, phoneDigits: cleaned }))
  }

  async function handleSubmit() {
    // Валидация
    if (!form.name.trim()) { setError('Введите имя'); return }
    if (form.phoneDigits.replace(/\D/g, '').length < 6) { setError('Введите корректный номер телефона'); return }
    if (!form.street.trim()) { setError('Введите улицу'); return }
    if (!form.building.trim()) { setError('Введите номер дома'); return }
    if (!confirmed) { setError('Подтвердите заказ, установив галочку'); return }
    if (paymentMethod === 'cash' && changeOption === 'need_change' && !changeFrom.trim()) {
      setError('Укажите сумму для сдачи'); return
    }

    setSubmitting(true)
    setError('')

    // Формируем строку об оплате для Telegram
    let paymentInfo = paymentMethod === 'card' ? 'Картой' : 'Наличными'
    if (paymentMethod === 'cash') {
      paymentInfo += changeOption === 'no_change'
        ? ' (сдача не нужна)'
        : ` (нужна сдача с ${changeFrom} ₾)`
    }

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
          customer_phone: fullPhone,
          customer_address: fullAddress,
          notes: form.notes,
          payment_method: paymentInfo,
          confirmed_no_callback: confirmed,
        }),
      })

      const result = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(result?.error || t.cart.form.sendError)
      }

      // Purchase fires only now — after /api/orders confirmed success —
      // and only once per created order.
      const orderId: string | undefined = result?.orderId
      if (result?.success && purchaseTrackedOrderId.current !== orderId) {
        purchaseTrackedOrderId.current = orderId ?? 'unknown'
        trackPurchase({ value: total })
      }

      clearCart()
      setShowSuccess(true)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.cart.form.sendError)
    } finally {
      setSubmitting(false)
    }
  }

  function handleClose() {
    setShowSuccess(false)
    setForm({ name: '', phoneDigits: '', street: '', building: '', notes: '' })
    setPaymentMethod('cash')
    setChangeOption('no_change')
    setChangeFrom('')
    setConfirmed(false)
    setError('')
    onClose()
    if (showSuccess) onSuccess()
  }

  // ── Shared styles ──────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
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
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-manrope), sans-serif',
    fontSize: '9px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'rgba(243,232,218,0.4)',
    display: 'block',
    marginBottom: '2px',
  }

  const sectionLabel: React.CSSProperties = {
    fontFamily: 'var(--font-manrope), sans-serif',
    fontSize: '9px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'rgba(243,232,218,0.4)',
    display: 'block',
    marginBottom: '12px',
  }

  const radioRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    marginBottom: '10px',
  }

  const radioCircle = (active: boolean): React.CSSProperties => ({
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: `1px solid ${active ? 'rgba(243,232,218,0.8)' : 'rgba(243,232,218,0.25)'}`,
    background: active ? 'rgba(243,232,218,0.15)' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s',
  })

  const radioDot: React.CSSProperties = {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: 'rgba(243,232,218,0.9)',
  }

  const radioLabel: React.CSSProperties = {
    fontFamily: 'var(--font-manrope), sans-serif',
    fontSize: '12px',
    fontWeight: 300,
    color: 'rgba(243,232,218,0.75)',
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
        onClick={handleClose}
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
        {/* Close button */}
        <button
          onClick={handleClose}
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

        {/* ── Success screen ─────────────────────────────────────── */}
        {showSuccess ? (
          <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
            <p style={{
              fontSize: '32px',
              marginBottom: '20px',
              lineHeight: 1,
            }}>🎉</p>

            <h3 style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: '26px',
              fontWeight: 300,
              color: 'var(--cream)',
              marginBottom: '20px',
              lineHeight: 1.2,
            }}>
              Спасибо за заказ!
            </h3>

            <p style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '13px',
              fontWeight: 300,
              color: 'rgba(243,232,218,0.65)',
              lineHeight: 1.9,
              marginBottom: '32px',
            }}>
              Мы уже получили ваш заказ и начали его обработку.
              <br />
              Среднее время доставки по Батуми — около 60 минут.
              <br />
              Если потребуется уточнение, мы свяжемся с вами.
              <br /><br />
              <span style={{ color: 'rgba(243,232,218,0.85)' }}>Спасибо, что выбрали NAMI ❤️</span>
            </p>

            <button
              onClick={handleClose}
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
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
            >
              Закрыть
            </button>
          </div>
        ) : (
          <>
            {/* ── Form title ──────────────────────────────────────── */}
            <p style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: '28px',
              fontWeight: 300,
              color: 'var(--cream)',
              marginBottom: '32px',
            }}>
              {t.cart.form.submit}
            </p>

            {/* ── Order summary ───────────────────────────────────── */}
            <div style={{
              marginBottom: '28px',
              paddingBottom: '24px',
              borderBottom: '1px solid rgba(243,232,218,0.12)',
            }}>
              {items.map((item) => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '12px',
                  color: 'rgba(243,232,218,0.7)',
                  lineHeight: 2.2,
                }}>
                  <span>
                    {item.name}
                    {item.quantity > 1 && (
                      <span style={{ opacity: 0.5 }}> ×{item.quantity}</span>
                    )}
                  </span>
                  <span>{item.price * item.quantity} ₾</span>
                </div>
              ))}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(243,232,218,0.1)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '11px',
                  color: 'rgba(243,232,218,0.5)',
                }}>
                  {t.cart.total}
                </span>
                <span style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontSize: '22px',
                  color: 'var(--cream)',
                }}>
                  {total} ₾
                </span>
              </div>
            </div>

            {/* ── Fields ──────────────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Имя */}
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

              {/* Телефон: +995 зафиксирован, только цифры после */}
              <div>
                <label style={labelStyle}>{t.cart.form.phone} *</label>
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(243,232,218,0.2)' }}>
                  <span style={{
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '13px',
                    fontWeight: 300,
                    color: 'rgba(243,232,218,0.45)',
                    paddingBottom: '12px',
                    paddingTop: '12px',
                    paddingRight: '6px',
                    userSelect: 'none',
                    flexShrink: 0,
                  }}>
                    +995
                  </span>
                  <input
                    type="tel"
                    value={form.phoneDigits}
                    onChange={(e) => handlePhoneInput(e.target.value)}
                    style={{
                      ...inputStyle,
                      borderBottom: 'none',
                      paddingLeft: '2px',
                      flex: 1,
                    }}
                    placeholder="5XX XXX XXX"
                    inputMode="tel"
                  />
                </div>
              </div>

              {/* Улица */}
              <div>
                <label style={labelStyle}>{t.cart.form.street} *</label>
                <input
                  type="text"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  style={inputStyle}
                  placeholder={t.cart.form.placeholderStreet}
                />
              </div>

              {/* Номер дома */}
              <div>
                <label style={labelStyle}>{t.cart.form.building} *</label>
                <input
                  type="text"
                  value={form.building}
                  onChange={(e) => setForm({ ...form, building: e.target.value })}
                  style={inputStyle}
                  placeholder={t.cart.form.placeholderBuilding}
                />
              </div>

              {/* Комментарий */}
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

            {/* ── Способ оплаты ────────────────────────────────────── */}
            <div style={{
              marginTop: '28px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(243,232,218,0.1)',
            }}>
              <span style={sectionLabel}>Способ оплаты</span>

              {/* Наличными */}
              <div
                style={radioRow}
                onClick={() => setPaymentMethod('cash')}
              >
                <div style={radioCircle(paymentMethod === 'cash')}>
                  {paymentMethod === 'cash' && <div style={radioDot} />}
                </div>
                <span style={radioLabel}>Наличными</span>
              </div>

              {/* Картой */}
              <div
                style={radioRow}
                onClick={() => setPaymentMethod('card')}
              >
                <div style={radioCircle(paymentMethod === 'card')}>
                  {paymentMethod === 'card' && <div style={radioDot} />}
                </div>
                <span style={radioLabel}>Картой</span>
              </div>

              {/* Sub-options for cash */}
              {paymentMethod === 'cash' && (
                <div style={{
                  marginTop: '4px',
                  marginLeft: '26px',
                  paddingTop: '10px',
                  paddingLeft: '14px',
                  borderLeft: '1px solid rgba(243,232,218,0.1)',
                }}>
                  {/* Без сдачи */}
                  <div
                    style={{ ...radioRow, marginBottom: '8px' }}
                    onClick={() => setChangeOption('no_change')}
                  >
                    <div style={radioCircle(changeOption === 'no_change')}>
                      {changeOption === 'no_change' && <div style={radioDot} />}
                    </div>
                    <span style={{ ...radioLabel, fontSize: '11px' }}>Без сдачи</span>
                  </div>

                  {/* Нужна сдача */}
                  <div
                    style={{ ...radioRow, marginBottom: changeOption === 'need_change' ? '12px' : '0' }}
                    onClick={() => setChangeOption('need_change')}
                  >
                    <div style={radioCircle(changeOption === 'need_change')}>
                      {changeOption === 'need_change' && <div style={radioDot} />}
                    </div>
                    <span style={{ ...radioLabel, fontSize: '11px' }}>Нужна сдача</span>
                  </div>

                  {/* Поле суммы для сдачи */}
                  {changeOption === 'need_change' && (
                    <div>
                      <label style={{ ...labelStyle, marginBottom: '4px' }}>С какой суммы? *</label>
                      <input
                        type="number"
                        value={changeFrom}
                        onChange={(e) => setChangeFrom(e.target.value)}
                        style={{ ...inputStyle, paddingLeft: '0' }}
                        placeholder="Например: 100 ₾"
                        min={1}
                        inputMode="numeric"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Подтверждение ────────────────────────────────────── */}
            <div style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(243,232,218,0.1)',
            }}>
              <div
                onClick={() => setConfirmed(!confirmed)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                {/* Custom checkbox */}
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: `1px solid ${confirmed ? 'rgba(243,232,218,0.8)' : 'rgba(243,232,218,0.25)'}`,
                  background: confirmed ? 'rgba(243,232,218,0.15)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                  transition: 'all 0.2s',
                }}>
                  {confirmed && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="rgba(243,232,218,0.9)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '11px',
                  fontWeight: 300,
                  color: 'rgba(243,232,218,0.6)',
                  lineHeight: 1.6,
                }}>
                  Подтверждаю заказ. Перезванивать для подтверждения не нужно.
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '11px',
                color: '#ffaa88',
                marginTop: '16px',
                lineHeight: 1.5,
              }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                width: '100%',
                background: confirmed ? 'var(--cream)' : 'rgba(243,232,218,0.25)',
                color: confirmed ? 'var(--brown)' : 'rgba(243,232,218,0.4)',
                border: 'none',
                padding: '16px',
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                cursor: submitting ? 'not-allowed' : (confirmed ? 'pointer' : 'default'),
                marginTop: '28px',
                opacity: submitting ? 0.6 : 1,
                transition: 'all 0.3s',
              }}
            >
              {submitting ? '···' : t.cart.form.submit}
            </button>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .order-form-overlay {
            padding: 0 !important;
            align-items: flex-end !important;
            justify-content: center !important;
          }
          .order-form-overlay > div:last-child {
            max-width: 100% !important;
            max-height: 92vh !important;
            padding: 32px 24px 40px !important;
          }
        }
        /* Remove number input arrows */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  )
}
