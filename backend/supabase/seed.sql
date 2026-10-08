insert into food_brands(id,name) values
 ('rc','Royal Canin'),('hills','Hill''s Science Diet'),('proplan','Purina Pro Plan'),
 ('taste','Taste of the Wild'),('monge','Monge Natural Superpremium');

insert into food_presentations(brand_id,label,base_price) values
 ('rc','3 kg',768000000),('rc','7.5 kg',768000000),('rc','15 kg',768000000),
 ('hills','2.5 kg',832000000),('hills','7 kg',832000000),('hills','14 kg',832000000),
 ('proplan','3 kg',720000000),('proplan','7.5 kg',720000000),('proplan','15 kg',720000000),
 ('taste','2 kg',896000000),('taste','5.6 kg',896000000),('taste','12.2 kg',896000000),
 ('monge','2.5 kg',672000000),('monge','12 kg',672000000);

insert into pharmacy_products(id,name,category,normal_price) values
 ('bravecto','Bravecto Antiparasitario (1 tableta masticable - 3 meses)','Antiparasitario',152000),
 ('nexgard','NexGard Spectra (Protección mensual completa)','Antiparasitario',98000),
 ('condrovet','Condrovet Force HA (Salud Articular 120 comp.)','Suplemento',168000),
 ('omega3','Aceite de Salmón Puro Omega 3 & 6 (500ml)','Nutrición',84000),
 ('shampoo','Shampoo Antiséptico & Dermatológico (250ml)','Cuidado & Piel',66000),
 ('colirio','Gotas Oftálmicas Lubricantes Veterinarias','Oftalmología',56000);

insert into terms_versions(version, body_md) values ('1.0', 'Ver src/components/TermsModal.tsx — pegar texto oficial aquí.');
