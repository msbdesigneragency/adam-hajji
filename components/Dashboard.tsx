"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  CalendarDays,
  LayoutDashboard,
  Users,
  Settings,
  Stethoscope,
  ArrowUpRight,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Clock,
  LogOut,
} from "lucide-react";
import {
  Appointment,
  Rules,
  pick,
  services,
  name,
  getAppointments,
  saveAppointments,
  getRules,
  availableSlots,
  today,
} from "@/lib/data";
import Booking from "./Booking";
import Logo from "./Logo";
export default function Dashboard() {
  const [l, setL] = useState("fr"),
    [entered, setEntered] = useState(false),
    [tab, setTab] = useState(0),
    [appointments, setAppointments] = useState<Appointment[]>([]),
    [rules, setRules] = useState<Rules | null>(null),
    [view, setView] = useState("week"),
    [anchor, setAnchor] = useState(today()),
    [selected, setSelected] = useState<Appointment | null>(null),
    [search, setSearch] = useState(""),
    [status, setStatus] = useState("all"),
    [booking, setBooking] = useState(false),
    [notice, setNotice] = useState(""),
    [alternative, setAlternative] = useState(""),
    [altTime, setAltTime] = useState(""),
    [enabled, setEnabled] = useState<string[]>(services.map((s) => s[0]));
  const t = (a: string, b: string, c: string) => pick(l, a, b, c);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!selected) return;
    const previous = document.activeElement as HTMLElement;
    panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "Tab") {
        const elements = panel.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled),input,select",
        );
        if (!elements?.length) return;
        const first = elements[0],
          last = elements[elements.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [selected?.id]);
  useEffect(() => {
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  }, [l]);
  useEffect(() => {
    setAppointments(getAppointments());
    setRules(getRules());
    setEnabled(
      JSON.parse(localStorage.getItem("adam-services") || "null") ||
        services.map((s) => s[0]),
    );
    const listener = () => setAppointments(getAppointments());
    window.addEventListener("appointments", listener);
    return () => window.removeEventListener("appointments", listener);
  }, []);
  const statusText = (s: string) =>
    ({
      pending: t("En attente", "Pending", "بانتظار الموافقة"),
      confirmed: t("Confirmé", "Confirmed", "مؤكد"),
      declined: t("Refusé", "Declined", "مرفوض"),
      cancelled: t("Annulé", "Cancelled", "ملغى"),
      alternative: t(
        "Alternative proposée",
        "Alternative proposed",
        "وقت بديل مقترح",
      ),
    })[s] || s;
  const update = (a: Appointment, s: Appointment["status"]) => {
    if (
      s === "confirmed" &&
      !availableSlots(
        a.date,
        rules!,
        appointments.filter((v) => v.id !== a.id),
        a.service,
      ).includes(a.time)
    ) {
      setNotice(
        t(
          "Conflit : ce créneau est indisponible.",
          "Conflict: this time is unavailable.",
          "تعارض: هذا الوقت غير متاح.",
        ),
      );
      return;
    }
    const next = appointments.map((v) =>
      v.id === a.id ? { ...a, status: s } : v,
    );
    saveAppointments(next);
    setAppointments(next);
    setSelected({ ...a, status: s });
    setNotice(
      t(
        "Modification enregistrée sur cet appareil.",
        "Change saved on this device.",
        "تم حفظ التعديل على هذا الجهاز.",
      ),
    );
  };
  const tabs = [
    t("Vue d’ensemble", "Overview", "نظرة عامة"),
    t("Calendrier", "Calendar", "التقويم"),
    t("Patients démo", "Demo patients", "مرضى تجريبيون"),
    t("Soins", "Treatments", "العلاجات"),
    t("Disponibilités", "Availability", "أوقات العمل"),
    t("Paramètres", "Settings", "الإعدادات"),
  ];
  const filtered = appointments.filter(
    (a) =>
      (status === "all" || a.status === status) &&
      `${a.name} ${a.email} ${a.phone}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const d = new Date(anchor + "T12:00");
  const start = new Date(d);
  if (view === "week")
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  if (view === "month") start.setDate(1);
  const count =
    view === "day"
      ? 1
      : view === "week"
        ? 7
        : new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const key = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const move = (direction: number) => {
    const date = new Date(d);
    if (view === "month") date.setMonth(date.getMonth() + direction);
    else date.setDate(date.getDate() + direction * (view === "week" ? 7 : 1));
    setAnchor(key(date));
  };
  if (!entered)
    return (
      <div className="admin-gate" dir={l === "ar" ? "rtl" : "ltr"}>
        <div className="gate-card">
          <div className="gate-brand">
            <Logo priority />
          </div>
          <div className="eyebrow">
            {t("ESPACE PRATICIEN", "PRACTITIONER AREA", "مساحة الطبيب")}
          </div>
          <h1>
            {t(
              "Votre cabinet,\nen un regard.",
              "Your clinic,\nat a glance.",
              "عيادتكم،\nبنظرة واحدة.",
            )}
          </h1>
          <p>
            {t(
              "Démonstration locale sans authentification. Utilisez uniquement des données fictives. Cette interface ne protège pas de dossiers médicaux.",
              "Local demonstration without authentication. Use fictional data only. This interface does not secure medical records.",
              "تجربة محلية بدون مصادقة. استخدموا بيانات وهمية فقط. هذه الواجهة لا تحمي السجلات الطبية.",
            )}
          </p>
          <button className="button" onClick={() => setEntered(true)}>
            {t(
              "Explorer le tableau de bord",
              "Explore the dashboard",
              "استكشاف لوحة الإدارة",
            )}
            <ArrowUpRight size={18} />
          </button>
          <Link href={`/${l}`}>
            {t("Retour au site", "Return to website", "العودة للموقع")}
          </Link>
          <select
            aria-label="Language"
            value={l}
            onChange={(e) => setL(e.target.value)}
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </div>
      </div>
    );
  return (
    <div className="admin" dir={l === "ar" ? "rtl" : "ltr"}>
      <aside className="admin-sidebar">
        <Link className="dashboard-brand" href={`/${l}`}>
          <Logo priority />
        </Link>
        <span className="small-label">
          {t("ESPACE PRATICIEN", "PRACTITIONER AREA", "مساحة الطبيب")}
        </span>
        <nav>
          {tabs.map((label, i) => {
            const Icon = [
              LayoutDashboard,
              CalendarDays,
              Users,
              Stethoscope,
              Clock,
              Settings,
            ][i];
            return (
              <button
                key={label}
                className={tab === i ? "selected" : ""}
                onClick={() => {
                  setTab(i);
                  setNotice("");
                }}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <p>
            Dr. Adam Hajji
            <small>
              {t("Mode démonstration", "Demonstration mode", "وضع تجريبي")}
            </small>
          </p>
          <button
            className="icon"
            onClick={() => setEntered(false)}
            aria-label={t("Quitter", "Exit", "خروج")}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-top">
          <Link className="dashboard-mobile-brand" href={`/${l}`}>
            <Logo priority />
          </Link>
          <span className="admin-top-name">
            Adam Dental Center{" "}
            <span className="demo-badge">
              {t("DÉMO LOCALE", "LOCAL DEMO", "تجربة محلية")}
            </span>
          </span>
          <select
            aria-label={t("Langue", "Language", "اللغة")}
            value={l}
            onChange={(e) => setL(e.target.value)}
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
            <option value="ar">AR</option>
          </select>
        </header>
        <div className="admin-content">
          <div className="section-top">
            <div>
              <div className="eyebrow">
                {new Date().toLocaleDateString(l, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </div>
              <h1>
                {tab === 0
                  ? t(
                      "Bonjour, Dr. Adam.",
                      "Welcome, Dr. Adam.",
                      "مرحباً، د. آدم.",
                    )
                  : tabs[tab]}
              </h1>
              <p>
                {t(
                  "Un espace clair pour organiser vos journées.",
                  "A clear space to organize your day.",
                  "مساحة واضحة لتنظيم يومكم.",
                )}
              </p>
            </div>
            <button className="button" onClick={() => setBooking(true)}>
              <Plus size={17} />
              {t("Nouvelle demande", "New request", "طلب جديد")}
            </button>
          </div>
          {notice && (
            <p role="status" className="notice">
              {notice}
            </p>
          )}
          {tab === 0 && (
            <div className="stat-grid">
              {[
                t("Aujourd’hui", "Today", "اليوم"),
                t("En attente", "Pending", "قيد الانتظار"),
                t("Confirmés", "Confirmed", "مؤكدة"),
                t("À venir", "Upcoming", "قادمة"),
                t("Annulations", "Cancelled", "ملغاة"),
              ].map((label, i) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>
                    {
                      [
                        appointments.filter((a) => a.date === today()).length,
                        appointments.filter((a) => a.status === "pending")
                          .length,
                        appointments.filter((a) => a.status === "confirmed")
                          .length,
                        appointments.filter(
                          (a) =>
                            a.date >= today() &&
                            ["confirmed", "pending"].includes(a.status),
                        ).length,
                        appointments.filter((a) => a.status === "cancelled")
                          .length,
                      ][i]
                    }
                  </strong>
                  <CalendarDays size={18} />
                </div>
              ))}
            </div>
          )}
          {(tab === 0 || tab === 1) && (
            <>
              <div className="dashboard-panel">
                <div className="calendar-toolbar">
                  <div>
                    <h3>{t("Votre calendrier", "Your calendar", "تقويمكم")}</h3>
                    <p>
                      {d.toLocaleDateString(l, {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="toolbar-actions">
                    <button
                      className="button secondary compact"
                      onClick={() => setAnchor(today())}
                    >
                      {t("Aujourd’hui", "Today", "اليوم")}
                    </button>
                    <button
                      className="icon"
                      aria-label={t("Précédent", "Previous", "السابق")}
                      onClick={() => move(-1)}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      className="icon"
                      aria-label={t("Suivant", "Next", "التالي")}
                      onClick={() => move(1)}
                    >
                      <ChevronRight size={18} />
                    </button>
                    <select
                      aria-label={t("Vue", "View", "عرض")}
                      value={view}
                      onChange={(e) => setView(e.target.value)}
                    >
                      <option value="day">{t("Jour", "Day", "يوم")}</option>
                      <option value="week">
                        {t("Semaine", "Week", "أسبوع")}
                      </option>
                      <option value="month">{t("Mois", "Month", "شهر")}</option>
                    </select>
                  </div>
                </div>
                <div className={`admin-calendar ${view}`}>
                  {view === "month" &&
                    Array.from({ length: (start.getDay() + 6) % 7 }, (_, i) => (
                      <div className="agenda-blank" key={"blank" + i} />
                    ))}
                  {Array.from({ length: count }, (_, i) => {
                    const date = new Date(start);
                    date.setDate(start.getDate() + i);
                    const dateKey = key(date);
                    const items = filtered.filter((a) => a.date === dateKey);
                    return (
                      <div
                        className={`agenda-day ${dateKey === today() ? "is-today" : ""}`}
                        key={dateKey}
                      >
                        <div className="agenda-date">
                          <small>
                            {date.toLocaleDateString(l, { weekday: "short" })}
                          </small>
                          <strong>{date.getDate()}</strong>
                        </div>
                        {items.map((a) => (
                          <button
                            key={a.id}
                            className={`appointment-card ${a.status}`}
                            onClick={() => {
                              setSelected(a);
                              setAlternative(a.date);
                              setAltTime(a.time);
                            }}
                          >
                            <span>{a.time}</span>
                            <strong>{a.name}</strong>
                            <small>
                              {name(
                                services.find((s) => s[0] === a.service) ||
                                  services[0],
                                l,
                              )}
                            </small>
                            <em>{statusText(a.status)}</em>
                          </button>
                        ))}
                        {!items.length && <span className="empty-day">—</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="dashboard-panel">
                <div className="table-toolbar">
                  <h3>
                    {t(
                      "Demandes de rendez-vous",
                      "Appointment requests",
                      "طلبات المواعيد",
                    )}
                  </h3>
                  <div className="search">
                    <Search size={16} />
                    <input
                      placeholder={t(
                        "Rechercher un patient…",
                        "Search patients…",
                        "البحث عن مريض…",
                      )}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <select
                    value={status}
                    aria-label={t("Statut", "Status", "الحالة")}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="all">
                      {t("Tous les statuts", "All statuses", "كل الحالات")}
                    </option>
                    {[
                      "pending",
                      "confirmed",
                      "declined",
                      "cancelled",
                      "alternative",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {statusText(s)}
                      </option>
                    ))}
                  </select>
                </div>
                {filtered.length ? (
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          {[
                            t("Patient", "Patient", "المريض"),
                            t("Soin", "Treatment", "العلاج"),
                            t(
                              "Date & horaire",
                              "Date & time",
                              "التاريخ والوقت",
                            ),
                            t("Statut", "Status", "الحالة"),
                            "",
                          ].map((v, i) => (
                            <th key={i}>{v}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((a) => (
                          <tr key={a.id}>
                            <td>
                              <strong>{a.name}</strong>
                              <small>{a.email}</small>
                            </td>
                            <td>
                              {name(
                                services.find((s) => s[0] === a.service) ||
                                  services[0],
                                l,
                              )}
                            </td>
                            <td>
                              {a.date}
                              <small>{a.time}</small>
                            </td>
                            <td>
                              <span className={`status ${a.status}`}>
                                {statusText(a.status)}
                              </span>
                            </td>
                            <td>
                              <button
                                className="icon"
                                onClick={() => {
                                  setSelected(a);
                                  setAlternative(a.date);
                                  setAltTime(a.time);
                                }}
                                aria-label={t("Détails", "Details", "التفاصيل")}
                              >
                                <ArrowUpRight size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <CalendarDays />
                    <h3>
                      {t(
                        "Une page blanche pour votre journée.",
                        "A fresh start to your day.",
                        "بداية جديدة ليومكم.",
                      )}
                    </h3>
                    <p>
                      {t(
                        "Créez une demande fictive pour explorer la gestion des rendez-vous.",
                        "Create a fictional request to explore appointment management.",
                        "أنشئوا طلباً وهمياً لاستكشاف إدارة المواعيد.",
                      )}
                    </p>
                    <button
                      className="button secondary"
                      onClick={() => setBooking(true)}
                    >
                      <Plus size={17} />
                      {t("Créer une demande", "Create a request", "إنشاء طلب")}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          {tab === 2 && (
            <div className="dashboard-panel">
              <h3>
                {t("Annuaire fictif", "Fictional directory", "دليل وهمي")}
              </h3>
              <p className="demo-note">
                {t(
                  "Données de démonstration uniquement. Aucun dossier médical.",
                  "Demonstration data only. No medical records.",
                  "بيانات تجريبية فقط. بدون سجلات طبية.",
                )}
              </p>
              {appointments.length ? (
                Array.from(
                  new Map(appointments.map((a) => [a.email, a])).values(),
                ).map((a) => (
                  <div className="directory-row" key={a.email}>
                    <span className="avatar">{a.name.slice(0, 1)}</span>
                    <strong>{a.name}</strong>
                    <span>{a.email}</span>
                    <span>{a.phone}</span>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <Users />
                  <p>
                    {t(
                      "Le répertoire se remplit avec vos demandes fictives.",
                      "The directory fills with your fictional requests.",
                      "يتم ملء الدليل من طلباتكم الوهمية.",
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
          {tab === 3 && (
            <div className="dashboard-panel">
              <h3>
                {t(
                  "Catalogue provisoire",
                  "Provisional catalog",
                  "كتالوج مؤقت",
                )}
              </h3>
              <p>
                {t(
                  "Configuration locale des services. Vérifiez les prestations avant lancement.",
                  "Local service settings. Verify offerings before launch.",
                  "إعدادات محلية للخدمات. يرجى التحقق قبل الإطلاق.",
                )}
              </p>
              {services.map((s) => (
                <div key={s[0]} className="directory-row">
                  <input
                    aria-label={name(s, l)}
                    type="checkbox"
                    checked={enabled.includes(s[0])}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...enabled, s[0]]
                        : enabled.filter((v) => v !== s[0]);
                      setEnabled(next);
                      localStorage.setItem(
                        "adam-services",
                        JSON.stringify(next),
                      );
                    }}
                  />
                  <strong>{name(s, l)}</strong>
                  <input
                    aria-label={
                      name(s, l) +
                      " · " +
                      t(
                        "Durée en minutes",
                        "Duration in minutes",
                        "المدة بالدقائق",
                      )
                    }
                    type="number"
                    min={5}
                    max={180}
                    step={5}
                    value={rules?.durations?.[s[0]] || rules?.duration || 30}
                    onChange={(e) => {
                      if (!rules) return;
                      const next = {
                        ...rules,
                        durations: {
                          ...rules.durations,
                          [s[0]]: Math.max(5, Number(e.target.value)),
                        },
                      };
                      setRules(next);
                      localStorage.setItem("adam-rules", JSON.stringify(next));
                    }}
                  />
                  <span>
                    {t(
                      "Actif dans le parcours démo · minutes",
                      "Active in demo booking · minutes",
                      "متاح في الحجز التجريبي · دقائق",
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
          {tab === 4 && rules && (
            <form
              className="dashboard-panel settings-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  rules.open >= rules.close ||
                  rules.breakStart >= rules.breakEnd ||
                  rules.duration < 5
                ) {
                  setNotice(
                    t(
                      "Vérifiez les plages horaires et la durée.",
                      "Check opening hours, break and duration.",
                      "تحققوا من الأوقات والمدة.",
                    ),
                  );
                  return;
                }
                localStorage.setItem("adam-rules", JSON.stringify(rules));
                setNotice(
                  t(
                    "Disponibilités de démonstration enregistrées.",
                    "Demo availability saved.",
                    "تم حفظ الأوقات التجريبية.",
                  ),
                );
              }}
            >
              <h3>
                {t(
                  "Règles de planification",
                  "Scheduling rules",
                  "قواعد الجدولة",
                )}
              </h3>
              <p>
                {t(
                  "Ces horaires sont fictifs et ne représentent pas les horaires du cabinet.",
                  "These are fictional hours, not verified clinic opening hours.",
                  "هذه أوقات وهمية وليست أوقات عمل العيادة المؤكدة.",
                )}
              </p>
              <div className="working-days">
                {Array.from({ length: 7 }, (_, i) => {
                  const day = (i + 1) % 7;
                  return (
                    <label key={day}>
                      <input
                        type="checkbox"
                        checked={rules.days.includes(day)}
                        onChange={(e) =>
                          setRules({
                            ...rules,
                            days: e.target.checked
                              ? [...rules.days, day]
                              : rules.days.filter((v) => v !== day),
                          })
                        }
                      />
                      {new Date(2026, 9, 26 + i).toLocaleDateString(l, {
                        weekday: "long",
                      })}
                    </label>
                  );
                })}
              </div>
              <div className="settings-grid">
                {(
                  [
                    "open",
                    "close",
                    "breakStart",
                    "breakEnd",
                    "duration",
                    "buffer",
                  ] as const
                ).map((field, i) => (
                  <label key={field}>
                    {
                      [
                        t("Ouverture (heure)", "Opening hour", "ساعة الفتح"),
                        t("Fermeture (heure)", "Closing hour", "ساعة الإغلاق"),
                        t("Début de pause", "Break start", "بداية الاستراحة"),
                        t("Fin de pause", "Break end", "نهاية الاستراحة"),
                        t(
                          "Durée des soins (minutes)",
                          "Treatment duration (minutes)",
                          "مدة العلاج بالدقائق",
                        ),
                        t(
                          "Intervalle (minutes)",
                          "Buffer (minutes)",
                          "الفاصل بالدقائق",
                        ),
                      ][i]
                    }
                    <input
                      type="number"
                      required
                      min={i < 4 ? 0 : i === 4 ? 5 : 0}
                      max={i < 4 ? 23 : 180}
                      value={rules[field]}
                      onChange={(e) =>
                        setRules({ ...rules, [field]: Number(e.target.value) })
                      }
                    />
                  </label>
                ))}
                <label>
                  {t(
                    "Fermetures & jours fériés (dates séparées par des virgules)",
                    "Closures & holidays (comma-separated dates)",
                    "الإغلاق والعطل (تواريخ تفصل بفواصل)",
                  )}
                  <input
                    placeholder="2026-12-25, 2027-01-01"
                    value={rules.closed.join(", ")}
                    onChange={(e) =>
                      setRules({
                        ...rules,
                        closed: e.target.value
                          .split(",")
                          .map((v) => v.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </label>
              </div>
              <button className="button" type="submit">
                <Check size={16} />
                {t(
                  "Enregistrer les règles",
                  "Save scheduling rules",
                  "حفظ القواعد",
                )}
              </button>
            </form>
          )}
          {tab === 5 && (
            <div className="dashboard-panel settings-form">
              <h3>
                {t(
                  "À propos de cette démonstration",
                  "About this demonstration",
                  "حول هذه التجربة",
                )}
              </h3>
              <p>
                {t(
                  "Les données restent dans le navigateur. Une mise en production exige une authentification serveur, des autorisations, une base de données et des garanties de confidentialité.",
                  "Data stays in this browser. Production requires server authentication, authorization, a database and privacy safeguards.",
                  "تبقى البيانات في هذا المتصفح. يتطلب الإنتاج مصادقة خادم وصلاحيات وقاعدة بيانات وضمانات خصوصية.",
                )}
              </p>
              <button
                className="button secondary"
                onClick={() => {
                  if (
                    window.confirm(
                      t(
                        "Effacer toutes les demandes de démonstration de cet appareil ?",
                        "Delete all demonstration requests from this device?",
                        "حذف جميع الطلبات التجريبية من هذا الجهاز؟",
                      ),
                    )
                  ) {
                    saveAppointments([]);
                    setAppointments([]);
                    setNotice(
                      t(
                        "Demandes de démonstration effacées.",
                        "Demo requests cleared.",
                        "تم حذف الطلبات التجريبية.",
                      ),
                    );
                  }
                }}
              >
                {t(
                  "Effacer les données démo",
                  "Clear demo data",
                  "حذف البيانات التجريبية",
                )}
              </button>
            </div>
          )}
        </div>
      </main>
      {selected && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div
            className="details-panel"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={t(
              "Détails du rendez-vous",
              "Appointment details",
              "تفاصيل الموعد",
            )}
          >
            <button
              className="icon close"
              onClick={() => setSelected(null)}
              aria-label={t("Fermer", "Close", "إغلاق")}
            >
              <X />
            </button>
            <div className="eyebrow">
              {t("DEMANDE DÉMO", "DEMO REQUEST", "طلب تجريبي")}
            </div>
            <h2>{selected.name}</h2>
            <p>
              {selected.email}
              <br />
              {selected.phone}
            </p>
            <span className={`status ${selected.status}`}>
              {statusText(selected.status)}
            </span>
            <div className="review">
              <div>
                {name(
                  services.find((s) => s[0] === selected.service) ||
                    services[0],
                  l,
                )}
              </div>
              <div>
                {selected.date} · {selected.time}
              </div>
              <p>{selected.message}</p>
            </div>
            <div className="detail-actions">
              <button
                className="button"
                onClick={() => update(selected, "confirmed")}
              >
                {t("Confirmer", "Confirm", "تأكيد")}
              </button>
              <button
                className="button secondary"
                onClick={() => update(selected, "declined")}
              >
                {t("Refuser", "Decline", "رفض")}
              </button>
              <button
                className="button secondary"
                onClick={() => update(selected, "cancelled")}
              >
                {t("Annuler", "Cancel", "إلغاء")}
              </button>
            </div>
            <h3>
              {t(
                "Proposer un autre créneau",
                "Propose an alternative",
                "اقتراح وقت بديل",
              )}
            </h3>
            <label>
              {t("Date", "Date", "التاريخ")}
              <input
                type="date"
                min={today()}
                value={alternative}
                onChange={(e) => {
                  setAlternative(e.target.value);
                  setAltTime("");
                }}
              />
            </label>
            <label>
              {t("Horaire", "Time", "الوقت")}
              <select
                value={altTime}
                onChange={(e) => setAltTime(e.target.value)}
              >
                <option value="">—</option>
                {availableSlots(
                  alternative,
                  rules!,
                  appointments.filter((a) => a.id !== selected.id),
                  selected.service,
                ).map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <button
              className="button secondary"
              disabled={!alternative || !altTime}
              onClick={() =>
                update(
                  { ...selected, date: alternative, time: altTime },
                  "alternative",
                )
              }
            >
              {t("Enregistrer la proposition", "Save proposal", "حفظ الاقتراح")}
            </button>
            <small>
              {t(
                "Aucun message envoyé au patient. Proposition locale uniquement.",
                "No message is sent to the patient. Local proposal only.",
                "لا يتم إرسال رسالة للمريض. اقتراح محلي فقط.",
              )}
            </small>
            {notice && (
              <p role="status" className="notice">
                {notice}
              </p>
            )}
          </div>
        </div>
      )}
      {booking && <Booking locale={l} onClose={() => setBooking(false)} />}
    </div>
  );
}
