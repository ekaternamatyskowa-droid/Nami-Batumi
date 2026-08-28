-- ============================================================
-- NAMI Batumi — "НОВИНКА" badge support
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Add the new_until column to the existing menu_items table.
--    NULL by default => no badge for any existing item.
ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS new_until TIMESTAMPTZ DEFAULT NULL;

-- 2. Set new_until = date added + 14 days for the three new rolls.
--    Uses each row's own created_at, so it stays correct regardless of
--    when this script actually runs. Matches by name_en — adjust the
--    list if your rows use different exact names.
UPDATE menu_items
SET new_until = created_at + INTERVAL '14 days'
WHERE name_en IN ('Onyx', 'Blush', 'Lumi');

-- 3. Sanity check — run this after the UPDATE to confirm:
-- SELECT name_en, created_at, new_until, (new_until > now()) AS is_new
-- FROM menu_items
-- WHERE name_en IN ('Onyx', 'Blush', 'Lumi');
