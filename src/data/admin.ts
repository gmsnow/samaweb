export type AdminAppointment = {
  id: string;
  patient: string;
  doctor: string;
  service: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
};

export type AdminDoctor = {
  id: string;
  name: string;
  specialty: string;
  patients: number;
  rating: number;
  status: "active" | "on_leave";
};

export type AdminPatient = {
  id: string;
  name: string;
  lastVisit: string;
  sessions: number;
  status: "active" | "new" | "inactive";
};

export const adminAppointments: AdminAppointment[] = [
  { id: "APT-1043", patient: "Khalid Mahmoud", doctor: "Dr. Omar Khalil", service: "Neuro Rehab", date: "2026-08-05", time: "09:00", status: "pending" },
  { id: "APT-1042", patient: "Mohammed Al-Farsi", doctor: "Dr. Amira Hassan", service: "Sports Rehab", date: "2026-08-05", time: "10:30", status: "confirmed" },
  { id: "APT-1041", patient: "Noura Al-Ali", doctor: "Dr. Sara Mansour", service: "Pediatric Therapy", date: "2026-08-05", time: "11:00", status: "confirmed" },
  { id: "APT-1040", patient: "James Carter", doctor: "Dr. Youssef Adel", service: "Manual Therapy", date: "2026-08-05", time: "12:30", status: "pending" },
  { id: "APT-1039", patient: "Fatima Saad", doctor: "Dr. Karim Nabil", service: "Pain Management", date: "2026-08-04", time: "14:00", status: "completed" },
  { id: "APT-1038", patient: "Sarah Mitchell", doctor: "Dr. Lina Farouk", service: "Orthopedic Rehab", date: "2026-08-04", time: "16:00", status: "completed" },
  { id: "APT-1037", patient: "Ahmed Zaki", doctor: "Dr. Amira Hassan", service: "Hydrotherapy", date: "2026-08-03", time: "10:00", status: "cancelled" },
];

export const adminDoctors: AdminDoctor[] = [
  { id: "d1", name: "Dr. Amira Hassan", specialty: "Sports Medicine", patients: 142, rating: 4.9, status: "active" },
  { id: "d2", name: "Dr. Omar Khalil", specialty: "Neurological Rehab", patients: 98, rating: 4.8, status: "active" },
  { id: "d3", name: "Dr. Lina Farouk", specialty: "Orthopedic Rehab", patients: 121, rating: 4.9, status: "active" },
  { id: "d4", name: "Dr. Youssef Adel", specialty: "Manual Therapy", patients: 87, rating: 4.8, status: "active" },
  { id: "d5", name: "Dr. Sara Mansour", specialty: "Pediatric Therapy", patients: 64, rating: 4.9, status: "on_leave" },
  { id: "d6", name: "Dr. Karim Nabil", specialty: "Pain Management", patients: 105, rating: 4.7, status: "active" },
];

export const adminPatients: AdminPatient[] = [
  { id: "p1", name: "Mohammed Al-Farsi", lastVisit: "2026-07-29", sessions: 12, status: "active" },
  { id: "p2", name: "Sarah Mitchell", lastVisit: "2026-08-04", sessions: 18, status: "active" },
  { id: "p3", name: "Noura Al-Ali", lastVisit: "2026-08-05", sessions: 6, status: "active" },
  { id: "p4", name: "James Carter", lastVisit: "2026-07-22", sessions: 9, status: "active" },
  { id: "p5", name: "Ahmed Zaki", lastVisit: "2026-07-30", sessions: 4, status: "inactive" },
  { id: "p6", name: "Fatima Saad", lastVisit: "2026-08-04", sessions: 11, status: "active" },
];

export const revenueByMonth = [
  { month: "Jan", revenue: 142000, sessions: 620 },
  { month: "Feb", revenue: 158000, sessions: 690 },
  { month: "Mar", revenue: 171000, sessions: 740 },
  { month: "Apr", revenue: 189000, sessions: 810 },
  { month: "May", revenue: 203000, sessions: 860 },
  { month: "Jun", revenue: 224000, sessions: 940 },
  { month: "Jul", revenue: 241000, sessions: 1020 },
];

export const appointmentsByDay = [
  { day: "Mon", count: 34 },
  { day: "Tue", count: 41 },
  { day: "Wed", count: 38 },
  { day: "Thu", count: 46 },
  { day: "Fri", count: 28 },
  { day: "Sat", count: 12 },
];

export const adminNotifications = [
  { id: "n1", title: "New appointment request", body: "Khalid Mahmoud requested Neuro Rehab for Aug 5.", time: "10 min ago", read: false },
  { id: "n2", title: "Payment received", body: "INV-301 marked as paid — 1,800 YER.", time: "1 hour ago", read: false },
  { id: "n3", title: "Report ready for review", body: "RPT-201 uploaded by Dr. Lina Farouk.", time: "3 hours ago", read: true },
  { id: "n4", title: "Patient joined", body: "New patient account created — James Carter.", time: "Yesterday", read: true },
];
