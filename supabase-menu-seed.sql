-- NAMI menu seed. Run in Supabase SQL Editor after deploying the catalogue update.
-- It changes only the existing menu_items category constraint and replaces rows
-- in the four NAMI catalogue categories.
BEGIN;

ALTER TABLE menu_items DROP CONSTRAINT IF EXISTS menu_items_category_check;
ALTER TABLE menu_items ADD CONSTRAINT menu_items_category_check CHECK (category IN (
  'signature', 'classic', 'tempura', 'baked', 'sets', 'nigiri', 'gunkan', 'extras',
  'cold_rolls', 'baked_rolls', 'sauces'
));

DELETE FROM menu_items WHERE category IN ('cold_rolls', 'baked_rolls', 'sets', 'sauces');

INSERT INTO menu_items
  (category, name_ru, name_en, name_ka, description_ru, description_en, description_ka, price, image_url, is_available, is_featured, sort_order)
VALUES
  ('cold_rolls', 'Logoon', 'Logoon', 'ლოგუნი', 'Рис, сливочный сыр, креветка в темпуре, тунец, огурец, кунжутный соус и чёрная икра.', 'Rice, cream cheese, tempura shrimp, tuna, cucumber, sesame sauce and black caviar.', 'ბრინჯი, კრემ-ყველი, ტემპურას კრევეტი, თინუსი, კიტრი, სეზამის სოუსი და შავი ხიზილალა.', 30, '/photos/Logoon.PNG', TRUE, FALSE, 1),
  ('cold_rolls', 'Nova', 'Nova', 'ნოვა', 'Рис, сливочный сыр, огурец, креветка, рыба, кунжутный соус и кунжут.', 'Rice, cream cheese, cucumber, shrimp, fish, sesame sauce and sesame seeds.', 'ბრინჯი, კრემ-ყველი, კიტრი, კრევეტი, თევზი, სეზამის სოუსი და სეზამი.', 30, '/photos/Nova.PNG', TRUE, FALSE, 2),
  ('cold_rolls', 'Caviar', 'Caviar', 'კავიარი', 'Рис, форель, чеддер, авокадо и имитация икры.', 'Rice, trout, cheddar, avocado and imitation caviar.', 'ბრინჯი, კალმახი, ჩედარი, ავოკადო და იმიტირებული ხიზილალა.', 30, '/photos/Caviar.jpg', TRUE, FALSE, 3),
  ('cold_rolls', 'Pearl', 'Pearl', 'პერლი', 'Рис, ананас, тунец, сливочный сыр и стружка тунца.', 'Rice, pineapple, tuna, cream cheese and tuna flakes.', 'ბრინჯი, ანანასი, თინუსი, კრემ-ყველი და თინუსის ფანტელები.', 30, '/photos/Pearl.PNG', TRUE, FALSE, 4),
  ('cold_rolls', 'Coast', 'Coast', 'ქოუსთი', 'Рис, форель, сливочный сыр, авокадо и сахар.', 'Rice, trout, cream cheese, avocado and sugar.', 'ბრინჯი, კალმახი, კრემ-ყველი, ავოკადო და შაქარი.', 30, '/photos/Coast.PNG', TRUE, FALSE, 5),
  ('cold_rolls', 'Sunset', 'Sunset', 'სანსეტი', 'Рис, сливочный сыр, огурец, чеддер и форель.', 'Rice, cream cheese, cucumber, cheddar and trout.', 'ბრინჯი, კრემ-ყველი, კიტრი, ჩედარი და კალმახი.', 30, '/photos/Sunset.PNG', TRUE, FALSE, 6),
  ('cold_rolls', 'Coral', 'Coral', 'ქორალი', 'Рис, сливочный сыр, огурец, креветки и форель.', 'Rice, cream cheese, cucumber, shrimp and trout.', 'ბრინჯი, კრემ-ყველი, კიტრი, კრევეტები და კალმახი.', 30, '/photos/Coral.PNG', TRUE, FALSE, 7),
  ('cold_rolls', 'Sakura', 'Sakura', 'საკურა', 'Рис, креветки, сливочный сыр, спаржа и краб.', 'Rice, shrimp, cream cheese, asparagus and crab.', 'ბრინჯი, კრევეტები, კრემ-ყველი, ასპარაგუსი და კრაბი.', 30, '/photos/Sakura.PNG', TRUE, FALSE, 8),
  ('cold_rolls', 'Shell', 'Shell', 'შელი', 'Рис, сливочный сыр, огурец, креветка и форель.', 'Rice, cream cheese, cucumber, shrimp and trout.', 'ბრინჯი, კრემ-ყველი, კიტრი, კრევეტი და კალმახი.', 30, '/photos/Shell.PNG', TRUE, FALSE, 9),
  ('cold_rolls', 'Emerald', 'Emerald', 'ემერალდი', 'Рис, краб, огурец, форель, тунец и авокадо.', 'Rice, crab, cucumber, trout, tuna and avocado.', 'ბრინჯი, კრაბი, კიტრი, კალმახი, თინუსი და ავოკადო.', 30, '/photos/Emerald.PNG', TRUE, FALSE, 10),
  ('baked_rolls', 'Flame', 'Flame', 'ფლეიმი', 'Рис, стружка тунца, чеддер, сливочный сыр, креветка, авокадо, шапка и унаги.', 'Rice, tuna flakes, cheddar, cream cheese, shrimp, avocado, topping and unagi.', 'ბრინჯი, თინუსის ფანტელები, ჩედარი, კრემ-ყველი, კრევეტი, ავოკადო, შაპკა და უნაგი.', 30, '/photos/Flame.PNG', TRUE, FALSE, 1),
  ('baked_rolls', 'Sail', 'Sail', 'სეილი', 'Рис, сливочный сыр, огурец, краб, шапка и унаги.', 'Rice, cream cheese, cucumber, crab, topping and unagi.', 'ბრინჯი, კრემ-ყველი, კიტრი, კრაბი, შაპკა და უნაგი.', 30, '/photos/Sail.PNG', TRUE, FALSE, 2),
  ('baked_rolls', 'Ember', 'Ember', 'ემბერი', 'Рис, сливочный сыр, тунец, огурец, стружка тунца, шапка и унаги.', 'Rice, cream cheese, tuna, cucumber, tuna flakes, topping and unagi.', 'ბრინჯი, კრემ-ყველი, თინუსი, კიტრი, თინუსის ფანტელები, შაპკა და უნაგი.', 30, '/photos/Ember.PNG', TRUE, FALSE, 3),
  ('baked_rolls', 'Velvet', 'Velvet', 'ველვეტი', 'Рис, сливочный сыр, креветка, краб, огурец, шапка и унаги.', 'Rice, cream cheese, shrimp, crab, cucumber, topping and unagi.', 'ბრინჯი, კრემ-ყველი, კრევეტი, კრაბი, კიტრი, შაპკა და უნაგი.', 30, '/photos/Velvet.PNG', TRUE, FALSE, 4),
  ('baked_rolls', 'Ruby', 'Ruby', 'რუბი', 'Рис, огурец, сливочный сыр, форель, тунец и панировка.', 'Rice, cucumber, cream cheese, trout, tuna and breading.', 'ბრინჯი, კიტრი, კრემ-ყველი, კალმახი, თინუსი და პანირება.', 30, '/photos/Ruby.PNG', TRUE, FALSE, 5),
  ('baked_rolls', 'Ignite', 'Ignite', 'იგნაითი', 'Рис, сливочный сыр, огурец, форель и панировка.', 'Rice, cream cheese, cucumber, trout and breading.', 'ბრინჯი, კრემ-ყველი, კიტრი, კალმახი და პანირება.', 30, '/photos/Ignite.PNG', TRUE, FALSE, 6),
  ('baked_rolls', 'Blase', 'Blase', 'ბლეიზი', 'Рис, сливочный сыр, огурец, форель, шапка и унаги.', 'Rice, cream cheese, cucumber, trout, topping and unagi.', 'ბრინჯი, კრემ-ყველი, კიტრი, კალმახი, შაპკა და უნაგი.', 30, '/photos/Blaze.PNG', TRUE, FALSE, 7),
  ('sets', 'Mizu', 'Mizu', 'მიზუ', 'Сет из роллов Shell, Caviar и Sakura.', 'A set of Shell, Caviar and Sakura rolls.', 'სეტი როლებით: Shell, Caviar და Sakura.', 30, '/photos/Mizu.PNG', TRUE, TRUE, 1),
  ('sets', 'Fusion', 'Fusion', 'ფიუჟენი', 'Сет из роллов Ligoon, Pearl и Ember.', 'A set of Ligoon, Pearl and Ember rolls.', 'სეტი როლებით: Ligoon, Pearl და Ember.', 30, '/photos/Fusion.JPG', TRUE, TRUE, 2),
  ('sets', 'Supreme', 'Supreme', 'სუპრიმი', 'Сет из роллов Sail, Coast и Emerald.', 'A set of Sail, Coast and Emerald rolls.', 'სეტი როლებით: Sail, Coast და Emerald.', 30, '/photos/Supreme.JPG', TRUE, TRUE, 3),
  ('sauces', 'Унаги', 'Unagi', 'უნაგი', 'Классический соус унаги.', 'Classic unagi sauce.', 'კლასიკური უნაგის სოუსი.', 30, NULL, TRUE, FALSE, 1),
  ('sauces', 'Соевый соус', 'Soy sauce', 'სოიოს სოუსი', 'Классический соевый соус.', 'Classic soy sauce.', 'კლასიკური სოიოს სოუსი.', 30, NULL, TRUE, FALSE, 2),
  ('sauces', 'Васаби', 'Wasabi', 'ვასაბი', 'Классический васаби.', 'Classic wasabi.', 'კლასიკური ვასაბი.', 30, NULL, TRUE, FALSE, 3),
  ('sauces', 'Имбирь', 'Pickled ginger', 'დამარინადებული კოჭა', 'Маринованный имбирь.', 'Pickled ginger.', 'დამარინადებული კოჭა.', 30, NULL, TRUE, FALSE, 4),
  ('sauces', 'Сладкий чили', 'Sweet chilli', 'ტკბილი ჩილი', 'Соус сладкий чили.', 'Sweet chilli sauce.', 'ტკბილი ჩილის სოუსი.', 30, NULL, TRUE, FALSE, 5),
  ('sauces', 'Кимчи', 'Kimchi', 'კიმჩი', 'Соус кимчи.', 'Kimchi sauce.', 'კიმჩის სოუსი.', 30, NULL, TRUE, FALSE, 6);

COMMIT;
