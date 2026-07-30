'use client'

import { useLocale } from '@/lib/locale-context'
import { useRef, useState, useEffect } from 'react'

const EDITORIAL_PHOTOS = [
  { src: '/photos/1.png', alt: 'Закат на двоих', tall: true },
  { src: '/photos/2.jpg', alt: 'Вечер у моря' },
  { src: '/photos/3.png', alt: 'Суши на закате' },
]

const MOMENT_PHOTOS = [
  { src: '/photos/4.png', alt: 'Закат на двоих' },
  { src: '/photos/6.png', alt: 'Вечер у моря' },
  { src: '/photos/batumi-wave-pebbles.png', alt: 'Набережная Батуми' },
]

const ALL_PHOTOS = [...EDITORIAL_PHOTOS, ...MOMENT_PHOTOS]

export function MomentsSection() {
  const { t } = useLocale()
  const titleLines = t.moments.title.split('\n')

  // Carousel state
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef(0)
  const isDraggingRef = useRef(false)

  function goTo(index: number) {
    const clamped = Math.max(0, Math.min(ALL_PHOTOS.length - 1, index))
    setActiveIndex(clamped)
  }

  function handleTouchStart(e: React.TouchEvent) {
    startXRef.current = e.touches[0].clientX
    isDraggingRef.current = true
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!isDraggingRef.current) return
    const delta = startXRef.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 40) {
      goTo(activeIndex + (delta > 0 ? 1 : -1))
    }
    isDraggingRef.current = false
  }

  function handleMouseDown(e: React.MouseEvent) {
    startXRef.current = e.clientX
    isDraggingRef.current = true
  }

  function handleMouseUp(e: React.MouseEvent) {
    if (!isDraggingRef.current) return
    const delta = startXRef.current - e.clientX
    if (Math.abs(delta) > 40) {
      goTo(activeIndex + (delta > 0 ? 1 : -1))
    }
    isDraggingRef.current = false
  }

  return (
    <section
      id="moments"
      style={{ padding: 0, background: 'var(--cream)', overflow: 'hidden' }}
    >
      {/* Header */}
      <div
        style={{ padding: '40px 110px 40px' }}
        className="flex justify-between items-end moments-header"
      >
        <div className="reveal">
          <p
            className="text-[13px] tracking-[0.35em] uppercase mb-5 moments-eyebrow"
            style={{ color: 'var(--brown)', opacity: 0.85 }}
          >
            {t.moments.eyebrow}
          </p>
          <h2
            className="font-cormorant font-light"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(48px, 6vw, 80px)',
              color: 'var(--brown)',
              lineHeight: 1,
            }}
          >
            {titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
        </div>

        <p
          className="reveal reveal-delay-2 font-light font-cormorant text-right hidden md:block"
          style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontStyle: 'italic',
            fontSize: '18px',
            color: 'var(--brown)',
            opacity: 0.9,
            maxWidth: '260px',
            lineHeight: 1.8,
          }}
        >
          {t.moments.tagline}
        </p>
      </div>

      {/* Desktop grid — untouched */}
      <div className="moments-desktop-grid">
        {/* Editorial grid — main */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr',
            gridTemplateRows: '380px 240px',
            gap: '4px',
          }}
        >
          <div className="editorial-cell" style={{ gridRow: 'span 2' }}>
            <img
              src={EDITORIAL_PHOTOS[0].src}
              alt={EDITORIAL_PHOTOS[0].alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="overlay" />
            <span className="cell-label">{t.moments.labels[0]}</span>
          </div>
          <div className="editorial-cell">
            <img
              src={EDITORIAL_PHOTOS[1].src}
              alt={EDITORIAL_PHOTOS[1].alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="overlay" />
            <span className="cell-label">{t.moments.labels[1]}</span>
          </div>
          <div className="editorial-cell">
            <img
              src={EDITORIAL_PHOTOS[2].src}
              alt={EDITORIAL_PHOTOS[2].alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="overlay" />
            <span className="cell-label">{t.moments.labels[2]}</span>
          </div>
        </div>

        {/* Second row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '4px',
            marginTop: '4px',
          }}
        >
          {MOMENT_PHOTOS.map((photo, i) => (
            <div key={i} className="editorial-cell" style={{ height: '300px' }}>
              <img
                src={photo.src}
                alt={photo.alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="overlay" />
              <span className="cell-label">{t.moments.labels[i + 3]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile carousel */}
      <div className="moments-mobile-carousel">
        <div
          ref={trackRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          style={{
            position: 'relative',
            height: '420px',
            overflow: 'hidden',
            userSelect: 'none',
            cursor: 'grab',
          }}
        >
          {ALL_PHOTOS.map((photo, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: i === activeIndex ? 1 : 0,
                transition: 'opacity 0.5s ease',
                pointerEvents: i === activeIndex ? 'auto' : 'none',
              }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
              {/* Gradient overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(20,15,12,0.55) 0%, transparent 50%)',
                }}
              />
              {/* Caption */}
              <span
                style={{
                  position: 'absolute',
                  bottom: '52px',
                  left: '20px',
                  right: '20px',
                  fontFamily: 'var(--font-cormorant), serif',
                  fontStyle: 'italic',
                  fontSize: '16px',
                  color: 'rgba(243,232,218,0.9)',
                  letterSpacing: '0.05em',
                }}
              >
                {t.moments.labels[i]}
              </span>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            paddingTop: '16px',
            paddingBottom: '8px',
          }}
        >
          {ALL_PHOTOS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === activeIndex ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: 'var(--brown)',
                opacity: i === activeIndex ? 0.8 : 0.2,
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease',
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .moments-mobile-carousel {
          display: none;
        }
        @media (max-width: 900px) {
          .moments-header {
            padding: 20px 24px 16px !important;
          }
          /* "АТМОСФЕРА" — эталон: как «ЭКСКЛЮЗИВНАЯ КОЛЛЕКЦИЯ» в Signature */
          .moments-eyebrow {
            font-size: 10px !important;
            letter-spacing: 0.35em !important;
            opacity: 0.5 !important;
            margin-bottom: 10px !important;
            line-height: 1 !important;
          }
          /* Заголовок NAMI Moments: дополнительно уменьшен на ~15% */
          .moments-header h2 {
            font-size: clamp(30px, 8.5vw, 44px) !important;
          }
          .moments-desktop-grid {
            display: none !important;
          }
          .moments-mobile-carousel {
            display: block !important;
          }
        }
      `}</style>
    </section>
  )
}
