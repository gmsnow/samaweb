import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Dumbbell,
  Brain,
  Bone,
  Baby,
  Hand,
  HandHeart,
  Stethoscope,
  ShieldPlus,
  Zap,
  Droplets,
  Home,
  CalendarCheck,
  ClipboardList,
  ScanLine,
  TrendingUp,
  HeartHandshake,
  Search,
  LineChart,
  Award,
} from "lucide-react";

export type Localized = { en: string; ar: string };

export function img(id: string, w = 1200, h = 800): string {
  return `https://picsum.photos/seed/${id}/${w}/${h}`;
}

export function avatar(id: string | number, size = 400): string {
  return `https://i.pravatar.cc/${size}?img=${id}`;
}

export interface Service {
  slug: string;
  name: Localized;
  desc: Localized;
  icon: LucideIcon;
  gradient: string;
}

export const services: Service[] = [
  { slug: "physical-therapy", name: { en: "Physical Therapy", ar: "العلاج الطبيعي" }, desc: { en: "Restore movement and function through targeted therapeutic exercise and manual care.", ar: "استعادة الحركة والوظيفة عبر تمارين علاجية مستهدفة ورعاية يدوية." }, icon: Activity, gradient: "from-blue-500 to-cyan-400" },
  { slug: "sports-rehab", name: { en: "Sports Rehabilitation", ar: "تأهيل الرياضيين" }, desc: { en: "Return to play faster with sport-specific strength and conditioning protocols.", ar: "العودة للملاعب أسرع عبر بروتوكولات قوة وتأهيل خاصة بالرياضة." }, icon: Dumbbell, gradient: "from-cyan-500 to-teal-400" },
  { slug: "neuro-rehab", name: { en: "Neurological Rehab", ar: "تأهيل الأعصاب" }, desc: { en: "Recover from stroke, spinal injury and neurological conditions with advanced therapy.", ar: "التعافي من السكتة الدماغية وإصابات العمود الفقري عبر علاج متقدم." }, icon: Brain, gradient: "from-violet-500 to-purple-400" },
  { slug: "orthopedic-rehab", name: { en: "Orthopedic Rehab", ar: "تأهيل العظام" }, desc: { en: "Non-surgical and post-operative recovery for bones, joints and soft tissues.", ar: "تعافي غير جراحي وبعد العمليات للعظام والمفاصل والأنسجة." }, icon: Bone, gradient: "from-amber-500 to-orange-400" },
  { slug: "pediatric-therapy", name: { en: "Pediatric Therapy", ar: "علاج الأطفال" }, desc: { en: "Playful, evidence-based care helping children reach developmental milestones.", ar: "رعاية مرحة قائمة على الأدلة تساعد الأطفال على بلوغ مراحل النمو." }, icon: Baby, gradient: "from-pink-500 to-rose-400" },
  { slug: "occupational-therapy", name: { en: "Occupational Therapy", ar: "العلاج الوظيفي" }, desc: { en: "Rebuild the skills of daily living for independence and confidence.", ar: "إعادة بناء مهارات الحياة اليومية للاستقلال والثقة." }, icon: Hand, gradient: "from-emerald-500 to-green-400" },
  { slug: "manual-therapy", name: { en: "Manual Therapy", ar: "العلاج اليدوي" }, desc: { en: "Hands-on techniques that release tension, improve mobility and reduce pain.", ar: "تقنيات عملية تحرر التوتر وتحسّن الحركة وتقلل الألم." }, icon: HandHeart, gradient: "from-red-500 to-rose-400" },
  { slug: "post-surgery", name: { en: "Post Surgery Rehab", ar: "تأهيل ما بعد الجراحة" }, desc: { en: "Structured recovery programs after joint replacement, ACL and spinal surgery.", ar: "برامج تعافٍ منظمة بعد استبدال المفاصل ورباط الصليب والعمود الفقري." }, icon: Stethoscope, gradient: "from-indigo-500 to-blue-400" },
  { slug: "pain-management", name: { en: "Pain Management", ar: "إدارة الألم" }, desc: { en: "Multidisciplinary approach to acute and chronic pain without over-reliance on drugs.", ar: "نهج متعدد التخصصات للألم الحاد والمزمن دون إفراط في الأدوية." }, icon: ShieldPlus, gradient: "from-slate-600 to-slate-400" },
  { slug: "electrotherapy", name: { en: "Electrotherapy", ar: "العلاج الكهربائي" }, desc: { en: "Ultrasound, TENS, shockwave and laser therapy that accelerate tissue healing.", ar: "الموجات فوق الصوتية وTENS والموجات الصادمة والليزر لتسريع الشفاء." }, icon: Zap, gradient: "from-yellow-500 to-amber-400" },
  { slug: "dry-needling", name: { en: "Dry Needling", ar: "الإبر الجافة" }, desc: { en: "Precise trigger-point therapy for stubborn muscle pain and tightness.", ar: "علاج دقيق لنقاط التحفيز في آلام العضلات المزمنة." }, icon: Zap, gradient: "from-fuchsia-500 to-pink-400" },
  { slug: "hydrotherapy", name: { en: "Hydrotherapy", ar: "العلاج المائي" }, desc: { en: "Buoyancy-assisted exercise in warm water for low-impact rehabilitation.", ar: "تمارين منخفضة التأثير في ماء دافئ لإعادة تأهيل آمنة." }, icon: Droplets, gradient: "from-sky-500 to-blue-400" },
  { slug: "home-visits", name: { en: "Home Visits", ar: "زيارات منزلية" }, desc: { en: "Comfortable, professional therapy delivered at your doorstep.", ar: "رعاية احترافية مريحة تصل إلى باب منزلك." }, icon: Home, gradient: "from-teal-500 to-cyan-400" },
];

