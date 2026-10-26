export type Locale = "fr" | "en" | "ar";
export const pick = (l: string, fr: string, en: string, ar: string) =>
  l === "ar" ? ar : l === "en" ? en : fr;
export const services = [
  [
    "consultation",
    "Consultation dentaire",
    "Dental consultation",
    "استشارة طب الأسنان",
  ],
  ["cleaning", "Détartrage & nettoyage", "Scaling & cleaning", "تنظيف الأسنان"],
  ["whitening", "Blanchiment dentaire", "Teeth whitening", "تبييض الأسنان"],
  ["orthodontics", "Orthodontie", "Orthodontics", "تقويم الأسنان"],
  ["veneers", "Facettes dentaires", "Dental veneers", "قشور الأسنان"],
  ["implants", "Implants dentaires", "Dental implants", "زراعة الأسنان"],
  ["cavities", "Soins des caries", "Cavity care", "علاج التسوس"],
  [
    "endodontics",
    "Traitement endodontique",
    "Root canal treatment",
    "علاج الجذور",
  ],
  ["surgery", "Chirurgie dentaire", "Dental surgery", "جراحة الأسنان"],
  [
    "prosthetics",
    "Prothèses dentaires",
    "Dental prosthetics",
    "تركيبات الأسنان",
  ],
  ["aesthetics", "Soins esthétiques", "Cosmetic dentistry", "تجميل الأسنان"],
  ["emergency", "Urgences dentaires", "Dental emergencies", "طوارئ الأسنان"],
];
export const name = (s: string[], l: string) =>
  s[l === "ar" ? 3 : l === "en" ? 2 : 1];
export type Appointment = {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  message: string;
  status: "pending" | "confirmed" | "declined" | "cancelled" | "alternative";
};
export type Rules = {
  days: number[];
  open: number;
  close: number;
  breakStart: number;
  breakEnd: number;
  duration: number;
  buffer: number;
  closed: string[];
  durations?: Record<string, number>;
};
export const defaultRules: Rules = {
  days: [1, 2, 3, 4, 5, 6],
  open: 9,
  close: 18,
  breakStart: 13,
  breakEnd: 14,
  duration: 30,
  buffer: 0,
  closed: [],
};
export function getRules(): Rules {
  try {
    return (
      JSON.parse(localStorage.getItem("adam-rules") || "null") || defaultRules
    );
  } catch {
    return defaultRules;
  }
}
export function getAppointments(): Appointment[] {
  try {
    return JSON.parse(localStorage.getItem("adam-appointments") || "[]");
  } catch {
    return [];
  }
}
export function saveAppointments(a: Appointment[]) {
  localStorage.setItem("adam-appointments", JSON.stringify(a));
  window.dispatchEvent(new Event("appointments"));
}
export function slots(
  date: string,
  r: Rules,
  appointments: Appointment[],
  service?: string,
) {
  const duration = r.durations?.[service || ""] || r.duration;
  if (
    !date ||
    !r.days.includes(new Date(date + "T12:00").getDay()) ||
    r.closed.includes(date)
  )
    return [];
  const result = [];
  for (
    let m = r.open * 60;
    m + duration <= r.close * 60;
    m += duration + r.buffer
  ) {
    if (m < r.breakEnd * 60 && m + duration > r.breakStart * 60) continue;
    const time = `${Math.floor(m / 60)
      .toString()
      .padStart(2, "0")}:${(m % 60).toString().padStart(2, "0")}`;
    if (
      !appointments.some(
        (a) =>
          a.date === date &&
          ["confirmed", "pending"].includes(a.status) &&
          m <
            Number(a.time.split(":")[0]) * 60 +
              Number(a.time.split(":")[1]) +
              (r.durations?.[a.service] || r.duration) +
              r.buffer &&
          m + duration + r.buffer >
            Number(a.time.split(":")[0]) * 60 + Number(a.time.split(":")[1]),
      )
    )
      result.push(time);
  }
  return result;
}
export function today(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Casablanca",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
export function availableSlots(
  date: string,
  rules: Rules,
  appointments: Appointment[],
  service?: string,
  now = new Date(),
) {
  const current = today(now);
  if (date < current) return [];
  const clock = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Casablanca",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
  return slots(date, rules, appointments, service).filter(
    (time) => date !== current || time > clock,
  );
}
