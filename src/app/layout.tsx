import Script from 'next/script'
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

  <Script
    id="facebook-pixel"
    strategy="afterInteractive"
  >
    {`
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}
      (window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');

      fbq('init', '3035435446790259');
      fbq('track', 'PageView');
    `}
  </Script>

  <noscript>
    <img
      height="1"
      width="1"
      style={{ display: 'none' }}
      src="https://www.facebook.com/tr?id=3035435446790259&ev=PageView&noscript=1"
      alt=""
    />
  </noscript>

  <LocaleProvider>
    <CartProvider>{children}</CartProvider>
  </LocaleProvider>

</body>
    </html>
  )
}
