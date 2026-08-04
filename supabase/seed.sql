-- Sama Center — Seed Data
-- Requires schema.sql first. Add admin + demo accounts, services, doctors, posts.

-- ============================================================
-- SERVICES
-- ============================================================
insert into public.services (slug, name_en, name_ar, description_en, description_ar, icon, price, sort_order) values
  ('physical-therapy', 'Physical Therapy', 'العلاج الطبيعي', 'Restore movement and function through targeted therapeutic exercise and manual care.', 'استعادة الحركة والوظيفة عبر تمارين علاجية موجّهة ورعاية يدوية.', 'activity', 250, 1),
  ('sports-rehab', 'Sports Rehabilitation', 'إعادة تأهيل الرياضيين', 'Return to play faster with sport-specific strength and conditioning protocols.', 'عُد للعب أسرع مع بروتوكولات قوة وتأهيل خاصة بالرياضة.', 'dumbbell', 300, 2),
  ('neuro-rehab', 'Neurological Rehab', 'التأهيل العصبي', 'Recover from stroke, spinal injury and neurological conditions with advanced therapy.', 'التعافي من السكتة وإصابة العمود الفقري والحالات العصبية بعلاج متقدم.', 'brain', 350, 3),
  ('orthopedic-rehab', 'Orthopedic Rehab', 'التأهيل العظمي', 'Non-surgical and post-operative recovery for bones, joints and soft tissues.', 'تعافٍ غير جراحي وما بعد العمليات للعظام والمفاصل والأنسجة الرخوة.', 'bone', 300, 4),
  ('manual-therapy', 'Manual Therapy', 'العلاج اليدوي', 'Hands-on techniques that release tension, improve mobility and reduce pain.', 'تقنيات يدوية تخفف التوتر وتحسّن الحركة وتقلل الألم.', 'hand', 280, 5),
  ('hydrotherapy', 'Hydrotherapy', 'العلاج المائي', 'Buoyancy-assisted exercise in warm water for low-impact rehabilitation.', 'تمارين مدعومة بالطفو في ماء دافئ لإعادة تأهيل منخفضة التأثير.', 'waves', 320, 6);

-- ============================================================
-- DOCTORS
-- ============================================================
insert into public.doctors (slug, name, name_ar, specialty, specialty_ar, bio, experience_years, rating, sort_order) values
  ('dr-amira-hassan', 'Dr. Amira Hassan', 'د. أميرة حسن', 'Sports Medicine', 'طب رياضي', 'Lead sports rehabilitation specialist focused on return-to-play protocols.', 14, 4.9, 1),
  ('dr-omar-khalil', 'Dr. Omar Khalil', 'د. عمر خليل', 'Neurological Rehab', 'التأهيل العصبي', 'Expert in stroke and spinal cord rehabilitation with 12 years of practice.', 12, 4.8, 2),
  ('dr-lina-farouk', 'Dr. Lina Farouk', 'د. لينا فاروق', 'Orthopedic Rehab', 'التأهيل العظمي', 'Orthopedic rehabilitation specialist for joint replacement and ACL recovery.', 10, 4.9, 3),
  ('dr-youssef-adel', 'Dr. Youssef Adel', 'د. يوسف عادل', 'Manual Therapy', 'العلاج اليدوي', 'Certified manual therapist and dry needling practitioner.', 9, 4.8, 4),
  ('dr-sara-mansour', 'Dr. Sara Mansour', 'د. سارة منصور', 'Pediatric Therapy', 'علاج الأطفال', 'Pediatric physiotherapist helping children reach developmental milestones.', 8, 4.9, 5),
  ('dr-karim-nabil', 'Dr. Karim Nabil', 'د. كريم نبيل', 'Pain Management', 'إدارة الألم', 'Multidisciplinary pain management specialist focused on drug-free recovery.', 11, 4.7, 6);

-- ============================================================
-- BLOG POSTS
-- ============================================================
insert into public.blog_posts (slug, title_en, title_ar, excerpt_en, excerpt_ar, content_en, content_ar, category, tags, is_published, published_at) values
  ('posture-in-the-digital-age', 'Posture in the Digital Age', 'الوضعية في العصر الرقمي', 'Simple desk habits that protect your spine while you work.', 'عادات مكتبية بسيطة تحمي عمودك الفقري أثناء العمل.', 'Full article...', 'مقال كامل...', 'Wellness', '{posture,spine,office}', true, now() - interval '20 days'),
  ('acl-recovery-timeline', 'ACL Recovery: What to Expect', 'التعافي من إصابة الرباط الصليبي', 'A realistic timeline from injury to return to sport.', 'جدول زمني واقعي من الإصابة إلى العودة للرياضة.', 'Full article...', 'مقال كامل...', 'Injury Recovery', '{acl,knee,sports}', true, now() - interval '12 days'),
  ('strength-training-for-seniors', 'Strength Training for Seniors', 'تدريب القوة لكبار السن', 'Why resistance training is essential after 60 — and how to start safely.', 'لماذا يعتبر تدريب المقاومة أساسياً بعد الستين — وكيف تبدأ بأمان.', 'Full article...', 'مقال كامل...', 'Healthy Aging', '{seniors,strength,aging}', true, now() - interval '6 days');

-- ============================================================
-- TESTIMONIALS
-- ============================================================
insert into public.testimonials (patient_name, rating, text_en, text_ar, treatment, is_featured) values
  ('Mohammed Al-Farsi', 5, 'After my ACL surgery, Dr. Lina rebuilt my knee step by step. I am back on the football pitch!', 'بعد جراحة الرباط الصليبي، أعادت د. لينا بناء ركبتي خطوة بخطوة. عدت إلى ملعب كرة القدم!', 'ACL Recovery', true),
  ('Sarah Mitchell', 5, 'The team understood my chronic back pain when others could not. Life-changing care.', 'فهم الفريق آلام ظهري المزمنة حين عجز آخرون عن ذلك. رعاية غيرت حياتي.', 'Chronic Pain', true),
  ('Ahmed Zaki', 4, 'Professional, modern facility with a very caring staff. Hydrotherapy was excellent.', 'مركز محترف وحديث وطاقم شديد الاهتمام. العلاج المائي كان ممتازاً.', 'Hydrotherapy', false),
  ('Noura Al-Ali', 5, 'My daughter loved her pediatric therapy sessions. We saw progress in weeks.', 'أحبت ابنتي جلسات العلاج للأطفال. لاحظنا تقدماً في غضون أسابيع.', 'Pediatric Therapy', true),
  ('James Carter', 5, 'Returned to the gym pain-free after months of shoulder pain. Highly recommended.', 'عدت إلى النادي بلا ألم بعد شهور من آلام الكتف. أنصح به بشدة.', 'Shoulder Rehab', false),
  ('Fatima Saad', 4, 'Excellent follow-up and the exercise program app kept me consistent.', 'متابعة ممتازة وبرنامج التمارين التطبيقي جعلني ملتزماً باستمرار.', 'Exercise Program', false);
