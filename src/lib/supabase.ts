import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export async function getMenuItems(category?: string) {
  let query = supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true)
    .order('sort_order', { ascending: true })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getSignatureItems() {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category', 'signature')
    .eq('is_available', true)
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })
    .limit(4)

  if (error) throw error
  return data ?? []
}
