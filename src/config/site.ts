export const siteConfig = {
  name: "Sama Center",
  shortName: "SAMA",
  tagline: "Move Better. Live Stronger.",
  description:
    "A premium physical therapy & rehabilitation center combining advanced medicine, cutting-edge technology and human care.",
  url: "https://samacenter.com",
  locale: "en",
  logo: "/logo.svg",
  phone: "+967 778 199 978",
  emergency: "+967 736 677 739",
  whatsapp: "967778199978",
  email: "sama.center.pt@gmail.com",
  address: {
    en: "C572+J79, Sana'a, Yemen",
    ar: "شملان شرق جوله دار الحجر، صنعاء، اليمن",
  },
  workingHours: [
    { day: { en: "Sat–Thu", ar: "السبت – الخميس" }, hours: { en: "09:00 – 13:00", ar: "09:00 – 13:00" } },
    { day: { en: "Friday", ar: "الجمعة" }, hours: { en: "Closed", ar: "مغلق" } },
  ],
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    twitter: "https://x.com",
    youtube: "https://youtube.com",
    linkedin: "https://linkedin.com",
  },
  stats: {
    patients: 12000,
    experience: 15,
    doctors: 25,
    successRate: 98,
  },
} as const;
