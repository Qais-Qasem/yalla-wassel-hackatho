-- ============================================================
-- YALLA WASSEL - Auth Users for Demo
-- Creates auth.users entries matching the demo quick-login buttons
-- Safe to run multiple times (uses ON CONFLICT)
-- ============================================================

-- Create demo accounts
DO $$
DECLARE
  uid uuid;
BEGIN
  -- فقط احذف البيانات القديمة إذا موجودة (باستخدام JOIN)
  DELETE FROM auth.refresh_tokens
    WHERE user_id IN (SELECT id::text FROM auth.users WHERE email IN ('hadeel@demo.com', 'mahmoud@demo.com', 'wael@demo.com', 'sami@demo.com'));
  DELETE FROM auth.sessions
    WHERE user_id IN (SELECT id FROM auth.users WHERE email IN ('hadeel@demo.com', 'mahmoud@demo.com', 'wael@demo.com', 'sami@demo.com'));
  DELETE FROM auth.identities
    WHERE user_id IN (SELECT id FROM auth.users WHERE email IN ('hadeel@demo.com', 'mahmoud@demo.com', 'wael@demo.com', 'sami@demo.com'));

  -- Hadeel (Dispatcher)
  uid := '00000000-0000-0000-0000-000000000001';
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', 'hadeel@demo.com', crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}')
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, encrypted_password = EXCLUDED.encrypted_password, email_confirmed_at = now();

  INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (uid, uid, jsonb_build_object('sub', uid, 'email', 'hadeel@demo.com'), 'email', now(), now(), now())
  ON CONFLICT (id, provider) DO NOTHING;

  -- Mahmoud Salem (Driver)
  uid := '00000000-0000-0000-0000-000000000010';
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', 'mahmoud@demo.com', crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}')
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, encrypted_password = EXCLUDED.encrypted_password, email_confirmed_at = now();

  INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (uid, uid, jsonb_build_object('sub', uid, 'email', 'mahmoud@demo.com'), 'email', now(), now(), now())
  ON CONFLICT (id, provider) DO NOTHING;

  -- Wael Odeh (Driver)
  uid := '00000000-0000-0000-0000-000000000011';
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', 'wael@demo.com', crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}')
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, encrypted_password = EXCLUDED.encrypted_password, email_confirmed_at = now();

  INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (uid, uid, jsonb_build_object('sub', uid, 'email', 'wael@demo.com'), 'email', now(), now(), now())
  ON CONFLICT (id, provider) DO NOTHING;

  -- Sami Naser (Driver)
  uid := '00000000-0000-0000-0000-000000000012';
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  VALUES ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated', 'sami@demo.com', crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}')
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, encrypted_password = EXCLUDED.encrypted_password, email_confirmed_at = now();

  INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (uid, uid, jsonb_build_object('sub', uid, 'email', 'sami@demo.com'), 'email', now(), now(), now())
  ON CONFLICT (id, provider) DO NOTHING;

END $$;
