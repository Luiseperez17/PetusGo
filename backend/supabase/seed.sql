insert into food_brands(id,name) values
 ('rc','Royal Canin'),('hills','Hill''s Science Diet'),('proplan','Purina Pro Plan'),
 ('taste','Taste of the Wild'),('monge','Monge Natural Superpremium');

insert into food_presentations(brand_id,label,base_price) values
 ('rc','3 kg',48),('rc','7.5 kg',48),('rc','15 kg',48),
 ('hills','2.5 kg',52),('hills','7 kg',52),('hills','14 kg',52),
 ('proplan','3 kg',45),('proplan','7.5 kg',45),('proplan','15 kg',45),
 ('taste','2 kg',56),('taste','5.6 kg',56),('taste','12.2 kg',56),
 ('monge','2.5 kg',42),('monge','12 kg',42);

insert into pharmacy_products(id,name,category,normal_price) values
 ('bravecto','Bravecto Antiparasitario (1 tableta masticable - 3 meses)','Antiparasitario',38),
 ('nexgard','NexGard Spectra (Protección mensual completa)','Antiparasitario',24.5),
 ('condrovet','Condrovet Force HA (Salud Articular 120 comp.)','Suplemento',42),
 ('omega3','Aceite de Salmón Puro Omega 3 & 6 (500ml)','Nutrición',21),
 ('shampoo','Shampoo Antiséptico & Dermatológico (250ml)','Cuidado & Piel',16.5),
 ('colirio','Gotas Oftálmicas Lubricantes Veterinarias','Oftalmología',14);

insert into terms_versions(version, body_md) values ('1.0', 'Ver src/components/TermsModal.tsx — pegar texto oficial aquí.');
