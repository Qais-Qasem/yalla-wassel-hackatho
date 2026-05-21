-- ============================================================
-- YALLA WASSEL - Auth Users for Demo
-- Creates auth.users entries matching the demo quick-login buttons
-- ============================================================

-- Create demo accounts (safe to re-run)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'hadeel@demo.com', crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}'),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000010', 'authenticated', 'authenticated', 'mahmoud@demo.com', crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}'),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000011', 'authenticated', 'authenticated', 'wael@demo.com', crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}'),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000012', 'authenticated', 'authenticated', 'sami@demo.com', crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, encrypted_password = EXCLUDED.encrypted_password, email_confirmed_at = now();

-- Add identities (needed for login) - ignore any conflicts
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
SELECT email, id, jsonb_build_object('sub', id, 'email', email), 'email', now(), now(), now()
FROM auth.users
WHERE email IN ('hadeel@demo.com', 'mahmoud@demo.com', 'wael@demo.com', 'sami@demo.com')
  AND id NOT IN (SELECT user_id FROM auth.identities WHERE provider = 'email');
