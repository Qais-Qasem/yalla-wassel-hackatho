DO $$
DECLARE
  user_id uuid;
BEGIN
  -- حذف الربط مع الـ identity أولاً
  DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email IN ('mohammad@yalla-wassel.com', 'wael@yalla-wassel.com'));
  DELETE FROM auth.sessions WHERE user_id IN (SELECT id FROM auth.users WHERE email IN ('mohammad@yalla-wassel.com', 'wael@yalla-wassel.com'));
  DELETE FROM auth.refresh_tokens WHERE user_id IN (SELECT id FROM auth.users WHERE email IN ('mohammad@yalla-wassel.com', 'wael@yalla-wassel.com'));
  DELETE FROM auth.users WHERE email IN ('mohammad@yalla-wassel.com', 'wael@yalla-wassel.com');

  -- أنشئ محمد
  user_id := 'b6e260c0-5502-4270-82e3-c7112459064a';
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  VALUES ('00000000-0000-0000-0000-000000000000', user_id, 'authenticated', 'authenticated', 'mohammad@yalla-wassel.com', crypt('Test123456', gen_salt('bf')), now(), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');

  INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (user_id, user_id, jsonb_build_object('sub', user_id, 'email', 'mohammad@yalla-wassel.com'), 'email', now(), now(), now());

  -- أنشئ وائل
  user_id := '705da657-c9ee-422f-b5fc-3bc77d8c472c';
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_sent_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  VALUES ('00000000-0000-0000-0000-000000000000', user_id, 'authenticated', 'authenticated', 'wael@yalla-wassel.com', crypt('Test123456', gen_salt('bf')), now(), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');

  INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (user_id, user_id, jsonb_build_object('sub', user_id, 'email', 'wael@yalla-wassel.com'), 'email', now(), now(), now());
END $$;
