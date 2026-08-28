export type Locale = 'ru' | 'en' | 'ge'

export interface MenuItem {
  id: string
  category: string
  name_ru: string
  name_en: string
  name_ka: string
  description_ru: string
  description_en: string
  description_ka: string
  price: number
  weight_g?: number
  image_url: string | null
  is_available: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
  // Timestamp until which this item counts as "new". NULL/absent or in the
  // past → no badge. Present and in the future → show the "NEW" badge.
  new_until?: string | null
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string | null
}

export interface Order {
  items: CartItem[]
  total: number
  customer_name: string
  customer_phone: string
  delivery_address: string
  notes?: string
}

export type MenuCategory =
  | 'signature'
  | 'classic'
  | 'tempura'
  | 'baked'
  | 'sets'
  | 'nigiri'
  | 'gunkan'
  | 'extras'
  | 'cold_rolls'
  | 'baked_rolls'
  | 'sauces'

export interface Translation {
  nav: {
    story: string
    menu: string
    delivery: string
    contacts: string
    cart: string
    phone: string
  }
  hero: {
    eyebrow: string
    subtitle: string
    cta: string
    scroll: string
  }
  story: {
    eyebrow: string
    heading: string
    text1: string
    text2: string
  }
  moments: {
    eyebrow: string
    title: string
    tagline: string
    labels: string[]
  }
  signature: {
    eyebrow: string
    title: string
    lead: string
    addToCart: string
    viewAll: string
    badge: string
    number: string
  }
  menu: {
    eyebrow: string
    title: string
    categories: Record<string, string>
    empty: string
    addToCart: string
    newBadge: string
  }
  delivery: {
    eyebrow: string
    title: string
    zone: string
    time: string
    zones: string[]
    items: Array<{ title: string; body: string }>
  }
  contact: {
    eyebrow: string
    title: string
    tagline: string
    sub: string
    cta: string
    instagram: string
    telegram: string
    phone: string
  }
  cart: {
    eyebrow: string
    empty: string
    total: string
    order: string
    close: string
    form: {
      name: string
      phone: string
      street: string
      building: string
      notes: string
      submit: string
      cancel: string
      placeholderName: string
      placeholderPhone: string
      placeholderStreet: string
      placeholderBuilding: string
      placeholderNotes: string
      validationError: string
      sendError: string
    }
    success: string
  }
  workingHours: {
    title: string
    body: string
    cta: string
  }
  unit: {
    gram: string
  }
  footer: {
    copy: string
  }
}
