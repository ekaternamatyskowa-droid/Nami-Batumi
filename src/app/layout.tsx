import type { Metadata } from 'next'
import { Cormorant_Garamond, Manrope } from 'next/font/google'
import './globals.css'
import { LocaleProvider } from '@/lib/locale-context'
import { CartProvider } from '@/lib/cart-context'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NAMI — Inspired by Batumi',
  description:
    'Премиальная доставка суши в Батуми. Вкус моментов у моря.',
  openGraph: {
    title: 'NAMI — Inspired by Batumi',
    description: 'Премиальная доставка суши в Батуми.',
    images: ['/photos/batumi-sunset-beach.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="bg-cream font-manrope text-dark antialiased overflow-x-hidden">
        <LocaleProvider>
          <CartProvider>{children}</CartProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
