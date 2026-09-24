-- Emails normalizados (el backend los guarda y busca en minúsculas)
update tutors set email = lower(trim(email));
alter table tutors add constraint tutors_email_lower check (email = lower(email));
