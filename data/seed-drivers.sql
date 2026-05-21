-- إضافة السائقين (آمن — ON CONFLICT DO NOTHING)
INSERT INTO users (id, role, full_name, email, phone_number, region, status, trust_score)
VALUES
  ('705da657-c9ee-422f-b5fc-3bc77d8c472c', 'driver', 'وائل عودة', 'wael@demo.com', '0793333333', 'شرق عمان', 'available', 88),
  ('b6e260c0-5502-4270-82e3-c7112459064a', 'driver', 'محمد', 'mohammad@demo.com', '0792222222', 'غرب عمان', 'available', 95)
ON CONFLICT (id) DO NOTHING;

-- تعيين الطلبات للسائقين
UPDATE orders SET driver_id = 'b6e260c0-5502-4270-82e3-c7112459064a', status = 'assigned', updated_at = now()
WHERE order_number = 'ORD-1001' AND driver_id IS NULL;

UPDATE orders SET driver_id = '705da657-c9ee-422f-b5fc-3bc77d8c472c', status = 'assigned', updated_at = now()
WHERE order_number = 'ORD-1002' AND driver_id IS NULL;
