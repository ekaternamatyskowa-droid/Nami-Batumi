import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { sendOrderToTelegram } from '@/lib/telegram'
import type { OrderItem } from '@/types/database'

export const runtime = 'nodejs'

type OrderInput = {
  items: OrderItem[]
  total: number
  customer_name: string
  customer_phone: string
  customer_address: string
  notes: string | null
}

function error(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status })
}

function parseOrder(body: unknown): OrderInput | null {
  if (!body || typeof body !== 'object') return null
  const data = body as Record<string, unknown>
  if (!Array.isArray(data.items) || data.items.length === 0 || data.items.length > 50) return null

  const items = data.items.map((item): OrderItem | null => {
    if (!item || typeof item !== 'object') return null
    const value = item as Record<string, unknown>
    if (typeof value.id !== 'string' || typeof value.name !== 'string' ||
      typeof value.price !== 'number' || typeof value.qty !== 'number' ||
      !value.id.trim() || !value.name.trim() || !Number.isFinite(value.price) || value.price <= 0 ||
      !Number.isInteger(value.qty) || value.qty < 1 || value.qty > 99) return null
    return { id: value.id.trim(), name: value.name.trim().slice(0, 160), price: Math.round(value.price * 100) / 100, qty: value.qty }
  })
  if (items.some((item) => item === null)) return null

  const name = typeof data.customer_name === 'string' ? data.customer_name.trim() : ''
  const phone = typeof data.customer_phone === 'string' ? data.customer_phone.trim() : ''
  const address = typeof data.customer_address === 'string' ? data.customer_address.trim() : ''
  const notes = typeof data.notes === 'string' ? data.notes.trim().slice(0, 500) : null
  if (!name || !phone || !address) return null

  const orderItems = items as OrderItem[]
  const total = Math.round(orderItems.reduce((sum, item) => sum + item.price * item.qty, 0) * 100) / 100
  return {
    items: orderItems,
    total,
    customer_name: name.slice(0, 120),
    customer_phone: phone.slice(0, 50),
    customer_address: address.slice(0, 300),
    notes: notes || null,
  }
}

export async function POST(request: NextRequest) {
  let input: OrderInput | null
  try {
    input = parseOrder(await request.json())
  } catch {
    return error('Некорректный формат заказа.', 400)
  }
  if (!input) return error('Проверьте состав заказа и обязательные поля.', 400)

  let supabase
  try {
    supabase = createSupabaseAdminClient()
  } catch {
    console.error('Supabase server credentials are not configured')
    return error('Сервис приёма заказов временно недоступен.', 503)
  }

  const { data: order, error: insertError } = await supabase
    .from('orders')
    .insert({ ...input, status: 'pending', telegram_message_id: null })
    .select()
    .single()

  if (insertError || !order) {
    console.error('Order insert failed', insertError)
    return error('Не удалось сохранить заказ. Попробуйте ещё раз.', 503)
  }

  try {
    const messageId = await sendOrderToTelegram({
      id: order.id,
      items: input.items,
      total: input.total,
      customerName: input.customer_name,
      customerPhone: input.customer_phone,
      customerAddress: input.customer_address,
      notes: input.notes,
    })
    const { error: updateError } = await supabase
      .from('orders')
      .update({ telegram_message_id: messageId })
      .eq('id', order.id)

    if (updateError) {
      console.error('Telegram message id update failed', updateError)
      return error('Заказ сохранён, но не удалось подтвердить отправку в Telegram.', 502)
    }
  } catch (telegramError) {
    console.error('Telegram delivery failed for order', order.id, telegramError)
    return error('Заказ сохранён, но уведомление в Telegram не отправлено. Попробуйте ещё раз или свяжитесь с рестораном.', 502)
  }

  return NextResponse.json({ success: true, orderId: order.id }, { status: 201 })
}