export interface Doctor {
  id: string;
  name: Localized;
  specialty: Localized;
  avatar: string;
  experience: number;
  languages: Localized[];
  certificates: Localized[];
  rating: number;
  reviews: number;
}

export const doctors: Doctor[] = [
  { id: "d1", name: { en: "Dr. Sarah Mitchell", ar: "د. سارة ميتشل" }, specialty: { en: "Orthopedic Physical Therapy", ar: "العلاج الطبيعي للعظام" }, avatar: avatar(47), experience: 18, languages: [{ en: "English", ar: "الإنجليزية" }, { en: "Spanish", ar: "الإسبانية" }], certificates: [{ en: "DPT, Board Certified Orthopedic Specialist", ar: "دكتوراه علاج طبيعي، أخصائية عظام معتمدة" }], rating: 4.9, reviews: 320 },
  { id: "d2", name: { en: "Dr. James Carter", ar: "د. جيمس كارتر" }, specialty: { en: "Sports Rehabilitation", ar: "تأهيل الإصابات الرياضية" }, avatar: avatar(12), experience: 14, languages: [{ en: "English", ar: "الإنجليزية" }, { en: "German", ar: "الألمانية" }], certificates: [{ en: "SCS — Sports Certified Specialist", ar: "أخصائي تأهيل رياضي معتمد" }], rating: 4.8, reviews: 268 },
  { id: "d3", name: { en: "Dr. Amina Al-Rashid", ar: "د. أمينة الراشد" }, specialty: { en: "Neurological Rehabilitation", ar: "إعادة تأهيل الأعصاب" }, avatar: avatar(32), experience: 16, languages: [{ en: "English", ar: "الإنجليزية" }, { en: "Arabic", ar: "العربية" }, { en: "French", ar: "الفرنسية" }], certificates: [{ en: "NCS — Neurologic Clinical Specialist", ar: "أخصائية أعصاب إكلينيكية معتمدة" }], rating: 5.0, reviews: 402 },
  { id: "d4", name: { en: "Dr. David Nguyen", ar: "د. ديفيد نجوين" }, specialty: { en: "Pain Management & Manual Therapy", ar: "إدارة الألم والعلاج اليدوي" }, avatar: avatar(59), experience: 12, languages: [{ en: "English", ar: "الإنجليزية" }, { en: "Vietnamese", ar: "الفيتنامية" }], certificates: [{ en: "OCS — Orthopaedic Clinical Specialist", ar: "أخصائي عظام إكلينيكي معتمد" }], rating: 4.7, reviews: 215 },
  { id: "d5", name: { en: "Dr. Layla Hassan", ar: "د. ليلى حسن" }, specialty: { en: "Pediatric Physical Therapy", ar: "العلاج الطبيعي للأطفال" }, avatar: avatar(44), experience: 11, languages: [{ en: "English", ar: "الإنجليزية" }, { en: "Arabic", ar: "العربية" }], certificates: [{ en: "PCS — Pediatric Clinical Specialist", ar: "أخصائية أطفال إكلينيكية معتمدة" }], rating: 4.9, reviews: 287 },
  { id: "d6", name: { en: "Dr. Robert Kim", ar: "د. روبرت كيم" }, specialty: { en: "Post-Surgical & Aquatic Therapy", ar: "ما بعد الجراحة والعلاج المائي" }, avatar: avatar(61), experience: 20, languages: [{ en: "English", ar: "الإنجليزية" }, { en: "Korean", ar: "الكورية" }], certificates: [{ en: "PT, DPT — Geriatric & Aquatic Specialist", ar: "أخصائي الشيخوخة والعلاج المائي" }], rating: 4.8, reviews: 344 },
];

