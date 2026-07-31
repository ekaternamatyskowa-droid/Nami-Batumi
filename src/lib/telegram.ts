import type { OrderItem } from '@/types/database'

export class TelegramError extends Error {}

export async function sendOrderToTelegram(order: {
  id: string
  items: OrderItem[]
  total: number
  customerName: string
  customerPhone: string
  customerAddress: string
  notes?: string | null
  paymentMethod?: string | null
  confirmedNoCallback?: boolean | null
}): Promise<number> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    throw new TelegramError('Telegram credentials are not configured')
  }

  const itemsText = order.items
    .map((item) => `• ${item.name}${item.qty > 1 ? ` ×${item.qty}` : ''} — ${item.price * item.qty} ₾`)
    .join('\n')

  const message = [
    `🍱 Новый заказ NAMI #${order.id.slice(-6).toUpperCase()}`,
    '',
    itemsText,
    '',
    `💰 Итого: ${order.total} ₾`,
    '',
    `👤 ${order.customerName}`,
    `📞 ${order.customerPhone}`,
    `📍 ${order.customerAddress}`,
    order.notes ? `📝 ${order.notes}` : null,
    order.paymentMethod ? `💳 Оплата: ${order.paymentMethod}` : null,
    order.confirmedNoCallback ? `✔️ Перезванивать не нужно` : null,
    '',
    `🕐 ${new Date().toLocaleTimeString('ru-RU', { timeZone: 'Asia/Tbilisi' })} (Батуми)`,
  ].filter(Boolean).join('\n')

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        reply_markup: {
          inline_keyboard: [[
            { text: '✅ Принять', callback_data: `accept_${order.id}` },
            { text: '❌ Отклонить', callback_data: `reject_${order.id}` },
          ]],
        },
      }),
    })
    const payload = await response.json().catch(() => null)
    if (!response.ok || !payload?.ok || !payload?.result?.message_id) {
      throw new TelegramError(payload?.description || `Telegram returned HTTP ${response.status}`)
    }
    return payload.result.message_id
  } catch (error) {
    if (error instanceof TelegramError) throw error
    if (error instanceof Error && error.name === 'AbortError') {
      throw new TelegramError('Telegram request timed out')
    }
    throw new TelegramError('Could not connect to Telegram')
  } finally {
    clearTimeout(timeout)
  }
}
