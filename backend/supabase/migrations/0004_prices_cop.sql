-- Precios del catálogo: USD -> COP (1 USD ≈ 4.000 COP). Ajusta luego los valores reales desde Table Editor.
-- La guarda (< 1000) evita multiplicar dos veces si se ejecuta de nuevo.
update food_presentations set base_price = base_price * 4000 where base_price < 1000;
update pharmacy_products  set normal_price = normal_price * 4000 where normal_price < 1000;
-- Compras ya registradas con montos en USD (solo pruebas): convertir igual
update food_purchases     set unit_price = unit_price * 4000 where unit_price < 1000;
update pharmacy_purchases set subtotal = subtotal*4000, discount = discount*4000, total = total*4000 where subtotal < 1000;