export interface Testimonial {
  id: string;
  name: Localized;
  role: Localized;
  avatar: string;
  rating: number;
  text: Localized;
}

export const testimonials: Testimonial[] = [
  { id: "t1", name: { en: "Michael Ross", ar: "مايكل روس" }, role: { en: "Marathon Runner", ar: "عدّاء ماراثون" }, avatar: avatar(12), rating: 5, text: { en: "After my ACL surgery I thought my running career was over. Sama Center got me back on the track in 7 months — pain free.", ar: "بعد جراحة الرباط الصليبي اعتقدت أن مسيرتي في الجري انتهت. أعادني مركز سما إلى المضمار خلال 7 أشهر — بلا ألم." } },
  { id: "t2", name: { en: "Elena Petrova", ar: "إيلينا بيتروفا" }, role: { en: "Post-stroke Survivor", ar: "ناجية من سكتة دماغية" }, avatar: avatar(25), rating: 5, text: { en: "The neurological team rebuilt my independence step by step. I walked my daughter down the aisle this year.", ar: "أعاد فريق الأعصاب بناء استقلاليتي خطوة بخطوة. مشيت مع ابنتي في ممر الزفاف هذا العام." } },
  { id: "t3", name: { en: "Omar Farouk", ar: "عمر فاروق" }, role: { en: "Swimmer & Athlete", ar: "سبّاح ورياضي" }, avatar: avatar(45), rating: 5, text: { en: "Professional, precise and genuinely caring. The hydrotherapy program transformed my shoulder recovery.", ar: "احتراف ودقة واهتمام حقيقي. غيّر برنامج العلاج المائي مسار تعافي كتفي تماماً." } },
  { id: "t4", name: { en: "Grace Liu", ar: "غرايس ليو" }, role: { en: "Office Worker", ar: "موظفة مكتب" }, avatar: avatar(26), rating: 5, text: { en: "Chronic back pain for 6 years — gone in 3 months. The team gave me tools to stay healthy forever.", ar: "ألم ظهر مزمن لـ 6 سنوات — اختفى في 3 أشهر. منحني الفريق أدوات لأبقى بصحة للأبد." } },
  { id: "t5", name: { en: "Hassan Aziz", ar: "حسن عزيز" }, role: { en: "Retired Teacher", ar: "مدرس متقاعد" }, avatar: avatar(54), rating: 5, text: { en: "Knee replacement at 68, and today I garden and hike again. Outstanding post-surgery program.", ar: "استبدال ركبة في الـ 68، واليوم أعود للبستنة والمشي. برنامج ما بعد الجراحة ممتاز." } },
  { id: "t6", name: { en: "Sophie Martin", ar: "صوفي مارتن" }, role: { en: "Dancer", ar: "راقصة" }, avatar: avatar(16), rating: 4.9, text: { en: "They understood a dancer's body like no other clinic. I'm performing at my best again.", ar: "فهموا جسد الراقص كما لا تفعل أي عيادة أخرى. أعود للأداء بأفضل مستوى." } },
];

export interface BlogPost {
  slug: string;
  title: Localized;
  excerpt: Localized;
  category: Localized;
  author: string;
  date: string;
  image: string;
  readTime: number;
}

