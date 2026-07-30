'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/lib/locale-context'
import { useCart } from '@/lib/cart-context'
import { supabase } from '@/lib/supabase'
import { ProductModal } from './ProductModal'
import type { MenuItem } from '@/types'

const FALLBACK_ITEMS: MenuItem[] = [
  {
    id: 'fallback-1',
    category: 'signature',
    name_ru: 'Nami Black',
    name_en: 'Nami Black',
    name_ka: 'ნამი ბლეგ',
    description_ru: 'Лосось, икра тобико, трюфельный соус, огурец, сливочный сыр',
    description_en: 'Salmon, tobiko roe, truffle sauce, cucumber, cream cheese',
    description_ka: 'ორაგული, ტობიკო, ტრიუფელის სოუსი, კიტრი, კრემ-ყველი',
    price: 18,
    image_url: '/photos/nami-black.png',
    is_available: true,
    is_featured: true,
    sort_order: 1,
    created_at: '',
    weight_g: 240,
  },
  {
    id: 'fallback-2',
    category: 'signature',
    name_ru: 'Batumi Sunset',
    name_en: 'Batumi Sunset',
    name_ka: 'ბათუმის მზის ჩასვლა',
    description_ru: 'Тунец, манго, авокадо, соус юзу, кунжут',
    description_en: 'Tuna, mango, avocado, yuzu sauce, sesame',
    description_ka: 'თინუსი, მანგო, ავოკადო, იუზუს სოუსი, სეზამი',
    price: 15,
    image_url: '/photos/nami-black.png',
    is_available: true,
    is_featured: true,
    sort_order: 2,
    created_at: '',
    weight_g: 220,
  },
  {
    id: 'fallback-3',
    category: 'signature',
    name_ru: 'Sea Breeze',
    name_en: 'Sea Breeze',
    name_ka: 'ზღვის ნიავი',
    description_ru: 'Краб, авокадо, огурец, икра масаго, зелёный лук',
    description_en: 'Crab, avocado, cucumber, masago roe, spring onion',
    description_ka: 'კრაბი, ავოკადო, კიტრი, მასაგო, მწვანე ხახვი',
    price: 14,
    image_url: '/photos/batumi-pebbles-foam.png',
    is_available: true,
    is_featured: false,
    sort_order: 3,
    created_at: '',
    weight_g: 210,
  },
  {
    id: 'fallback-4',
    category: 'signature',
    name_ru: 'Black Sea',
    name_en: 'Black Sea',
    name_ka: 'შავი ზღვა',
    description_ru: 'Тунец, трюфельный соус, икра тобико, нори',
    description_en: 'Tuna, truffle sauce, tobiko roe, nori',
    description_ka: 'თინუსი, ტრიუფელის სოუსი, ტობიკო, ნორი',
    price: 16,
    image_url: '/photos/batumi-wave-pebbles.png',
    is_available: true,
    is_featured: false,
    sort_order: 4,
    created_at: '',
    weight_g: 230,
  },
]

