-- بيانات إضافية للعرض الحي
INSERT INTO orders (order_number, driver_id, sender_name, recipient_name, delivery_zone, priority, status, created_at)
VALUES
  ('ORD-1005', 'b6e260c0-5502-4270-82e3-c7112459064a', 'مطعم البستان', 'نور الدين', 'جبل عمان', 'normal', 'picked_up', now() - interval '20 minutes'),
  ('ORD-1006', '705da657-c9ee-422f-b5fc-3bc77d8c472c', 'مكتبة الأمل', 'رنا عبدالله', 'خلدا', 'urgent', 'pending', now() - interval '5 minutes'),
  ('ORD-1007', NULL, 'متجر لوزان', 'سامر خليل', 'عبدون', 'normal', 'pending', now()),
  ('ORD-1008', NULL, 'مخابز القاضي', 'هدى محمود', 'الشميساني', 'urgent', 'pending', now());
