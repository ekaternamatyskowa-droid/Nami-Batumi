'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useLocale } from '@/lib/locale-context'
import { useCart } from '@/lib/cart-context'
import { supabase } from '@/lib/supabase'
import { ProductModal } from './ProductModal'
import { isNewItem } from '@/lib/new-badge'
import type { MenuItem } from '@/types'

const FALLBACK_SIGNATURE: MenuItem[] = [
  { id:'fs1',category:'signature',name_ru:'Nami Black',name_en:'Nami Black',name_ka:'ნამი ბლეგ',description_ru:'Лосось, икра тобико, трюфельный соус, огурец',description_en:'Salmon, tobiko roe, truffle sauce, cucumber',description_ka:'ორაგული, ტობიკო, ტრიუფელის სოუსი',price:18,image_url:null,is_available:true,is_featured:true,sort_order:1,created_at:''},
  { id:'fs2',category:'signature',name_ru:'Batumi Sunset',name_en:'Batumi Sunset',name_ka:'ბათუმის მზის ჩასვლა',description_ru:'Тунец, манго, авокадо, соус юзу',description_en:'Tuna, mango, avocado, yuzu sauce',description_ka:'თინუსი, მანგო, ავოკადო, იუზუს სოუსი',price:15,image_url:null,is_available:true,is_featured:true,sort_order:2,created_at:''},
  { id:'fs3',category:'signature',name_ru:'Sea Breeze',name_en:'Sea Breeze',name_ka:'ზღვის ნიავი',description_ru:'Краб, авокадо, огурец, икра масаго',description_en:'Crab, avocado, cucumber, masago',description_ka:'კრაბი, ავოკადო, კიტრი, მასაგო',price:14,image_url:null,is_available:true,is_featured:false,sort_order:3,created_at:''},
  { id:'fs4',category:'signature',name_ru:'Black Sea',name_en:'Black Sea',name_ka:'შავი ზღვა',description_ru:'Тунец, трюфельный соус, икра тобико',description_en:'Tuna, truffle sauce, tobiko roe',description_ka:'თინუსი, ტრიუფელის სოუსი, ტობიკო',price:16,image_url:null,is_available:true,is_featured:false,sort_order:4,created_at:''},
  { id:'fs5',category:'signature',name_ru:'Palm Garden',name_en:'Palm Garden',name_ka:'პალმების ბაღი',description_ru:'Угорь, огурец, авокадо, соус унаги',description_en:'Eel, cucumber, avocado, unagi sauce',description_ka:'გველთევზა, კიტრი, ავოკადო, უნაგის სოუსი',price:13,image_url:null,is_available:true,is_featured:false,sort_order:5,created_at:''},
  { id:'fs6',category:'signature',name_ru:'Golden Wave',name_en:'Golden Wave',name_ka:'ოქროს ტალღა',description_ru:'Запечённый лосось, сливочный сыр, икра масаго',description_en:'Baked salmon, cream cheese, masago',description_ka:'გამომცხვარი ორაგული, კრემ-ყველი, მასაგო',price:15,image_url:null,is_available:true,is_featured:false,sort_order:6,created_at:''},
]

const CATEGORIES = [
  'cold_rolls',
  'tempura',
  'baked_rolls',
  'sets',
  'sauces',
] as const

// Module-level cache: persists for the lifetime of the page (not per
// component instance), so once a category has been fetched, switching
// back to it is instant — no repeated Supabase round-trip.
const menuItemsCache: Partial<Record<string, MenuItem[]>> = {}

