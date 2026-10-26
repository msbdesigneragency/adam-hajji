"use client";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  ShieldCheck,
} from "lucide-react";
import {
  pick,
  services,
  name,
  availableSlots,
  getRules,
  getAppointments,
  saveAppointments,
  today,
} from "@/lib/data";
export default function Booking({
  locale: l,
  onClose,
  initialService,
}: {
  locale: string;
  onClose: () => void;
  initialService?: string;
}) {
  const t = (a: string, b: string, c: string) => pick(l, a, b, c);
  const [step, setStep] = useState(0),
    [service, setService] = useState(initialService || ""),
    [date, setDate] = useState(""),
    [time, setTime] = useState(""),
    [month, setMonth] = useState(new Date()),
    [error, setError] = useState("");
  const dialog = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState<string[]>([]);
  const [enabled, setEnabled] = useState<string[]>(services.map((s) => s[0]));
  useEffect(() => {
    setEnabled(
      JSON.parse(localStorage.getItem("adam-services") || "null") ||
        services.map((s) => s[0]),
    );
  }, []);
  const required = t(
    "Ce champ est requis.",
    "This field is required.",
    "هذا الحقل مطلوب.",
  );
  const schema = z.object({
    name: z.string().trim().min(2, required),
    phone: z
      .string()
      .regex(
        /^[+\d\s()-]{8,20}$/,
        t(
          "Saisissez un numéro valide.",
          "Enter a valid phone number.",
          "أدخلوا رقم هاتف صالحاً.",
        ),
      ),
    email: z
      .string()
      .email(
        t(
          "Saisissez un email valide.",
          "Enter a valid email address.",
          "أدخلوا بريداً إلكترونياً صالحاً.",
        ),
      ),
    message: z
      .string()
      .max(
        300,
        t(
          "300 caractères maximum.",
          "Maximum 300 characters.",
          "٣٠٠ حرف كحد أقصى.",
        ),
      ),
  });
  type Values = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", message: "" },
  });
  useEffect(() => {
    setAvailable(availableSlots(date, getRules(), getAppointments(), service));
    setTime("");
  }, [date, service]);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    dialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const elements = dialog.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled),input,textarea,a[href]",
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
    document.addEventListener("keydown", listener);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", listener);
      previous?.focus();
    };
  }, []);
  const labels = [
    t("Soin", "Treatment", "العلاج"),
    t("Date", "Date", "التاريخ"),
    t("Horaire", "Time", "الوقت"),
    t("Vos informations", "Your details", "بياناتكم"),
    t("Récapitulatif", "Review", "المراجعة"),
    t("Demande créée", "Request created", "تم إنشاء الطلب"),
  ];
  const headings = [
    t(
      "Comment pouvons-nous vous aider ?",
      "How can we help you?",
      "كيف يمكننا مساعدتكم؟",
    ),
    t("Choisissez votre date.", "Choose your date.", "اختاروا التاريخ."),
    t("Un moment pour vous.", "Make time for yourself.", "وقت مخصص لكم."),
    t("Faisons connaissance.", "Let’s get to know you.", "لنتعرف عليكم."),
    t(
      "Tout est prêt ?",
      "Does everything look right?",
      "هل جميع البيانات صحيحة؟",
    ),
    t(
      "Votre demande est enregistrée.",
      "Your request has been saved.",
      "تم حفظ طلبكم.",
    ),
  ];
  const submit = () => {
    if (
      !availableSlots(date, getRules(), getAppointments(), service).includes(
        time,
      )
    ) {
      setError(
        t(
          "Ce créneau est devenu indisponible. Choisissez un autre horaire.",
          "This time is no longer available. Please choose another.",
          "لم يعد هذا الوقت متاحاً. اختاروا وقتاً آخر.",
        ),
      );
      setStep(2);
      setAvailable(
        availableSlots(date, getRules(), getAppointments(), service),
      );
      setTime("");
      return;
    }
    const a = getAppointments();
    saveAppointments([
      ...a,
      {
        ...getValues(),
        id: crypto.randomUUID(),
        service,
        date,
        time,
        status: "pending",
      },
    ]);
    setStep(5);
  };
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const offset =
    (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const fmt = new Intl.DateTimeFormat(l, { month: "long", year: "numeric" });
  const selectedName = services.find((s) => s[0] === service);
  const calendarKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const delta =
      e.key === "ArrowRight"
        ? 1
        : e.key === "ArrowLeft"
          ? -1
          : e.key === "ArrowDown"
            ? 7
            : e.key === "ArrowUp"
              ? -7
              : 0;
    if (delta) {
      e.preventDefault();
      const buttons = Array.from(
        dialog.current!.querySelectorAll<HTMLButtonElement>(
          ".calendar-grid button",
        ),
      );
      const index = buttons.indexOf(e.currentTarget);
      buttons[
        Math.max(0, Math.min(buttons.length - 1, index + delta))
      ]?.focus();
    }
  };
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="booking-modal"
        ref={dialog}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        dir={l === "ar" ? "rtl" : "ltr"}
      >
        <header className="modal-header">
          <span>
            <Logo className="booking-logo" />
            <small>{t("RENDEZ-VOUS", "APPOINTMENT", "موعد")}</small>
          </span>
          <button
            className="icon"
            onClick={onClose}
            aria-label={t("Fermer", "Close", "إغلاق")}
          >
            <X />
          </button>
        </header>
        <div className="booking-progress">
          {labels.map((label, i) => (
            <div className={step >= i ? "done" : ""} key={label}>
              <span>{i < step ? <Check size={13} /> : i + 1}</span>
              <small>{label}</small>
            </div>
          ))}
        </div>
        <div className="booking-layout">
          <div className="booking-main">
            <span className="eyebrow">
              {t("ÉTAPE", "STEP", "الخطوة")} {step + 1} / 6
            </span>
            <h2 id="booking-title">{headings[step]}</h2>
            <p className="demo-note">
              {t(
                "Mode démo · créneaux simulés · données conservées sur cet appareil.",
                "Demo mode · simulated availability · data saved on this device.",
                "وضع تجريبي · أوقات محاكاة · تحفظ البيانات على هذا الجهاز.",
              )}
            </p>
            {step === 0 && (
              <div className="booking-services">
                {services
                  .filter((s) => enabled.includes(s[0]))
                  .map((s) => (
                    <button
                      key={s[0]}
                      className={service === s[0] ? "selected" : ""}
                      onClick={() => setService(s[0])}
                    >
                      {name(s, l)}
                      {service === s[0] ? <Check size={16} /> : <span>+</span>}
                    </button>
                  ))}
              </div>
            )}
            {step === 1 && (
              <div className="calendar">
                <div className="calendar-toolbar">
                  <button
                    className="icon"
                    aria-label={t(
                      "Mois précédent",
                      "Previous month",
                      "الشهر السابق",
                    )}
                    onClick={() =>
                      setMonth(
                        new Date(month.getFullYear(), month.getMonth() - 1, 1),
                      )
                    }
                  >
                    <ChevronLeft />
                  </button>
                  <strong>{fmt.format(month)}</strong>
                  <button
                    className="icon"
                    aria-label={t("Mois suivant", "Next month", "الشهر التالي")}
                    onClick={() =>
                      setMonth(
                        new Date(month.getFullYear(), month.getMonth() + 1, 1),
                      )
                    }
                  >
                    <ChevronRight />
                  </button>
                </div>
                <div className="calendar-grid">
                  {Array.from({ length: 7 }, (_, i) => (
                    <small key={"w" + i}>
                      {new Intl.DateTimeFormat(l, { weekday: "short" }).format(
                        new Date(2026, 9, 26 + i),
                      )}
                    </small>
                  ))}
                  {Array.from({ length: offset }, (_, i) => (
                    <span key={"b" + i} />
                  ))}
                  {Array.from({ length: days }, (_, i) => {
                    const d = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
                    const disabled =
                      d < today() ||
                      !availableSlots(d, getRules(), getAppointments(), service)
                        .length;
                    return (
                      <button
                        key={d}
                        aria-label={new Date(d + "T12:00").toLocaleDateString(
                          l,
                          { dateStyle: "full" },
                        )}
                        aria-pressed={date === d}
                        disabled={disabled}
                        onKeyDown={calendarKey}
                        className={date === d ? "selected" : ""}
                        onClick={() => setDate(d)}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                {error && (
                  <p role="alert" className="error">
                    {error}
                  </p>
                )}
                {[
                  t("Matin", "Morning", "صباحاً"),
                  t("Après-midi", "Afternoon", "بعد الظهر"),
                  t("Soir", "Evening", "مساءً"),
                ].map((label, i) => {
                  const group = available.filter((v) =>
                    i === 0
                      ? v < "12:00"
                      : i === 1
                        ? v >= "12:00" && v < "17:00"
                        : v >= "17:00",
                  );
                  return (
                    group.length > 0 && (
                      <div key={label} className="slot-group">
                        <h4>{label}</h4>
                        <div className="slots">
                          {group.map((v) => (
                            <button
                              className={time === v ? "selected" : ""}
                              key={v}
                              onClick={() => {
                                setTime(v);
                                setError("");
                              }}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  );
                })}
                {!available.length && (
                  <p>
                    {t(
                      "Aucun créneau disponible. Choisissez une autre date.",
                      "No times available. Please choose another date.",
                      "لا توجد أوقات متاحة. اختاروا تاريخاً آخر.",
                    )}
                  </p>
                )}
              </div>
            )}
            {step === 3 && (
              <form
                id="patient-form"
                onSubmit={handleSubmit(() => setStep(4))}
                className="patient-form"
              >
                {(["name", "phone", "email"] as const).map((key, i) => (
                  <label key={key}>
                    {
                      [
                        t("Nom complet", "Full name", "الاسم الكامل"),
                        t("Téléphone", "Phone", "الهاتف"),
                        t("Email", "Email", "البريد الإلكتروني"),
                      ][i]
                    }
                    <input
                      autoComplete={
                        key === "name"
                          ? "name"
                          : key === "phone"
                            ? "tel"
                            : "email"
                      }
                      type={
                        key === "email"
                          ? "email"
                          : key === "phone"
                            ? "tel"
                            : "text"
                      }
                      {...register(key)}
                      aria-invalid={!!errors[key]}
                    />
                    {errors[key] && (
                      <span className="error" role="alert">
                        {errors[key]?.message}
                      </span>
                    )}
                  </label>
                ))}
                <label>
                  {t(
                    "Message pratique (facultatif)",
                    "Scheduling note (optional)",
                    "ملاحظة تنظيمية (اختيارية)",
                  )}
                  <textarea
                    {...register("message")}
                    rows={3}
                    placeholder={t(
                      "Aucune information médicale, s’il vous plaît.",
                      "Please do not include medical information.",
                      "يرجى عدم إدخال معلومات طبية.",
                    )}
                  />
                  {errors.message && (
                    <span className="error">{errors.message.message}</span>
                  )}
                </label>
              </form>
            )}
            {step === 4 && (
              <div className="review">
                {[
                  [t("Patient", "Patient", "المريض"), getValues("name")],
                  [t("Téléphone", "Phone", "الهاتف"), getValues("phone")],
                  ["Email", getValues("email")],
                  [
                    t("Soin", "Treatment", "العلاج"),
                    selectedName ? name(selectedName, l) : "",
                  ],
                  [t("Date", "Date", "التاريخ"), date],
                  [t("Horaire", "Time", "الوقت"), time],
                  [t("Message", "Note", "ملاحظة"), getValues("message") || "—"],
                ].map(([key, value]) => (
                  <div key={key}>
                    <span>{key}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
                <p>
                  {t(
                    "En créant cette demande de démonstration, vous acceptez son stockage local. Aucune confirmation du cabinet n’est émise.",
                    "Creating this demonstration request saves it locally on your device. It does not constitute clinic confirmation.",
                    "بإنشاء هذا الطلب التجريبي يتم حفظه محلياً على جهازكم. لا يمثل تأكيداً من العيادة.",
                  )}
                </p>
              </div>
            )}
            {step === 5 && (
              <div className="success">
                <span>
                  <Check size={36} />
                </span>
                <h3>
                  {t(
                    "Merci pour votre confiance.",
                    "Thank you for your trust.",
                    "شكراً لثقتكم.",
                  )}
                </h3>
                <p>
                  {t(
                    "Demande simulée, en attente de validation. Aucun rendez-vous réel n’a été confirmé et aucune notification n’a été envoyée au cabinet.",
                    "Simulated request, pending approval. No real appointment has been confirmed and no notification has been sent to the clinic.",
                    "طلب محاكاة بانتظار الموافقة. لم يتم تأكيد موعد حقيقي أو إرسال إشعار إلى العيادة.",
                  )}
                </p>
                <button className="button" onClick={onClose}>
                  {t(
                    "Revenir au site",
                    "Return to the website",
                    "العودة إلى الموقع",
                  )}
                </button>
              </div>
            )}
            <div className="booking-controls">
              {step > 0 && step < 5 && (
                <button
                  className="button secondary"
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft size={16} />
                  {t("Retour", "Back", "رجوع")}
                </button>
              )}
              {step < 3 && (
                <button
                  className="button"
                  disabled={step === 0 ? !service : step === 1 ? !date : !time}
                  onClick={() => setStep(step + 1)}
                >
                  {t("Continuer", "Continue", "متابعة")}
                  <ArrowRight size={16} />
                </button>
              )}
              {step === 3 && (
                <button type="submit" form="patient-form" className="button">
                  {t("Vérifier ma demande", "Review request", "مراجعة الطلب")}
                  <ArrowRight size={16} />
                </button>
              )}
              {step === 4 && (
                <button className="button" onClick={submit}>
                  {t(
                    "Créer la demande démo",
                    "Create demo request",
                    "إنشاء طلب تجريبي",
                  )}
                  <Check size={16} />
                </button>
              )}
            </div>
          </div>
          <aside className="booking-summary">
            <CalendarDays size={28} />
            <h3>{t("Votre rendez-vous", "Your appointment", "موعدكم")}</h3>
            <p>
              {selectedName
                ? name(selectedName, l)
                : t(
                    "Sélectionnez un soin",
                    "Choose a treatment",
                    "اختاروا علاجاً",
                  )}
            </p>
            <div>
              <CalendarDays size={16} />
              {date || "—"}
            </div>
            <div>
              <Clock size={16} />
              {time || "—"}
            </div>
            <hr />
            <p>
              Dr. Adam Hajji
              <br />
              El Jadida
            </p>
            <small>
              <ShieldCheck size={15} />
              {t(
                "Demande soumise à validation.",
                "Subject to clinic approval.",
                "الطلب يتطلب موافقة العيادة.",
              )}
            </small>
          </aside>
        </div>
      </div>
    </div>
  );
}
