-- YALLA WASSEL - Schema + RLS + Seed Data ONLY (no auth users)
-- Run this first, then hit /api/seed to create auth users
-- ============================================================

-- 0. تنظيف (آمن للتكرار)
DROP TABLE IF EXISTS gamification_logs CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================
-- 1. USERS TABLE
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

-- =====================================
-- 2. ORDERS TABLE
-- =====================================
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

-- =====================================
-- 3. GAMIFICATION LOGS TABLE
-- =====================================
CREATE TABLE gamification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES users(id) NOT NULL,
  order_id UUID REFERENCES orders(id) NOT NULL,
  points_awarded INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================
-- 4. RLS POLICIES
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
-- 5. REALTIME
-- =====================================
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE gamification_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE users;
