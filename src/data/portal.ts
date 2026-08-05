export type PortalAppointment = {
  id: string;
  doctor: string;
  service: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  type: "in_person" | "home_visit" | "virtual";
};

export type PortalReport = {
  id: string;
  title: string;
  doctor: string;
  date: string;
  diagnosis: string;
  summary: string;
};

export type PortalExercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  video?: string;
  notes: string;
};

export type PortalProgram = {
  id: string;
  title: string;
  doctor: string;
  assignedAt: string;
  exercises: PortalExercise[];
  isCompleted: boolean;
};

export type PortalInvoice = {
  id: string;
  description: string;
  amount: number;
  currency: string;
  status: "unpaid" | "paid" | "refunded";
  issuedAt: string;
};

export const demoAppointments: PortalAppointment[] = [
  {
    id: "APT-1042",
    doctor: "Dr. Amira Hassan",
    service: "Sports Rehabilitation",
    date: "2026-08-05",
    time: "10:30",
    status: "confirmed",
    type: "in_person",
  },
  {
    id: "APT-1038",
    doctor: "Dr. Amira Hassan",
    service: "Sports Rehabilitation",
    date: "2026-07-29",
    time: "11:00",
    status: "completed",
    type: "in_person",
  },
  {
    id: "APT-1031",
    doctor: "Dr. Lina Farouk",
    service: "Orthopedic Rehab",
    date: "2026-07-20",
    time: "16:45",
    status: "completed",
    type: "in_person",
  },
  {
    id: "APT-1024",
    doctor: "Dr. Amira Hassan",
    service: "Initial Assessment",
    date: "2026-07-12",
    time: "09:15",
    status: "completed",
    type: "in_person",
  },
];

export const demoReports: PortalReport[] = [
  {
    id: "RPT-201",
    title: "Post-ACL Surgery — Week 6 Review",
    doctor: "Dr. Lina Farouk",
    date: "2026-07-20",
    diagnosis: "ACL reconstruction — phase 2 rehabilitation",
    summary:
      "Excellent progress. Range of motion 0–125°, quadriceps strength at 78% of contralateral side. Continue phase 2 protocol with added balance training.",
  },
  {
    id: "RPT-198",
    title: "Initial Physiotherapy Assessment",
    doctor: "Dr. Amira Hassan",
    date: "2026-07-12",
    diagnosis: "Right ACL rupture (reconstructed), mild patellar tracking",
    summary:
      "Baseline assessment completed. Established phase 1 protocol: isometric quadriceps, passive extension, gait re-education with crutches.",
  },
];

export const demoPrograms: PortalProgram[] = [
  {
    id: "PRG-77",
    title: "Phase 2 — Strength & Balance",
    doctor: "Dr. Lina Farouk",
    assignedAt: "2026-07-20",
    isCompleted: false,
    exercises: [
      { id: "ex1", name: "Straight Leg Raise", sets: 3, reps: 12, notes: "Hold 3 seconds at top. Keep knee locked." },
      { id: "ex2", name: "Mini Squats", sets: 3, reps: 10, notes: "Hips back, knees behind toes." },
      { id: "ex3", name: "Single-Leg Balance", sets: 3, reps: 30, notes: "Seconds per side. Use support if needed." },
      { id: "ex4", name: "Heel Slides", sets: 2, reps: 15, notes: "Full range without pain." },
    ],
  },
  {
    id: "PRG-74",
    title: "Phase 1 — Range of Motion",
    doctor: "Dr. Amira Hassan",
    assignedAt: "2026-07-12",
    isCompleted: true,
    exercises: [
      { id: "ex5", name: "Passive Knee Extension", sets: 3, reps: 10, notes: "Hold 20 seconds." },
      { id: "ex6", name: "Ankle Pumps", sets: 3, reps: 20, notes: "Slow and controlled." },
    ],
  },
];

export const demoInvoices: PortalInvoice[] = [
  { id: "INV-301", description: "Sports Rehab Session × 6", amount: 1800, currency: "YER", status: "paid", issuedAt: "2026-07-29" },
  { id: "INV-302", description: "Orthopedic Rehab Session × 4", amount: 1200, currency: "YER", status: "unpaid", issuedAt: "2026-08-01" },
  { id: "INV-299", description: "Initial Assessment", amount: 250, currency: "YER", status: "paid", issuedAt: "2026-07-12" },
];
