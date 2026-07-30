'use client'

import { useLocale } from '@/lib/locale-context'

export function StorySection() {
  const { t } = useLocale()
  const headingLines = t.story.heading.split('\n')

  return (
    <section
      id="story"
      style={{
        padding: '40px 60px 40px',
        background: 'var(--cream)',
      }}
    >
      <div
        className="mx-auto story-layout grid gap-24 items-start"
        style={{
          maxWidth: '1300px',
          gridTemplateColumns: '1fr 1.1fr',
        }}
      >
        {/* Text side */}
        <div className="story-text">
          <p
            className="reveal text-[10px] tracking-[0.3em] uppercase mb-7"
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              color: 'var(--brown-mid)',
              opacity: 0.7,
            }}
          >
            {t.story.eyebrow}
          </p>

          <h2
            className="reveal reveal-delay-1 font-cormorant font-light mb-10"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(36px, 4.5vw, 56px)',
              color: 'var(--brown)',
              lineHeight: 0.88,
            }}
          >
            {headingLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < headingLines.length - 1 && <br />}
              </span>
            ))}
          </h2>

          <p
            className="reveal reveal-delay-2 font-light leading-loose max-w-[420px] mb-5"
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '15px',
              color: 'var(--dark)',
              opacity: 1,
            }}
          >
            {t.story.text1}
          </p>

          <p
            className="reveal reveal-delay-3 font-light leading-loose max-w-[420px]"
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '15px',
              color: 'var(--dark)',
              opacity: 1,
            }}
          >
            {t.story.text2}
          </p>

          {/* Decorative wave */}
          <div className="reveal reveal-delay-3 mt-10">
            <svg width="120" height="20" viewBox="0 0 120 20" fill="none">
              <path
                d="M2 14 C14 14, 14 6, 28 6 C42 6, 42 14, 56 14 C70 14, 70 6, 84 6 C98 6, 98 14, 112 14 C116 14, 118 11, 120 10"
                stroke="#5B3B2C"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
                opacity="0.4"
              />
            </svg>
          </div>
        </div>

        {/* Photo side */}
        <div
          className="reveal reveal-delay-1 story-photo"
          style={{ position: 'relative' }}
        >
          <div
            style={{
              aspectRatio: '1/1',
              maxWidth: '500px',
              marginLeft: 'auto',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <img
              src="/photos/sushi-sunset.png"
              alt="Батуми берег на закате"
              style={{
                width: '100%',
                height: '110%',
                objectFit: 'cover',
                objectPosition: 'center',
                transition: 'transform 8s ease',
                marginTop: '-5%',
              }}
              onMouseEnter={(e) => {
                ;(e.target as HTMLImageElement).style.transform = 'scale(1.04) translateY(-2%)'
              }}
              onMouseLeave={(e) => {
                ;(e.target as HTMLImageElement).style.transform = 'none'
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #story {
            padding: 28px 24px 24px !important;
          }
          #story .story-layout {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          #story .story-text {
            order: 1;
          }
          #story .story-photo {
            order: 2;
          }
          #story .story-photo > div {
            max-width: 100% !important;
            margin-left: 0 !important;
            aspect-ratio: 4/3 !important;
          }
          #story .story-photo img {
            height: 115% !important;
          }
          /* Равномерный вертикальный ритм: eyebrow → заголовок → текст → волна — все отступы 14-18px */
          #story .story-text .mb-7  { margin-bottom: 14px !important; }
          #story .story-text .mb-10 { margin-bottom: 18px !important; }
          #story .story-text .mb-5  { margin-bottom: 14px !important; }
          #story .story-text .mt-10 { margin-top: 18px !important; }
          #story .story-text p { font-size: 14px !important; }
        }
      `}</style>
    </section>
  )
}
