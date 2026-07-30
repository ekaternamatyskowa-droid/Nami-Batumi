'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/lib/locale-context'
import { useCart } from '@/lib/cart-context'
import type { Locale } from '@/types'

export function Nav() {
  const { locale, t, setLocale } = useLocale()
  const { count, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const locales: Locale[] = ['ru', 'en', 'ge']
  const localeLabels = { ru: 'RU', en: 'EN', ge: 'ქა' }

  const navLinks = [
    { key: 'story', href: '#story' },
    { key: 'menu', href: '#menu' },
    { key: 'delivery', href: '#delivery' },
    { key: 'contacts', href: '#contact' },
  ]

  // colors depend on scroll + menu state
  const isDark = !scrolled && !menuOpen
  const iconColor = isDark ? 'rgba(243,232,218,0.9)' : '#5B3B2C'
  const textColor = isDark ? 'rgba(243,232,218,0.85)' : 'var(--brown)'

  return (
    <>
      <nav
        className="nav-base fixed top-0 left-0 right-0 z-[200] flex items-center justify-between"
        style={{
          padding: scrolled ? '18px 60px' : '28px 60px',
          background: scrolled ? 'rgba(243,232,218,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(91,59,44,0.08)' : 'none',
          transition: 'background 0.4s, padding 0.3s',
        }}
      >
        {/* Logo */}
        <a
          href="#hero"
          style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontSize: '26px',
            fontWeight: 300,
            letterSpacing: '0.14em',
            textDecoration: 'none',
            color: scrolled ? 'var(--brown)' : 'var(--cream)',
            transition: 'color 0.4s',
          }}
        >
          NAMI
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-10 list-none">
          {navLinks.map(({ key, href }) => (
            <li key={key}>
              <a
                href={href}
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  fontWeight: 300,
                  color: scrolled ? 'var(--brown)' : 'rgba(243,232,218,0.8)',
                  opacity: scrolled ? 0.7 : 1,
                  transition: 'opacity 0.3s',
                }}
              >
                {t.nav[key as keyof typeof t.nav]}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-3">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => setLocale(loc)}
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 300,
                  color: scrolled ? 'var(--brown)' : 'var(--cream)',
                  opacity: locale === loc ? 1 : 0.4,
                  transition: 'opacity 0.3s',
                }}
              >
                {localeLabels[loc]}
              </button>
            ))}
          </div>
          <button
            onClick={openCart}
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              background: 'transparent',
              padding: '8px 20px',
              fontWeight: 300,
              border: `1px solid ${scrolled ? 'rgba(91,59,44,0.4)' : 'rgba(243,232,218,0.5)'}`,
              color: scrolled ? 'var(--brown)' : 'rgba(243,232,218,0.9)',
              transition: 'all 0.3s',
            }}
          >
            {t.nav.cart}{count > 0 && ` (${count})`}
          </button>
        </div>

        {/* ── Mobile right side: корзина · языки · бургер ── */}
        <div
          className="flex md:hidden items-center"
          style={{ gap: '14px' }}
        >
          {/* Cart */}
          <button
            onClick={openCart}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
              stroke={iconColor} strokeWidth="1.2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {count > 0 && (
              <span style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '10px',
                color: textColor,
              }}>{count}</span>
            )}
          </button>

          {/* Language switcher — visible in header on mobile */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => setLocale(loc)}
                style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: '9px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: textColor,
                  opacity: locale === loc ? 1 : 0.38,
                  padding: 0,
                  fontWeight: 300,
                  transition: 'opacity 0.2s',
                }}
              >
                {localeLabels[loc]}
              </button>
            ))}
          </div>

          {/* Burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              width: '24px',
            }}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                display: 'block',
                width: '100%',
                height: '1px',
                background: iconColor,
                transition: 'all 0.3s ease',
                transform:
                  menuOpen && i === 0 ? 'translateY(6px) rotate(45deg)'
                  : menuOpen && i === 2 ? 'translateY(-6px) rotate(-45deg)'
                  : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* ── Full-screen mobile menu ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 199,
          background: 'var(--cream)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 36px 52px',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transition: 'opacity 0.35s ease',
        }}
      >
        {/* Nav links — компактнее */}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginBottom: '44px' }}>
          {navLinks.map(({ key, href }, i) => (
            <li
              key={key}
              style={{
                borderBottom: '1px solid rgba(91,59,44,0.08)',
                transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
                opacity: menuOpen ? 1 : 0,
                transition: `all 0.35s ease ${0.05 * i + 0.08}s`,
              }}
            >
              <a
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-cormorant), serif',
                  fontSize: '32px',       // было 42px — уменьшено
                  fontWeight: 300,
                  color: 'var(--brown)',
                  textDecoration: 'none',
                  padding: '12px 0',      // было 16px — уменьшено
                  lineHeight: 1.1,
                  letterSpacing: '0.02em',
                }}
              >
                {t.nav[key as keyof typeof t.nav]}
              </a>
            </li>
          ))}
        </ul>

        {/* Три кнопки контактов — как в секции Контакты */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.35s ease 0.28s',
          }}
        >
          {/* Instagram */}
          <a
            href="https://instagram.com/nami.batumi"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              border: '1px solid rgba(91,59,44,0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 8px',
              textDecoration: 'none',
              color: 'var(--brown)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B3B2C" strokeWidth="1">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.3" cy="6.7" r="0.9" fill="#5B3B2C" stroke="none" />
            </svg>
            <span style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '8px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.55,
            }}>{ t.contact.instagram }</span>
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/nami_batumi"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              border: '1px solid rgba(91,59,44,0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 8px',
              textDecoration: 'none',
              color: 'var(--brown)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B3B2C" strokeWidth="1">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
            <span style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '8px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.55,
            }}>{t.contact.telegram}</span>
          </a>

          {/* Phone */}
          <a
            href="tel:+99500000000"
            style={{
              flex: 1,
              border: '1px solid rgba(91,59,44,0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 8px',
              textDecoration: 'none',
              color: 'var(--brown)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B3B2C" strokeWidth="1">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
            </svg>
            <span style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '8px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.55,
            }}>{t.nav.phone}</span>
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          nav {
            padding: 18px 20px !important;
          }
        }
      `}</style>
    </>
  )
}
