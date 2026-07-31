import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendOrderToTelegram } from '@/lib/telegram'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      items,
      total,
      customer_name,
      customer_phone,
      customer_address,
      notes,
      payment_method,
      confirmed_no_callback,
    } = body

    // Validate required fields
    if (
      !items?.length ||
      !total ||
      !customer_name ||
      !customer_phone ||
      !customer_address
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save order to Supabase
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert({
        items,
        total,
        customer_name,
        customer_phone,
        customer_address,
        notes: notes || null,
        
        status: 'pending',
        telegram_message_id: null,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Supabase error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Send to Telegram (non-blocking)
    try {
      const msgId = await sendOrderToTelegram({
        id: order.id,
        items,
        total,
        customerName: customer_name,
        customerPhone: customer_phone,
        customerAddress: customer_address,
        notes,
        paymentMethod: payment_method,
        confirmedNoCallback: confirmed_no_callback,
      })

      if (msgId) {
        await supabase
          .from('orders')
          .update({ telegram_message_id: msgId })
          .eq('id', order.id)
      }
    } catch (telegramErr) {
      console.error('Telegram send failed (non-fatal):', telegramErr)
    }

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 })
  } catch (err) {
    console.error('Order API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