export function MenuSection() {
  const { locale, t } = useLocale()
  const { addItem } = useCart()
  const [activeCategory, setActiveCategory] = useState('cold_rolls')
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [modalItem, setModalItem] = useState<MenuItem | null>(null)

  useEffect(() => {
    // Already fetched this category in this session — reuse it, no network call
    const cached = menuItemsCache[activeCategory]
    if (cached) {
      setItems(cached)
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchItems() {
      setLoading(true)
      const { data, error } = await supabase
        .from('menu_items')
        // Only the columns actually rendered by the menu card / modal —
        // smaller payload than select('*')
        .select('id, name_ru, name_en, name_ka, description_ru, description_en, description_ka, price, image_url, sort_order, new_until')
        .eq('category', activeCategory)
        .eq('is_available', true)
        .order('sort_order', { ascending: true })

      if (cancelled) return // user already switched tabs again — ignore stale response

      if (!error && data && data.length > 0) {
        const typedData = data as MenuItem[]
        menuItemsCache[activeCategory] = typedData
        setItems(typedData)
      } else {
        if (error) {
          console.error('[MenuSection] Supabase fetch error for category', activeCategory, error)
        }
        setItems([])
      }
      setLoading(false)
    }
    fetchItems()

    return () => {
      cancelled = true
    }
  }, [activeCategory])

  const getName = (item: MenuItem) =>
    locale === 'ru' ? item.name_ru : locale === 'en' ? item.name_en : item.name_ka

  const getDesc = (item: MenuItem) =>
    locale === 'ru'
      ? item.description_ru
      : locale === 'en'
        ? item.description_en
        : item.description_ka

  return (
    <section
      id="menu"
      style={{ padding: '40px 60px 120px', background: 'var(--cream-2)' }}
    >
      <div
        className="mx-auto menu-inner"
        style={{ maxWidth: '1300px' }}
      >
        {/* Header */}
        <p
          className="text-[13px] tracking-[0.35em] uppercase mb-5 menu-eyebrow"
          style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            color: 'var(--brown)',
            opacity: 0.85,
          }}
        >
          {t.menu.eyebrow}
        </p>

        <h2
          className="font-cormorant font-light mb-14 menu-title"
          style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontSize: 'clamp(42px, 5vw, 72px)',
            color: 'var(--brown)',
          }}
        >
          {t.menu.title}
        </h2>

        {/* Category tabs — desktop static, mobile scrollable */}
        <div
          className="menu-categories"
          style={{ borderBottom: '1px solid rgba(91,59,44,0.15)', marginBottom: '56px' }}
        >
          <div className="menu-categories-inner flex gap-0 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="transition-all duration-300 whitespace-nowrap menu-cat-btn"
                style={{
                  padding: '12px 24px',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--brown)',
                  cursor: 'pointer',
                  borderBottom: 'none',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderBottomStyle: 'solid',
                  borderBottomWidth: '1.5px',
                  borderBottomColor: activeCategory === cat ? 'var(--brown)' : 'transparent',
                  marginBottom: '-1px',
                  background: 'none',
                  opacity: activeCategory === cat ? 1 : 0.5,
                  fontFamily: 'var(--font-manrope), sans-serif',
                  flexShrink: 0,
                }}
              >
                {t.menu.categories[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Items grid */}
        {loading ? (
          <div
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: '24px',
              color: 'var(--brown)',
              opacity: 0.4,
              fontStyle: 'italic',
              textAlign: 'center',
              padding: '60px 0',
            }}
          >
            ···
          </div>
        ) : items.length === 0 ? (
          <p
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: '26px',
              color: 'var(--brown)',
              opacity: 0.3,
              fontStyle: 'italic',
              letterSpacing: '0.05em',
              textAlign: 'center',
              padding: '60px 0',
            }}
          >
            {t.menu.empty}
          </p>
        ) : (
          <div
  className="menu-grid"
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '4px',
  }}
