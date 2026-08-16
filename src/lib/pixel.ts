'use client'

/**
 * Thin, safe wrapper around the Meta Pixel `fbq` that is already
 * loaded by the base install in `src/app/layout.tsx`.
 *
 * This file does NOT load fbevents.js, does NOT call `fbq('init', ...)`,
 * and does NOT send `PageView`. It only fires standard events on top of
 * the pixel instance that already exists on `window`.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

function safeTrack(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') return
  window.fbq('track', eventName, params)
}

export function trackViewContent(params: {
  id: string
  price: number
  currency?: string
}) {
  safeTrack('ViewContent', {
    content_ids: [params.id],
    content_type: 'product',
    value: params.price,
    currency: params.currency ?? 'GEL',
  })
}

export function trackAddToCart(params: {
  id: string
  price: number
  currency?: string
}) {
  safeTrack('AddToCart', {
    content_ids: [params.id],
    content_type: 'product',
    value: params.price,
    currency: params.currency ?? 'GEL',
  })
}

export function trackInitiateCheckout(params: {
  value: number
  currency?: string
}) {
  safeTrack('InitiateCheckout', {
    value: params.value,
    currency: params.currency ?? 'GEL',
  })
}

export function trackPurchase(params: { value: number; currency?: string }) {
  safeTrack('Purchase', {
    value: params.value,
    currency: params.currency ?? 'GEL',
  })
}
