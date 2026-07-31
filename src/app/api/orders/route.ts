import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendOrderToTelegram } from '@/lib/telegram'

// SERVER-ONLY client. Uses the service role key, which bypasses Row
// Level Security entirely — this is safe here because:
//   1. This file only runs on the server (Next.js Route Handler),
//      never in the browser bundle.
//   2. The variable name has NO "NEXT_PUBLIC_" prefix, so Next.js
//      never inlines it into client-side JS.
// Never import this file from a client component, and never rename
// the env var to start with NEXT_PUBLIC_.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    '[api/orders] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
      'Add SUPABASE_SERVICE_ROLE_KEY in Vercel → Settings → Environment Variables ' +
      '(value: Supabase → Project Settings → API → service_role key). ' +
      'Do NOT prefix it with NEXT_PUBLIC_ — it must stay server-only.',
  )
}

const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_SERVICE_ROLE_KEY ?? '', {
  auth: { persistSession: false },
})

export async function POST(req: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'Server misconfigured: SUPABASE_SERVICE_ROLE_KEY is not set' },
      { status: 500 },
    )
  }

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

    // Save order to Supabase (service role bypasses RLS, so this
    // insert + the following .select() both work without needing a
    // SELECT policy on the orders table)
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
        const { error: updateErr } = await supabase
          .from('orders')
          .update({ telegram_message_id: msgId })
          .eq('id', order.id)
        if (updateErr) {
          console.error('Failed to store telegram_message_id (non-fatal):', updateErr.message)
        }
      }
    } catch (telegramErr) {
      console.error(
        'Telegram send failed (non-fatal):',
        telegramErr instanceof Error ? telegramErr.message : telegramErr,
      )
    }

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 })
  } catch (err) {
    console.error('Order API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