>
            {items.map((item) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => setModalItem(item)}
                onKeyDown={(e) => { if (e.key === 'Enter') setModalItem(item) }}
                className="menu-card menu-card-hover"
                style={{
                  background: 'var(--cream-2)',
                  padding: '24px',
                  cursor: 'pointer',
                }}
              >
                {item.image_url && (
                  <div
                    className="menu-card-img-wrap"
                    style={{
                      aspectRatio: '4/2.8',
                      overflow: 'hidden',
                      marginBottom: '20px',
                      position: 'relative',
                    }}
                  >
                    {isNewItem(item.new_until) && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          zIndex: 1,
                          background: 'var(--brown)',
                          color: 'var(--cream)',
                          fontFamily: 'var(--font-manrope), sans-serif',
                          fontSize: '9px',
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          padding: '5px 10px',
                        }}
                      >
                        {t.menu.newBadge}
                      </span>
                    )}
                    <Image
                      src={item.image_url}
                      alt={getName(item)}
                      fill
                      loading="lazy"
                      sizes="(max-width: 900px) 50vw, 33vw"
                      style={{
                        objectFit: 'cover',
                        transition: 'transform 6s ease',
                      }}
                      onMouseEnter={(e) => {
                        ;(e.target as HTMLImageElement).style.transform = 'scale(1.05)'
                      }}
                      onMouseLeave={(e) => {
                        ;(e.target as HTMLImageElement).style.transform = 'none'
                      }}
                    />
                  </div>
                )}

                <h3
                  className="menu-card-name font-cormorant font-light mb-2"
                  style={{
                    fontFamily: 'var(--font-cormorant), serif',
                    fontSize: '22px',
                    color: 'var(--brown)',
                  }}
                >
                  {getName(item)}
                </h3>

                <p
                  className="menu-card-desc font-light mb-5"
                  style={{
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '12px',
                    color: 'var(--dark)',
                    opacity: 0.55,
                    lineHeight: 1.75,
                  }}
                >
                  {getDesc(item)}
                </p>

                <div className="flex justify-between items-center">
                  <span
                    className="font-cormorant"
                    style={{
                      fontFamily: 'var(--font-cormorant), serif',
                      fontSize: '20px',
                      color: 'var(--brown)',
                    }}
                  >
                    {item.price} ₾
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      addItem(item)
                    }}
                    className="menu-add-btn"
                    style={{
                      width: '30px',
                      height: '30px',
                      border: '1px solid rgba(91,59,44,0.25)',
                      background: 'none',
                      color: 'var(--brown)',
                      cursor: 'pointer',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      const btn = e.target as HTMLButtonElement
                      btn.style.background = 'var(--brown)'
                      btn.style.color = 'var(--cream)'
                    }}
                    onMouseLeave={(e) => {
                      const btn = e.target as HTMLButtonElement
                      btn.style.background = 'none'
                      btn.style.color = 'var(--brown)'
                    }}
                    aria-label={`${t.signature.addToCart} ${getName(item)} Button`}
                  >
                    {t.menu.addToCart}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProductModal item={modalItem} onClose={() => setModalItem(null)} />

      <style>{`
        @media (max-width: 900px) {
          /* Хвостовое пустое пространство после последней карточки уменьшено на ~45% (120px → 64px) */
          #menu {
            padding: 24px 16px 64px !important;
          }
          #menu .menu-title {
            margin-bottom: 20px !important;
            font-size: clamp(32px, 9vw, 52px) !important;
          }
          /* "ВСЁ МЕНЮ" — эталон: как «ЭКСКЛЮЗИВНАЯ КОЛЛЕКЦИЯ» в Signature */
          #menu .menu-eyebrow {
            font-size: 10px !important;
            letter-spacing: 0.35em !important;
            opacity: 0.5 !important;
            margin-bottom: 10px !important;
            line-height: 1 !important;
          }
          #menu .menu-categories {
            margin-bottom: 16px !important;
            margin-left: -16px;
            margin-right: -16px;
          }
          #menu .menu-categories-inner {
            padding: 0 16px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          #menu .menu-categories-inner::-webkit-scrollbar {
            display: none;
          }
          #menu .menu-cat-btn {
            padding: 9px 14px !important;
            font-size: 9px !important;
          }

          /* 2 карточки в ряд, одинаковая высота */
          #menu .menu-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-auto-rows: 1fr !important;
            gap: 4px !important;
          }
          #menu .menu-card {
            padding: 10px !important;
            display: flex !important;
            flex-direction: column !important;
          }
          #menu .menu-card-img-wrap {
            margin-bottom: 8px !important;
            aspect-ratio: 4/3 !important;
            flex-shrink: 0 !important;
          }
          #menu .menu-card-name {
            font-size: 14px !important;
            margin-bottom: 3px !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
            line-height: 1.15 !important;
          }
          #menu .menu-card-desc {
            font-size: 10px !important;
            line-height: 1.45 !important;
            margin-bottom: 0 !important;
            flex: 1 !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
          }
          /* Цена+кнопка прижаты к низу карточки */
          #menu .menu-card > div:last-child {
            margin-top: auto !important;
            padding-top: 8px !important;
          }
          #menu .menu-card > div:last-child span {
            font-size: 16px !important;
          }
          #menu .menu-add-btn {
            width: 26px !important;
            height: 26px !important;
            font-size: 15px !important;
          }
        }
      `}</style>
    </section>
  )
}
