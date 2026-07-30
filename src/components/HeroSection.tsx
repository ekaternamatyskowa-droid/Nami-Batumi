'use client'

import { useEffect, useRef } from 'react'
import { useLocale } from '@/lib/locale-context'

export function HeroSection() {
  const { t } = useLocale()
  const photoRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (photoRef.current && window.scrollY < window.innerHeight) {
        photoRef.current.style.transform = `translateY(${Math.round(window.scrollY * 0.35)}px)`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: '100vh', minHeight: '600px' }}
    >
      {/* Background photo */}
      <img
        ref={photoRef}
        src="/photos/4.png"
        alt="Батуми закат"
        className="hero-photo"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '130%',
          objectFit: 'cover',
          objectPosition: 'center 40%',
          top: '-15%',
        }}
      />

      {/* Cinematic overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,15,12,0.55) 0%, rgba(20,15,12,0.28) 35%, rgba(20,15,12,0.55) 100%)',
        }}
      />

      {/* Content */}
      <div
        className="relative z-[2] text-center hero-content"
        style={{ padding: '0 20px' }}
      >
        <p
          className="hero-eyebrow text-[11px] tracking-[0.35em] uppercase text-cream/100 mb-8 font-light"
          style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            animation: 'fadeUp 1.2s 0.3s both',
          }}
        >
          {t.hero.eyebrow}
        </p>

        <h1
          className="hero-logo font-cormorant font-light text-cream leading-[0.88] tracking-[0.06em]"
          style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontSize: 'clamp(96px, 15vw, 180px)',
            animation: 'fadeUp 1.4s 0.5s both',
          }}
        >
          NAMI
        </h1>

        {/* Animated wave */}
        <div style={{ animation: 'fadeIn 1.6s 0.9s both' }} className="hero-wave">
          <svg
            className="block mx-auto my-5"
            width="220"
            height="32"
            viewBox="0 0 220 32"
            fill="none"
          >
            <path
              d="M4 24 C22 24, 28 8, 48 8 C68 8, 74 24, 94 24 C114 24, 120 8, 140 8 C160 8, 166 24, 186 24 C198 24, 208 17, 218 14"
              stroke="rgba(243,232,218,0.55)"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            >
              <animate
                attributeName="d"
                dur="6s"
                repeatCount="indefinite"
                values="M4 24 C22 24, 28 8, 48 8 C68 8, 74 24, 94 24 C114 24, 120 8, 140 8 C160 8, 166 24, 186 24 C198 24, 208 17, 218 14;M4 18 C22 18, 28 28, 48 28 C68 28, 74 14, 94 14 C114 14, 120 28, 140 28 C160 28, 166 14, 186 14 C198 14, 208 20, 218 18;M4 24 C22 24, 28 8, 48 8 C68 8, 74 24, 94 24 C114 24, 120 8, 140 8 C160 8, 166 24, 186 24 C198 24, 208 17, 218 14"
              />
            </path>
          </svg>
        </div>

        <p
          className="hero-subtitle text-[15px] font-light text-cream/100 tracking-[0.14em] mb-[60px]"
          style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontStyle: 'italic',
            animation: 'fadeUp 1.2s 1.1s both',
          }}
        >
          {t.hero.subtitle}
        </p>

        <a
          href="#menu"
          className="hero-cta inline-block border text-cream/100 text-[10px] tracking-[0.25em] uppercase cursor-pointer transition-all duration-500 bg-transparent hover:bg-cream/12"
          style={{
            padding: '16px 52px',
            borderColor: 'rgba(243,232,218,0.5)',
            fontFamily: 'var(--font-manrope), sans-serif',
            animation: 'fadeUp 1s 1.3s both',
          }}
        >
          {t.hero.cta}
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-3 hero-scroll"
        style={{ animation: 'fadeIn 1.5s 1.8s both', opacity: 0.6 }}
      >
        <div
          className="scroll-line"
          style={{
            width: '1px',
            height: '50px',
            background:
              'linear-gradient(to bottom, rgba(243,232,218,0), rgba(243,232,218,0.7))',
          }}
        />
        <span
          className="text-[9px] tracking-[0.25em] text-cream/100 uppercase"
          style={{ fontFamily: 'var(--font-manrope), sans-serif' }}
        >
          {t.hero.scroll}
        </span>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 900px) {
          /* Высота увеличена на ~12% относительно прежних 82vh, чтобы оба бокала помещались в кадр */
          #hero {
            height: 92vh !important;
            min-height: 600px !important;
          }
          /* Фото: минимальный crop, оба бокала читаются полностью в кадре */
          #hero .hero-photo {
            height: 100% !important;
            top: 0 !important;
            object-position: center 52% !important;
          }
          /* NAMI логотип: -12% от базового */
          #hero .hero-logo {
            font-size: clamp(64px, 19vw, 96px) !important;
          }
          #hero .hero-eyebrow {
            font-size: 9px !important;
            letter-spacing: 0.26em !important;
            margin-bottom: 16px !important;
          }
          /* Волна заметна сразу после открытия — без задержки и без fade-in анимации */
          #hero .hero-wave {
            animation: none !important;
            opacity: 1 !important;
            margin: 4px 0 !important;
          }
          #hero .hero-wave svg {
            width: 150px !important;
            height: 24px !important;
          }
          #hero .hero-subtitle {
            font-size: 13px !important;
            margin-bottom: 28px !important;
          }
          #hero .hero-cta {
            padding: 12px 32px !important;
            font-size: 9px !important;
          }
          /* Индикатор SCROLL поднят на 48px (16px → 64px) */
          #hero .hero-scroll {
            bottom: 64px !important;
          }
          #hero .hero-scroll .scroll-line {
            height: 28px !important;
          }
        }
      `}</style>

      {/* Bottom wave */}
      <svg
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          bottom: '-1px',
          left: 0,
          width: '100%',
          height: '70px',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      >
        <path
          d="M0,80 C180,60 320,60 500,80 C680,100 760,100 940,80 C1120,60 1260,60 1440,80 L1440,140 L0,140 Z"
          fill="var(--cream)"
          stroke="rgba(91,59,44,0.18)"
          strokeWidth="1.5"
        />
      </svg>
    </section>
  )
}