export const blogPosts: BlogPost[] = [
  { slug: "5-ways-to-prevent-lower-back-pain", title: { en: "5 Ways to Prevent Lower Back Pain at Your Desk", ar: "5 طرق للوقاية من آلام أسفل الظهر في المكتب" }, excerpt: { en: "Simple posture fixes and micro-exercises that protect your spine during long work hours.", ar: "تصحيحات وضعية بسيطة وتمارين صغيرة تحمي عمودك الفقري خلال ساعات العمل الطويلة." }, category: { en: "Ergonomics", ar: "بيئة العمل" }, author: "Dr. Sarah Mitchell", date: "2026-07-21", image: img("back-pain", 800, 500), readTime: 6 },
  { slug: "return-to-sport-after-acl", title: { en: "Return to Sport After ACL Reconstruction: A Timeline", ar: "العودة للرياضة بعد إعادة بناء الرباط الصليبي: خط زمني" }, excerpt: { en: "What to expect at every stage — from surgery day to full-speed performance.", ar: "ماذا تتوقع في كل مرحلة — من يوم الجراحة حتى الأداء الكامل." }, category: { en: "Sports", ar: "الرياضة" }, author: "Dr. James Carter", date: "2026-07-14", image: img("acl", 800, 500), readTime: 9 },
  { slug: "benefits-of-hydrotherapy", title: { en: "Why Hydrotherapy Accelerates Recovery", ar: "لماذا يسرّع العلاج المائي التعافي" }, excerpt: { en: "The science behind water-based rehabilitation and who benefits most.", ar: "العلم وراء إعادة التأهيل المائي ومن يستفيد أكثر." }, category: { en: "Therapy", ar: "العلاج" }, author: "Dr. Robert Kim", date: "2026-07-06", image: img("hydro", 800, 500), readTime: 5 },
  { slug: "kids-and-physical-therapy", title: { en: "When Does Your Child Need Physical Therapy?", ar: "متى يحتاج طفلك إلى العلاج الطبيعي؟" }, excerpt: { en: "Early signs of developmental delays and how playful therapy helps.", ar: "علامات مبكرة لتأخر النمو وكيف يساعد العلاج المرح." }, category: { en: "Pediatrics", ar: "طب الأطفال" }, author: "Dr. Layla Hassan", date: "2026-06-28", image: img("kids", 800, 500), readTime: 7 },
  { slug: "managing-chronic-pain", title: { en: "Managing Chronic Pain Without Over-Medication", ar: "إدارة الألم المزمن دون إفراط في الأدوية" }, excerpt: { en: "A multidisciplinary toolkit: movement, manual therapy and mindset.", ar: "أدوات متعددة التخصصات: الحركة والعلاج اليدوي والعقلية." }, category: { en: "Pain", ar: "الألم" }, author: "Dr. David Nguyen", date: "2026-06-15", image: img("pain", 800, 500), readTime: 8 },
  { slug: "posture-and-technology", title: { en: "Posture in the Age of Smartphones", ar: "الوضعية في عصر الهواتف الذكية" }, excerpt: { en: "Tech-neck is real. Here's how to reset your spine in 10 minutes a day.", ar: "رقبة التقنية حقيقة. إليك كيفية إعادة ضبط عمودك الفقري في 10 دقائق يومياً." }, category: { en: "Wellness", ar: "العافية" }, author: "Dr. Amina Al-Rashid", date: "2026-06-02", image: img("posture", 800, 500), readTime: 6 },
];

export interface Plan {
  id: string;
  name: Localized;
  price: number;
  perSession: boolean;
  popular: boolean;
  features: Localized[];
}

export const plans: Plan[] = [
  {
    id: "starter",
    name: { en: "Starter", ar: "الأساسية" },
    price: 60,
    perSession: true,
    popular: false,
    features: [
      { en: "1 therapy session", ar: "جلسة علاج واحدة" },
      { en: "Full assessment", ar: "تقييم كامل" },
      { en: "Standard modalities", ar: "أنماط علاج قياسية" },
      { en: "Home exercise plan", ar: "خطة تمارين منزلية" },
    ],
  },
  {
    id: "recovery",
    name: { en: "Recovery", ar: "التعافي" },
    price: 290,
    perSession: true,
    popular: true,
    features: [
      { en: "5 therapy sessions", ar: "5 جلسات علاج" },
      { en: "Personalized program", ar: "برنامج مخصص" },
      { en: "Advanced modalities", ar: "أنماط علاج متقدمة" },
      { en: "Progress tracking", ar: "تتبع التقدم" },
      { en: "Priority booking", ar: "حجز بأولوية" },
    ],
  },
  {
    id: "elite",
    name: { en: "Elite", ar: "التميّز" },
    price: 1200,
    perSession: true,
    popular: false,
    features: [
      { en: "20 therapy sessions", ar: "20 جلسة علاج" },
      { en: "Dedicated specialist", ar: "أخصائي مخصص" },
      { en: "All modalities incl. shockwave", ar: "كل الأنماط بما فيها الموجات الصادمة" },
      { en: "Home visits available", ar: "زيارات منزلية متاحة" },
      { en: "24/7 support", ar: "دعم على مدار الساعة" },
      { en: "Family discounts", ar: "خصومات للعائلة" },
    ],
  },
];

