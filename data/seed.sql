-- ============================================================
-- YALLA WASSEL - Complete Database Schema + RLS + Seed Data
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR NOT NULL CHECK (role IN ('dispatcher', 'driver', 'customer')),
  full_name VARCHAR NOT NULL,
  phone_number VARCHAR,
  region VARCHAR,
  status VARCHAR DEFAULT 'offline' CHECK (status IN ('available', 'on_delivery', 'offline')),
  trust_score INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
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

-- 3. GAMIFICATION LOGS TABLE
CREATE TABLE IF NOT EXISTS gamification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES users(id) NOT NULL,
  order_id UUID REFERENCES orders(id) NOT NULL,
  points_awarded INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ENABLE RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_logs ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICIES

-- Users table policies
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Dispatchers can read all users"
  ON users FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'dispatcher')
  );

CREATE POLICY "Dispatchers can update all users"
  ON users FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'dispatcher')
  );

-- Orders table policies
CREATE POLICY "Dispatchers can CRUD all orders"
  ON orders FOR ALL
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'dispatcher')
  );

CREATE POLICY "Drivers can view assigned orders"
  ON orders FOR SELECT
  USING (
    driver_id = auth.uid()
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'dispatcher')
  );

CREATE POLICY "Drivers can update assigned orders"
  ON orders FOR UPDATE
  USING (auth.uid() = driver_id)
  WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Customers & public can view by order_number"
  ON orders FOR SELECT
  USING (true);

-- Gamification logs policies
CREATE POLICY "Dispatchers can read all logs"
  ON gamification_logs FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'dispatcher')
  );

CREATE POLICY "Drivers can read own logs"
  ON gamification_logs FOR SELECT
  USING (driver_id = auth.uid());

CREATE POLICY "System can insert logs"
  ON gamification_logs FOR INSERT
  WITH CHECK (true);

-- 6. ENABLE REALTIME (for live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE gamification_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE users;

-- 7. SEED DATA

-- Seed dispatcher
INSERT INTO users (id, role, full_name, phone_number, region, status)
VALUES ('00000000-0000-0000-0000-000000000001', 'dispatcher', 'هديل', '0791111111', 'عمان', 'available');

-- Seed drivers
INSERT INTO users (id, role, full_name, phone_number, region, status, trust_score)
VALUES
  ('00000000-0000-0000-0000-000000000010', 'driver', 'محمود سالم', '0792222222', 'غرب عمان', 'available', 95),
  ('00000000-0000-0000-0000-000000000011', 'driver', 'وائل عودة', '0793333333', 'شرق عمان', 'available', 88),
  ('00000000-0000-0000-0000-000000000012', 'driver', 'سامي ناصر', '0794444444', 'وسط عمان', 'on_delivery', 72);

-- Seed orders
INSERT INTO orders (id, order_number, driver_id, sender_name, recipient_name, delivery_zone, priority, status, created_at)
VALUES
  (gen_random_uuid(), 'ORD-1001', '00000000-0000-0000-0000-000000000012', 'مطبخ ماما', 'أحمد علي', 'خلدا', 'urgent', 'picked_up', now() - interval '30 minutes'),
  (gen_random_uuid(), 'ORD-1002', '00000000-0000-0000-0000-000000000010', 'صيدلية البرج', 'سارة خالد', 'عبدون', 'normal', 'assigned', now() - interval '15 minutes'),
  (gen_random_uuid(), 'ORD-1003', NULL, 'مخبز القدس', 'محمود عيسى', 'الشميساني', 'normal', 'pending', now()),
  (gen_random_uuid(), 'ORD-1004', NULL, 'متجر الرفاعي', 'ليلى حسن', 'غرب عمان', 'urgent', 'pending', now()),
  (gen_random_uuid(), 'ORD-1005', '00000000-0000-0000-0000-000000000011', 'مطعم البستان', 'نور الدين', 'جبل عمان', 'normal', 'assigned', now() - interval '10 minutes');
