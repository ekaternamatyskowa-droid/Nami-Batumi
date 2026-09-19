'use client'

import { useEffect } from 'react'
import { Nav } from '@/components/Nav'
import { HeroSection } from '@/components/HeroSection'
import { StorySection } from '@/components/StorySection'
import { MomentsSection } from '@/components/MomentsSection'
import { SignatureSection } from '@/components/SignatureSection'
import { MenuSection } from '@/components/MenuSection'
import { DeliverySection } from '@/components/DeliverySection'
import { ContactSection } from '@/components/ContactSection'
import { Footer } from '@/components/Footer'
import { CartPanel } from '@/components/CartPanel'
import { WorkingHoursModal } from '@/components/WorkingHoursModal'
import { ClosedScreen } from '@/components/ClosedScreen'

// Missing/unset env var is treated as "false" — normal site stays available.
const SITE_CLOSED = process.env.NEXT_PUBLIC_SITE_CLOSED === 'true'

export default function Home() {
  // Global reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' },
    )

    const elements = document.querySelectorAll('.reveal')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  if (SITE_CLOSED) {
    return <ClosedScreen />
  }

  return (
    <main>
      <Nav />
      <HeroSection />
      <StorySection />
      <MomentsSection />
      {/* <SignatureSection /> */}
      <MenuSection />
      <DeliverySection />
      <ContactSection />
      <Footer />
      <CartPanel />
      <WorkingHoursModal />
    </main>
  )
}
