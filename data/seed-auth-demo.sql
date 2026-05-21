-- ============================================================
-- YALLA WASSEL - Auth Users for Demo
-- Run this AFTER seed.sql in Supabase SQL Editor
-- Creates auth.users entries matching the demo quick-login buttons
-- ============================================================

-- Create demo accounts
DO $$
DECLARE
  uid uuid;
BEGIN

  -- Clean up any existing demo users first
  DELETE FROM auth.identities WHERE user_id IN (
    SELECT id FROM auth.users WHERE email IN ('hadeel@demo.com', 'mahmoud@demo.com', 'wael@demo.com', 'sami@demo.com')
  );
  DELETE FROM auth.sessions WHERE user_id IN (
    SELECT id FROM auth.users WHERE email IN ('hadeel@demo.com', 'mahmoud@demo.com', 'wael@demo.com', 'sami@demo.com')
  );
  DELETE FROM auth.refresh_tokens WHERE user_id IN (
    SELECT id FROM auth.users WHERE email IN ('hadeel@demo.com', 'mahmoud@demo.com', 'wael@demo.com', 'sami@demo.com')
  );
  DELETE FROM auth.users WHERE email IN ('hadeel@demo.com', 'mahmoud@demo.com', 'wael@demo.com', 'sami@demo.com');

  -- 1. Hadeel (Dispatcher) - id matches seed.sql
  uid := '00000000-0000-0000-0000-000000000001';
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', 'hadeel@demo.com', crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');
  INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (uid, uid, jsonb_build_object('sub', uid, 'email', 'hadeel@demo.com'), 'email', now(), now(), now());

  -- 2. Mahmoud Salem (Driver) - id matches seed.sql
  uid := '00000000-0000-0000-0000-000000000010';
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', 'mahmoud@demo.com', crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');
  INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (uid, uid, jsonb_build_object('sub', uid, 'email', 'mahmoud@demo.com'), 'email', now(), now(), now());

  -- 3. Wael Odeh (Driver) - id matches seed.sql
  uid := '00000000-0000-0000-0000-000000000011';
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', 'wael@demo.com', crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');
  INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (uid, uid, jsonb_build_object('sub', uid, 'email', 'wael@demo.com'), 'email', now(), now(), now());

  -- 4. Sami Naser (Driver) - id matches seed.sql
  uid := '00000000-0000-0000-0000-000000000012';
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', 'sami@demo.com', crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');
  INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (uid, uid, jsonb_build_object('sub', uid, 'email', 'sami@demo.com'), 'email', now(), now(), now());

END $$;
