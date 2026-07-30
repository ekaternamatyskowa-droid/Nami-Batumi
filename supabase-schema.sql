-- ============================================================
-- NAMI Batumi — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Table: menu_items ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_items (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category       TEXT NOT NULL CHECK (
                   category IN ('signature','classic','tempura','baked','sets','nigiri','gunkan','extras')
                 ),
  name_ru        TEXT NOT NULL,
  name_en        TEXT NOT NULL,
  name_ka        TEXT NOT NULL,          -- Georgian (ka)
  description_ru TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_ka TEXT NOT NULL DEFAULT '',
  price          NUMERIC(8,2) NOT NULL CHECK (price > 0),
  image_url      TEXT,
  is_available   BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured    BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for menu queries
CREATE INDEX IF NOT EXISTS idx_menu_items_category  ON menu_items (category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items (is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_sort      ON menu_items (sort_order);

-- ─── Table: orders ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  items               JSONB NOT NULL,          -- OrderItem[]
  total               NUMERIC(10,2) NOT NULL,
  customer_name       TEXT,
  customer_phone      TEXT,
  customer_address    TEXT,
  notes               TEXT,
  status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','confirmed','preparing','delivering','done','cancelled')),
  telegram_message_id INTEGER,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);

-- ─── Row Level Security ──────────────────────────────────────
-- menu_items: public read, no public write
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read available menu items"
  ON menu_items FOR SELECT
  USING (is_available = TRUE);

-- orders: public insert only (customer places order), no read
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can place an order"
  ON orders FOR INSERT
  WITH CHECK (TRUE);

-- ─── Supabase Storage Bucket: menu-images ────────────────────
-- Run in Supabase Dashboard → Storage → New Bucket
-- Name: menu-images
-- Public: TRUE
-- Allowed MIME: image/jpeg, image/png, image/webp

-- ─── Sample Seed Data (Signature collection) ─────────────────
INSERT INTO menu_items
  (category, name_ru, name_en, name_ka, description_ru, description_en, description_ka, price, is_available, is_featured, sort_order)
VALUES
  ('signature', 'Nami Black', 'Nami Black', 'ნამი ბლეგ',
   'Лосось, икра тобико, трюфельный соус, огурец, сливочный сыр',
   'Salmon, tobiko roe, truffle sauce, cucumber, cream cheese',
   'ორაგული, ტობიკო, ტრიუფელის სოუსი, კიტრი, კრემ-ყველი',
   18, TRUE, TRUE, 1),

  ('signature', 'Batumi Sunset', 'Batumi Sunset', 'ბათუმის მზის ჩასვლა',
   'Тунец, манго, авокадо, соус юзу, кунжут',
   'Tuna, mango, avocado, yuzu sauce, sesame',
   'თინუსი, მანგო, ავოკადო, იუზუს სოუსი, სეზამი',
   15, TRUE, TRUE, 2),

  ('signature', 'Sea Breeze', 'Sea Breeze', 'ზღვის ნიავი',
   'Краб, авокадо, огурец, икра масаго, зелёный лук',
   'Crab, avocado, cucumber, masago roe, spring onion',
   'კრაბი, ავოკადო, კიტრი, მასაგო, მწვანე ხახვი',
   14, TRUE, TRUE, 3),

  ('signature', 'Black Sea', 'Black Sea', 'შავი ზღვა',
   'Тунец, трюфельный соус, икра тобико, нори',
   'Tuna, truffle sauce, tobiko roe, nori',
   'თინუსი, ტრიუფელის სოუსი, ტობიკო, ნორი',
   16, TRUE, FALSE, 4),

  ('signature', 'Palm Garden', 'Palm Garden', 'პალმების ბაღი',
   'Угорь, огурец, авокадо, кунжут, соус унаги',
   'Eel, cucumber, avocado, sesame, unagi sauce',
   'გველთევზა, კიტრი, ავოკადო, სეზამი, უნაგის სოუსი',
   13, TRUE, FALSE, 5),

  ('signature', 'Golden Wave', 'Golden Wave', 'ოქროს ტალღა',
   'Запечённый лосось, сливочный сыр, икра масаго, соус спайси',
   'Baked salmon, cream cheese, masago roe, spicy sauce',
   'გამომცხვარი ორაგული, კრემ-ყველი, მასაგო, სპაისი სოუსი',
   15, TRUE, FALSE, 6),

  ('classic', 'Филадельфия', 'Philadelphia', 'ფილადელფია',
   'Лосось, сливочный сыр, огурец, нори',
   'Salmon, cream cheese, cucumber, nori',
   'ორაგული, კრემ-ყველი, კიტრი, ნორი',
   12, TRUE, FALSE, 1),

  ('classic', 'Калифорния', 'California', 'კალიფორნია',
   'Краб, авокадо, огурец, икра тобико',
   'Crab, avocado, cucumber, tobiko roe',
   'კრაბი, ავოკადო, კიტრი, ტობიკო',
   11, TRUE, FALSE, 2),

  ('tempura', 'Tempura Ebi', 'Tempura Ebi', 'ტემპურა ები',
   'Креветка в темпуре, авокадо, соус спайси',
   'Tempura shrimp, avocado, spicy sauce',
   'ტემპურა კრევეტი, ავოკადო, სპაისი სოუსი',
   13, TRUE, FALSE, 1),

  ('baked', 'Запечённый лосось', 'Baked Salmon', 'გამომცხვარი ორაგული',
   'Запечённый лосось, сливочный сыр, масаго, майонез',
   'Baked salmon, cream cheese, masago, mayo',
   'გამომცხვარი ორაგული, კრემ-ყველი, მასაგო, მაიონეზი',
   14, TRUE, FALSE, 1),

  ('extras', 'Соус спайси', 'Spicy Sauce', 'სპაისი სოუსი',
   'Острый майонезный соус',
   'Spicy mayo sauce',
   'სპაისი მაიონეზის სოუსი',
   1.5, TRUE, FALSE, 1),

  ('extras', 'Соус унаги', 'Unagi Sauce', 'უნაგის სოუსი',
   'Классический японский соус унаги',
   'Classic Japanese unagi sauce',
   'კლასიკური იაპონური უნაგის სოუსი',
   1.5, TRUE, FALSE, 2);
