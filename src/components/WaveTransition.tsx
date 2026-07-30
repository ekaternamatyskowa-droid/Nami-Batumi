'use client'

import { useEffect, useRef } from 'react'

export function WaveTransition() {
  const pathRef = useRef<SVGPathElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && pathRef.current) {
            pathRef.current.classList.add('drawn')
          }
        })
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        height: '80px',
        background: 'var(--cream)',
        marginTop: '-2px',
      }}
    >
 <svg
  className="wave-float"
  viewBox="0 0 1400 120"
  preserveAspectRatio="none"
  style={{
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  }}
>
  <path
    ref={pathRef}
    className="wave-draw"
    d="M0 80 C150 80, 200 20, 350 20 C500 20, 550 80, 700 80 C850 80, 900 20, 1050 20 C1200 20, 1250 80, 1400 80"
    stroke="#5B3B2C"
    strokeWidth="1"
    fill="none"
    strokeLinecap="round"
    opacity="0.5"
  >
    <animateTransform
      attributeName="transform"
      type="translate"
      values="0 0; 0 -4; 0 0"
      dur="1s"
      repeatCount="indefinite"
    />
  </path>
</svg>
   <div
  style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '30px',
    background:
      'linear-gradient(to bottom, rgba(42,38,36,0.08), rgba(42,38,36,0))',
    pointerEvents: 'none',
  }}
/>
</div>
)
}
