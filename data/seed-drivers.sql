-- إضافة السائقين
INSERT INTO users (id, role, full_name, phone_number, region, status, trust_score)
VALUES
  ('705da657-c9ee-422f-b5fc-3bc77d8c472c', 'driver', 'وائل عودة', '0793333333', 'شرق عمان', 'available', 88),
  ('b6e260c0-5502-4270-82e3-c7112459064a', 'driver', 'محمد', '0792222222', 'غرب عمان', 'available', 95);

-- تعيين الطلبات للسائقين
UPDATE orders SET driver_id = 'b6e260c0-5502-4270-82e3-c7112459064a', status = 'assigned', updated_at = now()
WHERE order_number = 'ORD-1001';

UPDATE orders SET driver_id = '705da657-c9ee-422f-b5fc-3bc77d8c472c', status = 'assigned', updated_at = now()
WHERE order_number = 'ORD-1002';
