import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { wrap } from '../lib/errors';

export const catalogRouter = Router();

// Reemplaza PET_FOOD_BRANDS / PHARMACY_PRODUCTS de src/constants/data.ts
catalogRouter.get('/catalog', wrap(async (_req, res) => {
  const [brands, products, sites] = await Promise.all([
    supabase.from('food_brands').select('id,name,food_presentations(id,label,base_price)').eq('is_active', true),
    supabase.from('pharmacy_products').select('id,name,category,normal_price').eq('is_active', true),
    supabase.from('sites').select('id,name,address').eq('is_active', true)
  ]);
  for (const r of [brands, products, sites]) if (r.error) throw r.error;
  res.json({ brands: brands.data, pharmacyProducts: products.data, sites: sites.data });
}));

catalogRouter.get('/terms', wrap(async (_req, res) => {
  const { data, error } = await supabase
    .from('terms_versions').select('version,body_md,published_at')
    .order('id', { ascending: false }).limit(1).single();
  if (error) throw error;
  res.json(data);
}));