export interface GalleryItem {
  id: string;
  src: string;
  title: Localized;
  category: Localized;
  ratio: string;
  description?: Localized;
}

export const galleryItems: GalleryItem[] = [
  { id: "g1", src: img("gym", 800, 1000), title: { en: "Rehab Gym", ar: "صالة التأهيل" }, category: { en: "Facility", ar: "المرافق" }, ratio: "aspect-[4/5]" },
  { id: "g2", src: img("aqua", 800, 600), title: { en: "Hydrotherapy Pool", ar: "مسبح العلاج المائي" }, category: { en: "Facility", ar: "المرافق" }, ratio: "aspect-[4/3]" },
  { id: "g3", src: img("therapy1", 800, 800), title: { en: "Manual Therapy", ar: "العلاج اليدوي" }, category: { en: "Treatment", ar: "العلاج" }, ratio: "aspect-square" },
  { id: "g4", src: img("tech", 800, 600), title: { en: "Shockwave Lab", ar: "مختبر الموجات الصادمة" }, category: { en: "Technology", ar: "التقنية" }, ratio: "aspect-[4/3]" },
  { id: "g5", src: img("therapy2", 800, 1000), title: { en: "Rehab Session", ar: "جلسة تأهيل" }, category: { en: "Treatment", ar: "العلاج" }, ratio: "aspect-[4/5]" },
  { id: "g6", src: img("team", 800, 800), title: { en: "Our Team", ar: "فريقنا" }, category: { en: "Center", ar: "المركز" }, ratio: "aspect-square" },
  { id: "g7", src: img("lobby", 800, 600), title: { en: "Reception", ar: "الاستقبال" }, category: { en: "Facility", ar: "المرافق" }, ratio: "aspect-[4/3]" },
  { id: "g8", src: img("recovery", 800, 1000), title: { en: "Recovery Room", ar: "غرفة التعافي" }, category: { en: "Facility", ar: "المرافق" }, ratio: "aspect-[4/5]" },
  { id: "g9", src: img("electro", 800, 600), title: { en: "Electrical Stimulation", ar: "التنبيه الكهربائي" }, category: { en: "Modality", ar: "أنماط العلاج" }, ratio: "aspect-[4/3]", description: { en: "Activates muscle cells through controlled contractions, restoring function in affected limbs.", ar: "يستخدم لتنشيط خلايا عضلات الجسم عبر توليد تقلص عضلي وإنتاج وظائف في الأطراف المصابة" } },
  { id: "g10", src: img("interferential", 800, 600), title: { en: "Interferential Current", ar: "التيار المتداخل" }, category: { en: "Modality", ar: "أنماط العلاج" }, ratio: "aspect-[4/3]", description: { en: "Relieves pain while reducing muscle fatigue and spasms.", ar: "يعمل على تقليل الألم وتقليل إجهاد العضلات والتشنجات العضلية" } },
  { id: "g11", src: img("tens", 800, 600), title: { en: "Transcutaneous Electrical Nerve Stimulation (TENS)", ar: "التحفيز العصبي الكهربائي عبر الجلد" }, category: { en: "Modality", ar: "أنماط العلاج" }, ratio: "aspect-[4/3]", description: { en: "Eases pain and stimulates sensory fibers.", ar: "يعمل على تخفيف الألم وتحفيز الألياف الحسية" } },
  { id: "g12", src: img("infrared", 800, 600), title: { en: "Infrared Radiation", ar: "الأشعة تحت الحمراء" }, category: { en: "Modality", ar: "أنماط العلاج" }, ratio: "aspect-[4/3]", description: { en: "Warms deep muscle tissue to ease tension and boost blood circulation.", ar: "يقوم بتسخين الأنسجة العضلية العميقة بما يساعد على تخفيف الشد ويقوم بتحفيز الدورة الدموية للجسم" } },
  { id: "g13", src: img("traction", 800, 600), title: { en: "Traction", ar: "الشد الفقري" }, category: { en: "Modality", ar: "أنماط العلاج" }, ratio: "aspect-[4/3]", description: { en: "Reduces vertebral pressure, relaxes muscles, relieves nerve root compression and improves circulation.", ar: "يعمل على تقليل ضغط الفقرات واسترخاء العضلات وتخفيف ضغط جذور الأعصاب وتحسين الدورة الدموية للجسم" } },
  { id: "g14", src: img("paraffin", 800, 600), title: { en: "Paraffin Wax", ar: "شمع البارافين" }, category: { en: "Modality", ar: "أنماط العلاج" }, ratio: "aspect-[4/3]", description: { en: "A waxy treatment that relieves joint stiffness and swelling, soothes muscle and joint inflammation, and improves circulation.", ar: "مادة شمعية تستخدم لتخفيف تصلب المفصل وحدّة التورم وتخفيف التهابات العضلات والمفاصل وتحسين الدورة الدموية" } },
];