export function SignatureSection() {
  const { locale, t } = useLocale()
  const { addItem } = useCart()
  const [featured, setFeatured] = useState<MenuItem>(FALLBACK_ITEMS[0])
  const [others, setOthers] = useState<MenuItem[]>(FALLBACK_ITEMS.slice(1))
  const [modalItem, setModalItem] = useState<MenuItem | null>(null)

  useEffect(() => {
    async function fetchSignature() {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('category', 'signature')
          .eq('is_available', true)
          .order('sort_order', { ascending: true })
          .limit(4)

        if (!error && data && data.length > 0) {
          const normalize = (item: any): MenuItem => ({
            ...item,
            image_url: item.image_url?.trim() || null,
          })
          setFeatured(normalize(data[0]))
          setOthers(data.slice(1).map(normalize) as MenuItem[])
        }
      } catch {
        // keep fallback
      }
    }
    fetchSignature()
  }, [])

  const getName = (item: MenuItem) =>
    locale === 'ru' ? item.name_ru : locale === 'en' ? item.name_en : item.name_ka

  const getDesc = (item: MenuItem) =>
    locale === 'ru'
      ? item.description_ru
      : locale === 'en'
        ? item.description_en
        : item.description_ka

  const titleLines = t.signature.title.split('\n')
  const leadLines = t.signature.lead.split('\n')

  return (
    <section id="signature" style={{ padding: '80px 60px 40px', background: 'var(--cream)' }}>
      <div className="mx-auto" style={{ maxWidth: '1300px' }}>

        {/* Header */}
        <div
          className="reveal sig-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '50px',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div>
            <p
              className="sig-eyebrow"
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '13px',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: 'var(--brown)',
                opacity: 0.85,
                marginBottom: '20px',
              }}
            >
              {t.signature.eyebrow}
            </p>
            <h2
              className="sig-title"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 'clamp(52px, 7vw, 96px)',
                fontWeight: 300,
                color: 'var(--brown)',
                lineHeight: 0.95,
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
            className="hidden md:block"
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontStyle: 'italic',
              fontSize: '18px',
              color: 'var(--brown)',
              opacity: 0.9,
              maxWidth: '260px',
              lineHeight: 1.8,
              textAlign: 'right',
            }}
          >
            {leadLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < leadLines.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>

        {/* Featured cinematic card — fully clickable, opens ProductModal */}
        <div
          className="reveal sig-featured-grid"
          role="button"
          tabIndex={0}
          onClick={() => setModalItem(featured)}
          onKeyDown={(e) => { if (e.key === 'Enter') setModalItem(featured) }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            marginBottom: '4px',
            cursor: 'pointer',
          }}
        >
          {/* Photo */}
          <div
            className="sig-featured-photo"
            style={{
              overflow: 'hidden',
              aspectRatio: '14/10',
              position: 'relative',
            }}
          >
            <img
              src={featured.image_url || '/photos/batumi-sunset-sun.png'}
              alt={getName(featured)}
              onError={(e) => {
                e.currentTarget.src = '/photos/batumi-sunset-sun.png'
              }}
              style={{
                width: '100%',
                height: '115%',
                objectFit: 'cover',
                objectPosition: 'center',
                marginTop: '-7%',
                transition: 'transform 8s ease',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.transform = 'none'
              }}
            />
          </div>

          {/* Dark text panel */}
          <div
            className="sig-featured-panel"
            style={{
              background: 'var(--brown)',
              padding: '36px 38px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <p
              className="sig-featured-label"
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '10px',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(243,232,218,0.4)',
                marginBottom: '20px',
              }}
            >
              {t.signature.badge} / {t.signature.number}
            </p>

            <h3
              className="sig-featured-name"
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: 'clamp(42px, 5vw, 68px)',
                fontWeight: 300,
                color: 'var(--cream)',
                lineHeight: 1,
                marginBottom: '20px',
              }}
            >
              {getName(featured)}
            </h3>

            <p
              className="sig-featured-desc"
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '13px',
                fontWeight: 300,
                color: 'rgba(243,232,218,0.6)',
                lineHeight: 1.9,
                maxWidth: '280px',
                marginBottom: '36px',
              }}
            >
              {getDesc(featured)}
            </p>

            <div className="sig-featured-meta" style={{ marginBottom: '32px' }}>
              {featured.weight_g && (
                <div
                  className="sig-featured-weight"
                  style={{
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '11px',
                    color: 'rgba(243,232,218,0.55)',
                    marginBottom: '4px',
                  }}
                >
                  {featured.weight_g} {t.unit.gram}
                </div>
              )}
              <p
                className="sig-featured-price"
                style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontSize: '32px',
                  fontWeight: 300,
                  color: 'var(--cream)',
                  margin: 0,
                }}
              >
                {featured.price} ₾
              </p>
            </div>

            <button
              className="sig-featured-btn"
              onClick={(e) => {
                e.stopPropagation()
                addItem(featured)
              }}
              style={{
                display: 'inline-block',
                border: '1px solid rgba(243,232,218,0.35)',
                color: 'rgba(243,232,218,0.85)',
                padding: '13px 36px',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'background 0.4s',
                background: 'transparent',
                width: 'fit-content',
                fontFamily: 'var(--font-manrope), sans-serif',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(243,232,218,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {t.signature.addToCart}
            </button>
          </div>
        </div>

        {/* Other signature items — fully clickable, unified card layout */}
        {others.length > 0 && (
          <div
            className="reveal reveal-delay-1 sig-others-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '4px',
            }}
          >
            {others.slice(0, 3).map((item) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => setModalItem(item)}
                onKeyDown={(e) => { if (e.key === 'Enter') setModalItem(item) }}
                className="sig-other-card"
                style={{
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.35)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="sig-other-img" style={{ aspectRatio: '4/3', overflow: 'hidden', flexShrink: 0 }}>
                  <img
                    src={item.image_url || '/photos/batumi-sunset-beach.png'}
                    alt={getName(item)}
                    onError={(e) => {
                      e.currentTarget.src = '/photos/batumi-sunset-beach.png'
                    }}
                    style={{
                      width: '100%',
                      height: '115%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      marginTop: '-7%',
                      transition: 'transform 7s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.06)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none'
                    }}
                  />
                </div>

                <div
                  className="sig-other-body"
                  style={{
                    padding: '18px 22px 20px',
                    borderTop: '1px solid rgba(91,59,44,0.1)',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <h3
                    className="sig-other-name"
                    style={{
                      fontFamily: 'var(--font-cormorant), serif',
                      fontSize: '26px',
                      fontWeight: 300,
                      color: 'var(--brown)',
                      marginBottom: '8px',
                    }}
                  >
                    {getName(item)}
                  </h3>

                  <p
                    className="sig-other-desc"
                    style={{
                      fontFamily: 'var(--font-manrope), sans-serif',
                      fontSize: '12px',
                      fontWeight: 300,
                      color: 'var(--dark)',
                      opacity: 0.55,
                      lineHeight: 1.75,
                      marginBottom: '20px',
                      flex: 1,
                    }}
                  >
                    {getDesc(item)}
                  </p>

                  <div
                    className="sig-other-footer"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 'auto',
                    }}
                  >
                    <div>
                      {item.weight_g && (
                        <div
                          className="sig-other-weight"
                          style={{
                            fontFamily: 'var(--font-manrope), sans-serif',
                            fontSize: '11px',
                            color: 'var(--brown)',
                            opacity: 0.55,
                            marginBottom: '2px',
                          }}
                        >
                          {item.weight_g} {t.unit.gram}
                        </div>
                      )}
                      <span
                        className="sig-other-price"
                        style={{
                          fontFamily: 'var(--font-cormorant), serif',
                          fontSize: '22px',
                          color: 'var(--brown)',
                        }}
                      >
                        {item.price} ₾
                      </span>
                    </div>

                    <button
                      className="sig-other-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        addItem(item)
                      }}
                      style={{
                        width: '34px',
                        height: '34px',
                        border: '1px solid rgba(91,59,44,0.3)',
                        background: 'none',
                        color: 'var(--brown)',
                        cursor: 'pointer',
                        fontSize: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s',
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--brown)'
                        e.currentTarget.style.color = 'var(--cream)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none'
                        e.currentTarget.style.color = 'var(--brown)'
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View all link */}
        <div className="text-center reveal reveal-delay-2 sig-view-all" style={{ marginTop: '56px' }}>
          <a
            href="#menu"
            style={{
              display: 'inline-block',
              border: '1px solid rgba(91,59,44,0.4)',
              color: 'var(--brown)',
              padding: '14px 44px',
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.4s',
              background: 'transparent',
              fontFamily: 'var(--font-manrope), sans-serif',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--brown)'
              e.currentTarget.style.color = 'var(--cream)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--brown)'
            }}
          >
            {t.signature.viewAll}
          </a>
        </div>
      </div>

      {/* Product detail modal — shared component */}
      <ProductModal item={modalItem} onClose={() => setModalItem(null)} />

      <style>{`
        @media (max-width: 900px) {
          #signature {
            padding: 36px 16px 28px !important;
          }
          #signature .sig-header {
            margin-bottom: 18px !important;
          }
          /* "ЭКСКЛЮЗИВНАЯ КОЛЛЕКЦИЯ" — уменьшено до декоративной подписи, как "АТМОСФЕРА" */
          #signature .sig-eyebrow {
            font-size: 10px !important;
            opacity: 0.5 !important;
            margin-bottom: 10px !important;
          }
          /* Заголовок Signature Collection */
          #signature .sig-title {
            font-size: clamp(38px, 11vw, 60px) !important;
          }

          /* Featured: фото и карточка — одинаковая высота через grid stretch + aspect-ratio убран с фото */
          #signature .sig-featured-grid {
            grid-template-columns: 1.15fr 1fr !important;
            margin-bottom: 3px !important;
            align-items: stretch !important;
          }
          #signature .sig-featured-photo {
            aspect-ratio: unset !important;
            height: 100% !important;
            min-height: 220px !important;
          }
          #signature .sig-featured-photo img {
            height: 100% !important;
            margin-top: 0 !important;
          }
          #signature .sig-featured-panel {
            height: 100% !important;
            min-height: 220px !important;
            padding: 16px 14px !important;
          }
          /* Текст внутри карточки — уменьшен по запросу */
          #signature .sig-featured-label {
            font-size: 8px !important;
            margin-bottom: 8px !important;
          }
          #signature .sig-featured-name {
            font-size: 18px !important;       /* было 22px → -20% */
            margin-bottom: 6px !important;
            line-height: 1.05 !important;
          }
          #signature .sig-featured-desc {
            font-size: 9px !important;          /* компактнее */
            margin-bottom: 8px !important;
            line-height: 1.45 !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
          }
          #signature .sig-featured-meta {
            margin-bottom: 10px !important;
          }
          #signature .sig-featured-weight {
            font-size: 9px !important;            /* вес уменьшен */
          }
          #signature .sig-featured-price {
            font-size: 20px !important;           /* цена остаётся акцентной, но компактнее */
          }
          #signature .sig-featured-btn {
            padding: 8px 16px !important;          /* кнопка компактнее */
            font-size: 8px !important;
            letter-spacing: 0.14em !important;
          }

          /* Нижние карточки — единый вид: высота, отступы, позиции */
          #signature .sig-others-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            grid-auto-rows: 1fr !important;
          }
          #signature .sig-other-img {
            aspect-ratio: 1/1 !important;
          }
          #signature .sig-other-body {
            padding: 10px 10px 12px !important;
          }
          #signature .sig-other-name {
            font-size: 14px !important;
            margin-bottom: 4px !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
            line-height: 1.2 !important;
          }
          #signature .sig-other-desc {
            font-size: 9px !important;
            line-height: 1.4 !important;
            margin-bottom: 0 !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
          }
          #signature .sig-other-footer {
            padding-top: 8px !important;
          }
          #signature .sig-other-weight {
            font-size: 8px !important;
          }
          #signature .sig-other-price {
            font-size: 16px !important;
          }
          #signature .sig-other-btn {
            width: 24px !important;
            height: 24px !important;
            font-size: 14px !important;
          }

          #signature .sig-view-all { margin-top: 28px !important; }
        }

        @media (max-width: 480px) {
          #signature .sig-featured-name {
            font-size: 16px !important;
          }
          #signature .sig-featured-panel {
            padding: 12px 10px !important;
          }
        }
      `}</style>
    </section>
  )
}
