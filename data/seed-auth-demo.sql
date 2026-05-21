-- YALLA WASSEL - إنشاء حسابات Auth (آمن للتكرار)
-- هديل - Dispatcher
-- محمود/وائل/سامي - Drivers

-- 1. احذف الحسابات القديمة
DELETE FROM auth.identities
WHERE user_id IN (
  SELECT id FROM auth.users
  WHERE email IN ('hadeel@demo.com', 'mahmoud@demo.com', 'wael@demo.com', 'sami@demo.com')
);

DELETE FROM auth.sessions
WHERE user_id IN (
  SELECT id FROM auth.users
  WHERE email IN ('hadeel@demo.com', 'mahmoud@demo.com', 'wael@demo.com', 'sami@demo.com')
);

DELETE FROM auth.refresh_tokens
WHERE user_id::text IN (
  SELECT id::text FROM auth.users
  WHERE email IN ('hadeel@demo.com', 'mahmoud@demo.com', 'wael@demo.com', 'sami@demo.com')
);

DELETE FROM auth.users
WHERE email IN ('hadeel@demo.com', 'mahmoud@demo.com', 'wael@demo.com', 'sami@demo.com');

-- 2. أنشئ المستخدمين بنفس IDs جدول users
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES
  -- هديل - الموزعة (dispatcher)
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'hadeel@demo.com', crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}'),
  -- محمود سالم - سائق (driver)
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000010', 'authenticated', 'authenticated', 'mahmoud@demo.com', crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}'),
  -- وائل عودة - سائق (driver)
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000011', 'authenticated', 'authenticated', 'wael@demo.com', crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}'),
  -- سامي ناصر - سائق (driver)
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000012', 'authenticated', 'authenticated', 'sami@demo.com', crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');

-- 3. أنشئ identities (ضروري للدخول)
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES
  ('hadeel@demo.com',  '00000000-0000-0000-0000-000000000001', jsonb_build_object('sub', '00000000-0000-0000-0000-000000000001', 'email', 'hadeel@demo.com'), 'email', now(), now(), now()),
  ('mahmoud@demo.com', '00000000-0000-0000-0000-000000000010', jsonb_build_object('sub', '00000000-0000-0000-0000-000000000010', 'email', 'mahmoud@demo.com'), 'email', now(), now(), now()),
  ('wael@demo.com',    '00000000-0000-0000-0000-000000000011', jsonb_build_object('sub', '00000000-0000-0000-0000-000000000011', 'email', 'wael@demo.com'), 'email', now(), now(), now()),
  ('sami@demo.com',    '00000000-0000-0000-0000-000000000012', jsonb_build_object('sub', '00000000-0000-0000-0000-000000000012', 'email', 'sami@demo.com'), 'email', now(), now(), now());