export interface Faq {
  question: Localized;
  answer: Localized;
}

export const faqs: Faq[] = [
  { question: { en: "Do I need a referral to book an appointment?", ar: "هل أحتاج إلى تحويل لحجز موعد؟" }, answer: { en: "No. You can book directly through our website or by phone. We work with your primary physician when needed.", ar: "لا. يمكنك الحجز مباشرة عبر موقعنا أو بالهاتف. نعمل مع طبيبك المعالج عند الحاجة." } },
  { question: { en: "What should I wear to my first session?", ar: "ماذا يجب أن أرتدي في جلستي الأولى؟" }, answer: { en: "Comfortable, loose clothing and athletic shoes. If you're treating a specific area, make sure it's accessible.", ar: "ملابس مريحة وفضفاضة وحذاء رياضي. إذا كنت تعالج منطقة محددة فتأكد من سهولة الوصول إليها." } },
  { question: { en: "How long does each session last?", ar: "كم تستغرق كل جلسة؟" }, answer: { en: "Sessions typically run 45–60 minutes, starting with assessment and ending with a home program update.", ar: "تستغرق الجلسات عادة 45–60 دقيقة، تبدأ بالتقييم وتنتهي بتحديث البرنامج المنزلي." } },
  { question: { en: "Do you accept insurance?", ar: "هل تقبلون التأمين؟" }, answer: { en: "Yes, we accept all major insurance providers. Contact us and we'll verify your coverage before your visit.", ar: "نعم، نقبل جميع شركات التأمين الكبرى. تواصل معنا وسنتحقق من تغطيتك قبل زيارتك." } },
  { question: { en: "How many sessions will I need?", ar: "كم عدد الجلسات التي سأحتاجها؟" }, answer: { en: "It depends on your condition. After your first assessment we'll give you a clear, realistic roadmap with milestones.", ar: "يعتمد ذلك على حالتك. بعد التقييم الأول سنقدم لك خارطة طريق واضحة وواقعية بمراحل محددة." } },
  { question: { en: "Is home-based rehabilitation available?", ar: "هل يتوفر التأهيل في المنزل؟" }, answer: { en: "Absolutely. Our therapists visit you at home with portable equipment for a fully equipped session.", ar: "بالتأكيد. يزورك معالجونا في منزلك مع معدات محمولة لجلسة متكاملة." } },
  { question: { en: "Can I cancel or reschedule my appointment?", ar: "هل يمكنني إلغاء أو تغيير موعدي؟" }, answer: { en: "Yes, free of charge up to 24 hours before your appointment through the portal or by phone.", ar: "نعم، مجاناً حتى 24 ساعة قبل موعدك عبر البوابة أو الهاتف." } },
];

export const journeySteps = [
  { key: "appointment", icon: CalendarCheck },
  { key: "assessment", icon: ClipboardList },
  { key: "diagnosis", icon: ScanLine },
  { key: "treatment", icon: Activity },
  { key: "recovery", icon: TrendingUp },
  { key: "followup", icon: HeartHandshake },
] as const;

export const treatmentsStages = [
  { key: "stage1", icon: Search, color: "text-blue-500" },
  { key: "stage2", icon: ClipboardList, color: "text-cyan-500" },
  { key: "stage3", icon: Activity, color: "text-violet-500" },
  { key: "stage4", icon: LineChart, color: "text-amber-500" },
  { key: "stage5", icon: Award, color: "text-emerald-500" },
] as const;
