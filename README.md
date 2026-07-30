# NAMI — Inspired by Batumi
### Premium sushi delivery · Батуми, Грузия

A luxury lifestyle brand website for NAMI sushi delivery, inspired by the sea and evenings of Batumi.

---

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** — PostgreSQL + Storage
- **Telegram Bot API** — order notifications

---

## Quick Start

### 1. Clone & install

```bash
cd nami
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... # server-only; never expose this in NEXT_PUBLIC_*
TELEGRAM_BOT_TOKEN=1234567890:ABC...
TELEGRAM_CHAT_ID=123456789
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste the contents of `supabase-schema.sql` → Run
   - For an existing database, run `supabase-orders-migration.sql` instead.
3. Go to **Storage** → New bucket:
   - Name: `menu-images`
   - Public: ✅
   - Allowed MIME types: `image/jpeg, image/png, image/webp`

### 4. Set up Telegram Bot

1. Open [@BotFather](https://t.me/BotFather) → `/newbot`
2. Copy the token → paste into `TELEGRAM_BOT_TOKEN`
3. Start a chat with your bot, then open:
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
4. Find `"chat":{"id": ...}` → paste into `TELEGRAM_CHAT_ID`

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout + providers + fonts
│   ├── page.tsx            # Main page — assembles all sections
│   ├── globals.css         # Brand styles + animations
│   └── api/
│       └── orders/
│           └── route.ts    # POST /api/orders → Supabase + Telegram
├── components/
│   ├── Nav.tsx             # Fixed navigation with lang switcher
│   ├── HeroSection.tsx     # Fullscreen hero with parallax + wave
│   ├── WaveTransition.tsx  # Animated wave divider (wow moment)
│   ├── StorySection.tsx    # Brand story with real Batumi photo
│   ├── MomentsSection.tsx  # Editorial photo grid
│   ├── SignatureSection.tsx # Signature collection from Supabase
│   ├── MenuSection.tsx     # Full menu by category from Supabase
│   ├── DeliverySection.tsx # Delivery info over boulevard photo
│   ├── ContactSection.tsx  # Instagram / Telegram / Phone
│   ├── Footer.tsx          # Minimal footer
│   ├── CartPanel.tsx       # Slide-in cart with qty controls
│   └── OrderForm.tsx       # Order modal → /api/orders
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── telegram.ts         # Telegram sendMessage helper
│   ├── translations.ts     # RU / EN / GE strings
│   ├── locale-context.tsx  # Language context + useLocale()
│   └── cart-context.tsx    # Cart state + useCart()
├── hooks/
│   └── useReveal.ts        # Scroll-triggered reveal helper
└── types/
    ├── index.ts            # App types (Locale, Translation, etc.)
    └── database.ts         # Supabase DB types
public/
└── photos/                 # All Batumi photography (13 images)
supabase-schema.sql         # Full DB schema + seed data
```

---

## Adding Menu Items

### Via Supabase Dashboard

1. Go to **Table Editor** → `menu_items`
2. Click **Insert row**
3. Fill in: `category`, `name_ru/en/ka`, `description_ru/en/ka`, `price`
4. Upload photo to Storage → `menu-images` → copy URL → paste to `image_url`

### Via SQL

```sql
INSERT INTO menu_items (category, name_ru, name_en, name_ka, description_ru, description_en, description_ka, price, sort_order)
VALUES ('signature', 'Ролл', 'Roll', 'როლი', 'Состав RU', 'Ingredients EN', 'შემადგენლობა KA', 14, 7);
```

---

## Languages

| Code | Language   |
|------|-----------|
| `ru` | Русский    |
| `en` | English    |
| `ge` | ქართული    |

All UI strings are in `src/lib/translations.ts`.
Menu item translations are stored per-row in Supabase (`name_ru`, `name_en`, `name_ka`).

---

## Order Flow

```
Customer → Cart → OrderForm → POST /api/orders
                                  ├── Supabase: INSERT orders
                                  └── Telegram: sendMessage to operator
```

Telegram message includes:
- Order items + prices
- Total
- Customer name, phone, address
- Inline buttons: ✅ Accept / ❌ Decline

---

## Deployment (Vercel)

```bash
npx vercel
```

Add environment variables in Vercel Dashboard → Settings → Environment Variables.

---

## Brand

- **Fonts:** Cormorant Garamond (headings) · Manrope (body)
- **Colors:** `#F3E8DA` cream · `#5B3B2C` brown · `#A8C9DD` sea blue · `#2A2624` dark
- **Concept:** Luxury seaside lifestyle brand from Batumi
