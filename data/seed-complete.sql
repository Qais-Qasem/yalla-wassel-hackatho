-- ============================================================
-- YALLA WASSEL - FULL RESET: Tables + RLS + Auth Users + Data
-- Run this ONCE in Supabase SQL Editor.
-- After this, just log in — no need to hit /api/seed
-- ============================================================

-- =====================================
-- 1. تنظيف شامل لكلشي
-- =====================================
DROP TABLE IF EXISTS gamification_logs CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DELETE FROM auth.identities WHERE provider = 'email' AND provider_id LIKE '%@demo.com';
DELETE FROM auth.sessions WHERE user_id IN (SELECT u.id::text FROM auth.users u WHERE u.email LIKE '%@demo.com');
DELETE FROM auth.refresh_tokens WHERE user_id IN (SELECT u.id::text FROM auth.users u WHERE u.email LIKE '%@demo.com');
DELETE FROM auth.users WHERE email LIKE '%@demo.com';

-- =====================================
-- 2. إنشاء الجداول
-- =====================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR NOT NULL CHECK (role IN ('dispatcher', 'driver', 'customer')),
  full_name VARCHAR NOT NULL,
  email VARCHAR,
  phone_number VARCHAR,
  region VARCHAR,
  status VARCHAR DEFAULT 'offline' CHECK (status IN ('available', 'on_delivery', 'offline')),
  trust_score INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR NOT NULL,
  driver_id UUID REFERENCES users(id),
  sender_name VARCHAR NOT NULL,
  recipient_name VARCHAR NOT NULL,
  delivery_zone VARCHAR NOT NULL,
  priority VARCHAR DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent')),
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'picked_up', 'delivered')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE gamification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES users(id) NOT NULL,
  order_id UUID REFERENCES orders(id) NOT NULL,
  points_awarded INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================
-- 3. RLS
-- =====================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON users;
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Dispatchers can read all users" ON users;
CREATE POLICY "Dispatchers can read all users" ON users FOR SELECT
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'dispatcher'));

DROP POLICY IF EXISTS "Dispatchers can update all users" ON users;
CREATE POLICY "Dispatchers can update all users" ON users FOR UPDATE
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'dispatcher'));

DROP POLICY IF EXISTS "Drivers can update own profile" ON users;
CREATE POLICY "Drivers can update own profile" ON users FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Anyone can insert users" ON users;
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Dispatchers can CRUD all orders" ON orders;
CREATE POLICY "Dispatchers can CRUD all orders" ON orders FOR ALL
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'dispatcher'));

DROP POLICY IF EXISTS "Drivers can view assigned orders" ON orders;
CREATE POLICY "Drivers can view assigned orders" ON orders FOR SELECT
  USING (driver_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'dispatcher'));

DROP POLICY IF EXISTS "Drivers can update assigned orders" ON orders;
CREATE POLICY "Drivers can update assigned orders" ON orders FOR UPDATE
  USING (auth.uid() = driver_id) WITH CHECK (auth.uid() = driver_id);

DROP POLICY IF EXISTS "Customers & public can view by order_number" ON orders;
CREATE POLICY "Customers & public can view by order_number" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Dispatchers can read all logs" ON gamification_logs;
CREATE POLICY "Dispatchers can read all logs" ON gamification_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'dispatcher'));

DROP POLICY IF EXISTS "Drivers can read own logs" ON gamification_logs;
CREATE POLICY "Drivers can read own logs" ON gamification_logs FOR SELECT
  USING (driver_id = auth.uid());

DROP POLICY IF EXISTS "System can insert logs" ON gamification_logs;
CREATE POLICY "System can insert logs" ON gamification_logs FOR INSERT WITH CHECK (true);

-- =====================================
-- 4. Realtime
-- =====================================
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE gamification_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE users;

-- =====================================
-- 5. إنشاء حسابات Auth (بكلمة مرور مشفرة)
-- =====================================
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmed_at)
VALUES
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'hadeel@demo.com',  crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000010', 'authenticated', 'authenticated', 'mahmoud@demo.com', crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000011', 'authenticated', 'authenticated', 'wael@demo.com',    crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, now()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000012', 'authenticated', 'authenticated', 'sami@demo.com',   crypt('Demo@123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, now());

INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES
  ('hadeel@demo.com',  '00000000-0000-0000-0000-000000000001', jsonb_build_object('sub', '00000000-0000-0000-0000-000000000001', 'email', 'hadeel@demo.com'), 'email', now(), now(), now()),
  ('mahmoud@demo.com', '00000000-0000-0000-0000-000000000010', jsonb_build_object('sub', '00000000-0000-0000-0000-000000000010', 'email', 'mahmoud@demo.com'), 'email', now(), now(), now()),
  ('wael@demo.com',    '00000000-0000-0000-0000-000000000011', jsonb_build_object('sub', '00000000-0000-0000-0000-000000000011', 'email', 'wael@demo.com'), 'email', now(), now(), now()),
  ('sami@demo.com',    '00000000-0000-0000-0000-000000000012', jsonb_build_object('sub', '00000000-0000-0000-0000-000000000012', 'email', 'sami@demo.com'), 'email', now(), now(), now());

-- =====================================
-- 6. بيانات التطبيق
-- =====================================
INSERT INTO users (id, role, full_name, email, phone_number, region, status, trust_score)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'dispatcher', 'هديل', 'hadeel@demo.com', '0791111111', 'عمان', 'available', 100),
  ('00000000-0000-0000-0000-000000000010', 'driver', 'محمود سالم', 'mahmoud@demo.com', '0792222222', 'غرب عمان', 'available', 95),
  ('00000000-0000-0000-0000-000000000011', 'driver', 'وائل عودة', 'wael@demo.com', '0793333333', 'شرق عمان', 'available', 88),
  ('00000000-0000-0000-0000-000000000012', 'driver', 'سامي ناصر', 'sami@demo.com', '0794444444', 'وسط عمان', 'on_delivery', 72);

INSERT INTO orders (id, order_number, driver_id, sender_name, recipient_name, delivery_zone, priority, status, created_at)
VALUES
  (gen_random_uuid(), 'ORD-1001', '00000000-0000-0000-0000-000000000012', 'مطبخ ماما', 'أحمد علي', 'خلدا', 'urgent', 'picked_up', now() - interval '30 minutes'),
  (gen_random_uuid(), 'ORD-1002', '00000000-0000-0000-0000-000000000010', 'صيدلية البرج', 'سارة خالد', 'عبدون', 'normal', 'assigned', now() - interval '15 minutes'),
  (gen_random_uuid(), 'ORD-1003', NULL, 'مخبز القدس', 'محمود عيسى', 'الشميساني', 'normal', 'pending', now()),
  (gen_random_uuid(), 'ORD-1004', NULL, 'متجر الرفاعي', 'ليلى حسن', 'غرب عمان', 'urgent', 'pending', now()),
  (gen_random_uuid(), 'ORD-1005', '00000000-0000-0000-0000-000000000011', 'مطعم البستان', 'نور الدين', 'جبل عمان', 'normal', 'assigned', now() - interval '10 minutes');
