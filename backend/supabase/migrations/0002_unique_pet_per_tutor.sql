-- Evita inscribir dos veces la misma mascota (mismo tutor + nombre + especie).
-- 1) Limpia duplicados existentes (deja el registro más antiguo).
--    OJO: borra memberships de las mascotas duplicadas; si tuvieran compras/canjes
--    (food_purchases, etc.) el DELETE fallará por FK y habrá que resolverlos a mano.
create temp table dup_pets as
select id from (
  select id, row_number() over (
    partition by tutor_id, lower(name), species order by created_at, id) rn
  from pets
) x where rn > 1;

delete from memberships where pet_id in (select id from dup_pets);
delete from pets where id in (select id from dup_pets);
drop table dup_pets;

-- 2) Restricción
create unique index pets_unique_per_tutor on pets (tutor_id, lower(name), species);
