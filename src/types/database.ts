export type Database = {
  public: {
    Tables: {
      menu_items: {
        Row: {
          id: string
          name_ru: string
          name_en: string
          name_ka: string
          description_ru: string
          description_en: string
          description_ka: string
          price: number
          category: 'signature' | 'classic' | 'tempura' | 'baked' | 'sets' | 'nigiri' | 'gunkan' | 'extras' | 'cold_rolls' | 'baked_rolls' | 'sauces'
          image_url: string | null
          is_available: boolean
          is_featured: boolean
          sort_order: number
          created_at: string
          new_until: string | null
        }
        Insert: Omit<Database['public']['Tables']['menu_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['menu_items']['Insert']>
      }
      orders: {
        Row: {
          id: string
          items: OrderItem[]
          total: number
          customer_name: string | null
          customer_phone: string | null
          customer_address: string | null
          notes: string | null
          status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'done' | 'cancelled'
          telegram_message_id: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
    }
  }
}

export type MenuItem = Database['public']['Tables']['menu_items']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = {
  id: string
  name: string
  price: number
  qty: number
}
