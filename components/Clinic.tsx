"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Plus,
  ShieldCheck,
  Heart,
  ScanLine,
  MapPin,
  Clock,
  Check,
  Pause,
  Play,
  Smile,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { pick, services, name } from "@/lib/data";
import Booking from "./Booking";
import Logo from "./Logo";
import { serviceDescription } from "@/lib/serviceContent";
const icons = [ScanLine, Sparkles, Smile, Heart, ShieldCheck, Plus];
export default function Clinic({
  locale = "fr",
  catalog = false,
  serviceSlug,
}: {
  locale: string;
  catalog?: boolean;
  serviceSlug?: string;
}) {
  const l = ["fr", "en", "ar"].includes(locale) ? locale : "fr";
  const t = (a: string, b: string, c: string) => pick(l, a, b, c);
  const [slide, setSlide] = useState(0),
    [paused, setPaused] = useState(false),
    [hovered, setHovered] = useState(false),
    [focused, setFocused] = useState(false),
    [menu, setMenu] = useState(false),
    [booking, setBooking] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-reveal");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document.querySelectorAll(".section").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [catalog, serviceSlug]);
  useEffect(() => {
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  }, [l]);
  useEffect(() => {
    if (paused || hovered || focused || reduced) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % 3), 6500);
    return () => clearInterval(id);
  }, [paused, hovered, focused, reduced]);
  const titles = [
    t(
      "Votre sourire mérite toute notre attention.",
      "Your smile deserves our full attention.",
      "ابتسامتكم تستحق كل اهتمامنا.",
    ),
    t(
      "Une approche humaine et professionnelle.",
      "Personal care. Professional expertise.",
      "رعاية إنسانية ومهنية.",
    ),
    t(
      "Un environnement pensé pour votre confort.",
      "A space designed around your comfort.",
      "مكان صُمم لراحتكم.",
    ),
  ];
  const descriptions = [
    t(
      "Découvrez notre cabinet dentaire et prenez rendez-vous en quelques instants.",
      "Discover our dental clinic and request an appointment in just a few moments.",
      "اكتشفوا عيادتنا واطلبوا موعداً في لحظات.",
    ),
    t(
      "Dr. Adam Hajji vous accueille avec écoute, attention et une approche personnalisée.",
      "Dr. Adam Hajji welcomes you with attentive, personalized dental care.",
      "يستقبلكم الدكتور آدم حجي باهتمام ورعاية تناسب احتياجاتكم.",
    ),
    t(
      "À El Jadida, un cadre accueillant pour prendre soin de votre sourire en toute sérénité.",
      "A welcoming setting in El Jadida to care for your smile with peace of mind.",
      "أجواء مريحة في الجديدة للعناية بابتسامتكم بكل طمأنينة.",
    ),
  ];
  const nav = [
    t("Accueil", "Home", "الرئيسية"),
    t("Nos soins", "Treatments", "العلاجات"),
    t("Le cabinet", "The clinic", "العيادة"),
    t("Dr. Adam Hajji", "Dr. Adam Hajji", "د. آدم حجي"),
    t("Contact", "Contact", "اتصل بنا"),
  ];
  const hrefs = [
    `/${l}`,
    `/${l}/services`,
    `/${l}#clinic`,
    `/${l}#doctor`,
    `/${l}#contact`,
  ];
  const chosen = services.find((s) => s[0] === serviceSlug);
  return (
    <>
      <main>
        {!catalog && !chosen ? (
          <>
            <section
              className="hero"
              data-slide={slide}
              onPointerDown={(event) => {
                if (
                  event.pointerType !== "mouse" &&
                  !(event.target as HTMLElement).closest(
                    "[data-autoplay-toggle]",
                  ) &&
                  window.matchMedia("(max-width:768px)").matches
                )
                  setPaused(true);
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocusCapture={() => setFocused(true)}
              onBlurCapture={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node))
                  setFocused(false);
              }}
            >
              <div className="hero-photo">
                {["treatment", "portrait", "clinic"].map((img, i) => (
                  <Image
                    key={img}
                    src={`/images/${img}.png`}
                    alt={
                      [
                        t(
                          "Dr. Adam pendant un soin",
                          "Dr. Adam providing care",
                          "الدكتور آدم أثناء العلاج",
                        ),
                        t(
                          "Dr. Adam Hajji",
                          "Dr. Adam Hajji",
                          "الدكتور آدم حجي",
                        ),
                        t(
                          "La réception du cabinet",
                          "Clinic reception",
                          "استقبال العيادة",
                        ),
                      ][i]
                    }
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className={slide === i ? "visible" : ""}
                  />
                ))}
                <div className="hero-shade" />
              </div>
              <div className="hero-content">
                <div className="eyebrow">
                  <span />{" "}
                  {t(
                    "CABINET DENTAIRE · EL JADIDA",
                    "DENTAL CLINIC · EL JADIDA",
                    "عيادة طب الأسنان · الجديدة",
                  )}
                </div>
                <div className="hero-copy-stack">
                  {titles.map((title, index) => (
                    <div
                      key={index}
                      className="hero-copy-reserve"
                      aria-hidden="true"
                    >
                      <span className="hero-heading">{title}</span>
                      <span className="hero-description">
                        {descriptions[index]}
                      </span>
                    </div>
                  ))}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={slide}
                      className="hero-copy"
                      initial={{ opacity: 0, y: reduced ? 0 : 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                    >
                      <h1>{titles[slide]}</h1>
                      <p>{descriptions[slide]}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="hero-buttons">
                  <button className="button" onClick={() => setBooking(true)}>
                    {t(
                      "Prendre rendez-vous",
                      "Book an appointment",
                      "طلب موعد",
                    )}
                    <ArrowUpRight size={18} />
                  </button>
                  <Link className="button secondary" href={`/${l}/services`}>
                    {t(
                      "Découvrir nos soins",
                      "Explore treatments",
                      "اكتشف العلاجات",
                    )}
                    <ArrowRight size={17} />
                  </Link>
                </div>
                <div className="hero-note">
                  <ShieldCheck size={18} />
                  {t(
                    "Une écoute attentive. Des soins personnalisés.",
                    "Thoughtful listening. Personalized care.",
                    "اهتمام بتفاصيلكم. رعاية تناسبكم.",
                  )}
                </div>
              </div>
              <div className="hero-bottom">
                <div className="slide-nav">
                  <span>0{slide + 1}</span>
                  <div className="progress">
                    {[0, 1, 2].map((i) => (
                      <button
                        key={i}
                        aria-label={`${t("Diapositive", "Slide", "شريحة")} ${i + 1}`}
                        className={slide === i ? "current" : ""}
                        aria-pressed={slide === i}
                        onClick={() => setSlide(i)}
                      />
                    ))}
                  </div>
                  <span className="muted">03</span>
                  <button
                    className="icon"
                    aria-label={t("Précédent", "Previous", "السابق")}
                    onClick={() => setSlide((slide + 2) % 3)}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    className="icon"
                    aria-label={t("Suivant", "Next", "التالي")}
                    onClick={() => setSlide((slide + 1) % 3)}
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button
                    className="icon"
                    aria-label={t(
                      "Pause ou lecture",
                      "Pause or play",
                      "إيقاف أو تشغيل",
                    )}
                    data-autoplay-toggle
                    onClick={() => {
                      const next = !paused;
                      setPaused(next);
                      if (
                        !next &&
                        window.matchMedia("(max-width:768px)").matches
                      ) {
                        setFocused(false);
                        setHovered(false);
                      }
                    }}
                  >
                    {paused ? <Play size={14} /> : <Pause size={14} />}
                  </button>
                </div>
                <span className="photo-caption">
                  {t(
                    "LE SOIN, EN TOUTE CONFIANCE",
                    "CARE YOU CAN FEEL GOOD ABOUT",
                    "رعاية بكل ثقة",
                  )}
                  <span className="down-arrow">↓</span>
                </span>
              </div>
              <div className="location-pill">
                <MapPin size={15} /> El Jadida,{" "}
                {t("Maroc", "Morocco", "المغرب")}
              </div>
            </section>
            <div className="trust-strip">
              <span>
                <Heart />
                {t("Une approche humaine", "A human approach", "رعاية إنسانية")}
              </span>
              <span>
                <ScanLine />
                {t(
                  "Des soins sur mesure",
                  "Care tailored to you",
                  "عناية تناسبكم",
                )}
              </span>
              <span>
                <ShieldCheck />
                {t(
                  "Votre confort, notre priorité",
                  "Your comfort comes first",
                  "راحتكم أولويتنا",
                )}
              </span>
              <span>
                <CalendarDays />
                {t(
                  "Rendez-vous en ligne",
                  "Online appointment requests",
                  "طلب موعد عبر الإنترنت",
                )}
              </span>
            </div>
          </>
        ) : (
          <section className="page-heading">
            <div className="eyebrow">
              {t("PRENDRE SOIN DE VOUS", "CARING FOR YOU", "العناية بكم")}
            </div>
            <h1>
              {chosen
                ? name(chosen, l)
                : t(
                    "À chaque sourire, son attention.",
                    "Thoughtful care for every smile.",
                    "لكل ابتسامة عناية خاصة.",
                  )}
            </h1>
            <p>
              {t(
                "Catalogue de démonstration. Les soins proposés sont à vérifier auprès du cabinet.",
                "Demonstration catalog. Treatment availability must be verified with the clinic.",
                "كتالوج تجريبي. يجب التأكد من توفر العلاجات لدى العيادة.",
              )}
            </p>
          </section>
        )}
        {chosen ? (
          <section className="section detail">
            <Image
              src="/images/treatment.png"
              alt={name(chosen, l)}
              width={850}
              height={550}
            />
            <div>
              <div className="eyebrow">
                {t(
                  "COMPRENDRE VOTRE PARCOURS",
                  "YOUR CARE JOURNEY",
                  "رحلة العناية",
                )}
              </div>
              <h2>{name(chosen, l)}</h2>
              <p>{serviceDescription(chosen[0], l)}</p>
              <button className="button" onClick={() => setBooking(true)}>
                {t(
                  "Demander une consultation",
                  "Request a consultation",
                  "طلب استشارة",
                )}
                <ArrowUpRight size={18} />
              </button>
            </div>
          </section>
        ) : (
          <section className="section" id="services">
            <div className="section-top">
              <div>
                <div className="eyebrow">
                  {t("NOS SOINS", "OUR TREATMENTS", "علاجاتنا")}
                </div>
                <h2>
                  {t(
                    "Un sourire en bonne santé.\nUne attention sur mesure.",
                    "A healthy smile.\nCare made personal.",
                    "ابتسامة صحية.\nعناية تناسبكم.",
                  )}
                </h2>
              </div>
              <div>
                <p>
                  {t(
                    "De la prévention aux soins spécifiques, découvrez une approche centrée sur vous.",
                    "From prevention to individual treatments, discover care centered around you.",
                    "من الوقاية إلى العلاجات المتخصصة، اكتشفوا عناية تتمحور حولكم.",
                  )}
                </p>
                <Link className="text-link" href={`/${l}/services`}>
                  {t("Tous nos soins", "All treatments", "جميع العلاجات")}
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
            <div className="service-grid">
              {services.slice(0, catalog ? 12 : 6).map((s, i) => {
                const Icon = icons[i % 6];
                return (
                  <Link
                    key={s[0]}
                    href={`/${l}/services/${s[0]}`}
                    className="service-card"
                  >
                    <div className="service-card-top">
                      <span className="service-icon">
                        <Icon size={25} strokeWidth={1.3} />
                      </span>
                      <ArrowUpRight size={19} />
                    </div>
                    <h3>{name(s, l)}</h3>
                    <p>
                      {t(
                        "Une prise en charge adaptée, à discuter lors de votre consultation.",
                        "Personalized options to discuss at your consultation.",
                        "خيارات مناسبة تناقش خلال استشارتكم.",
                      )}
                    </p>
                    <span className="small-label">
                      {t("EN SAVOIR PLUS", "DISCOVER MORE", "اعرف المزيد")}
                    </span>
                  </Link>
                );
              })}
            </div>
            <p className="demo-note">
              {t(
                "Catalogue indicatif de démonstration · prestations à confirmer auprès du cabinet.",
                "Illustrative demo catalog · services to be confirmed with the clinic.",
                "كتالوج تجريبي توضيحي · يرجى التأكد من الخدمات لدى العيادة.",
              )}
            </p>
          </section>
        )}
        {!catalog && !chosen && (
          <>
            <section className="section doctor" id="doctor">
              <div className="portrait-wrap">
                <Image
                  src="/images/portrait.png"
                  alt="Dr. Adam Hajji"
                  width={760}
                  height={700}
                />
                <div className="portrait-label">
                  <strong>Dr. Adam Hajji</strong>
                  <span>
                    {t(
                      "Une rencontre, une relation de confiance.",
                      "A conversation. A connection built on trust.",
                      "لقاء يؤسس لعلاقة ثقة.",
                    )}
                  </span>
                  <ArrowUpRight />
                </div>
              </div>
              <div className="doctor-copy">
                <div className="eyebrow">
                  {t("VOTRE DENTISTE", "MEET YOUR DENTIST", "طبيبكم")}
                </div>
                <h2>
                  {t(
                    "Derrière chaque sourire,\nune relation de confiance.",
                    "Behind every smile,\na relationship of trust.",
                    "وراء كل ابتسامة،\nعلاقة من الثقة.",
                  )}
                </h2>
                <p>
                  {t(
                    "Bienvenue au cabinet du Dr. Adam Hajji. Ici, prendre soin de votre sourire commence par vous écouter.",
                    "Welcome to Dr. Adam Hajji’s clinic. Here, caring for your smile begins with listening to you.",
                    "مرحباً بكم في عيادة الدكتور آدم حجي. تبدأ العناية بابتسامتكم بالاستماع إليكم.",
                  )}
                </p>
                <p>
                  {t(
                    "Nous prenons le temps de comprendre vos attentes, de vous expliquer chaque étape et de vous accompagner dans un cadre serein.",
                    "We take time to understand your expectations, explain each step and welcome you in a calm setting.",
                    "نخصص الوقت لفهم توقعاتكم وشرح كل خطوة ومرافقتكم في أجواء هادئة.",
                  )}
                </p>
                <div className="signature">Adam Hajji</div>
                <button className="text-link" onClick={() => setBooking(true)}>
                  {t("Faisons connaissance", "Let’s meet", "لنتعرف عليكم")}
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </section>
            <section className="clinic-section" id="clinic">
              <Image
                src="/images/clinic.png"
                alt={t(
                  "Réception du cabinet",
                  "Clinic reception",
                  "استقبال العيادة",
                )}
                fill
                sizes="100vw"
              />
              <div className="clinic-panel">
                <div className="eyebrow">
                  {t("LE CABINET", "OUR CLINIC", "عيادتنا")}
                </div>
                <h2>
                  {t(
                    "Le soin commence\npar le bien-être.",
                    "Good care starts\nwith feeling at ease.",
                    "العناية تبدأ\nبالراحة.",
                  )}
                </h2>
                <p>
                  {t(
                    "Un espace lumineux, une atmosphère apaisante et une équipe à votre écoute. Découvrez notre cabinet à El Jadida.",
                    "A light-filled space, a calming atmosphere and attentive care. Discover our clinic in El Jadida.",
                    "مكان مشرق وأجواء هادئة واهتمام بكم. اكتشفوا عيادتنا في الجديدة.",
                  )}
                </p>
                <a className="text-link" href="#contact">
                  {t("Nous rendre visite", "Plan your visit", "زيارة العيادة")}
                  <ArrowUpRight size={17} />
                </a>
              </div>
            </section>
            <section className="section values">
              <div>
                <div className="eyebrow">
                  {t("NOTRE ENGAGEMENT", "OUR COMMITMENT", "التزامنا")}
                </div>
                <h2>
                  {t(
                    "Vous sentir bien,\nà chaque étape.",
                    "Feel at ease,\nat every step.",
                    "الراحة،\nفي كل خطوة.",
                  )}
                </h2>
              </div>
              {[Heart, ShieldCheck, ScanLine].map((Icon, i) => (
                <div key={i}>
                  <Icon strokeWidth={1.3} />
                  <h3>
                    {
                      [
                        t("À votre écoute", "Here to listen", "نستمع إليكم"),
                        t(
                          "En toute transparence",
                          "Clear communication",
                          "تواصل شفاف",
                        ),
                        t("À votre rythme", "At your own pace", "وفق راحتكم"),
                      ][i]
                    }
                  </h3>
                  <p>
                    {
                      [
                        t(
                          "Vos questions ont toute leur place.",
                          "There is always room for your questions.",
                          "نرحب بكل أسئلتكم.",
                        ),
                        t(
                          "Comprendre vos soins pour décider sereinement.",
                          "Understand your care and make informed choices.",
                          "افهموا خيارات العناية لاتخاذ القرار براحة.",
                        ),
                        t(
                          "Un accompagnement attentif et personnalisé.",
                          "Attentive support shaped around you.",
                          "مرافقة مدروسة ومناسبة لكم.",
                        ),
                      ][i]
                    }
                  </p>
                </div>
              ))}
            </section>
            <section className="booking-banner section" id="appointment">
              <div>
                <div className="eyebrow">
                  {t(
                    "UN PREMIER PAS TOUT SIMPLE",
                    "A SIMPLE FIRST STEP",
                    "خطوة أولى بسيطة",
                  )}
                </div>
                <h2>
                  {t(
                    "Et si on prenait soin\nde votre sourire ?",
                    "Let’s make time\nfor your smile.",
                    "لنخصص وقتاً\nلابتسامتكم.",
                  )}
                </h2>
                <p>
                  {t(
                    "Choisissez un créneau et envoyez votre demande en quelques étapes.",
                    "Choose a time and send your request in a few simple steps.",
                    "اختاروا الوقت المناسب وأرسلوا طلبكم بخطوات بسيطة.",
                  )}
                </p>
                <button className="button" onClick={() => setBooking(true)}>
                  {t(
                    "Prendre rendez-vous",
                    "Request an appointment",
                    "طلب موعد",
                  )}
                  <ArrowUpRight size={18} />
                </button>
                <p className="demo-note">
                  {t(
                    "Expérience de démonstration · aucune demande envoyée au cabinet.",
                    "Demo experience · no request is sent to the clinic.",
                    "تجربة توضيحية · لا يتم إرسال أي طلب إلى العيادة.",
                  )}
                </p>
              </div>
              <div className="appointment-preview">
                <span className="preview-icon">
                  <CalendarDays />
                </span>
                <h3>
                  {t(
                    "Votre prochain rendez-vous",
                    "Your next appointment",
                    "موعدكم القادم",
                  )}
                </h3>
                <div className="mini-week">
                  {[26, 27, 28, 29, 30].map((d, i) => (
                    <button
                      key={d}
                      onClick={() => setBooking(true)}
                      className={i === 2 ? "selected" : ""}
                    >
                      <small>
                        {t(
                          ["LUN", "MAR", "MER", "JEU", "VEN"][i],
                          ["MON", "TUE", "WED", "THU", "FRI"][i],
                          ["إث", "ثل", "أر", "خم", "جم"][i],
                        )}
                      </small>
                      {d}
                    </button>
                  ))}
                </div>
                <div className="preview-bottom">
                  <Clock size={16} />
                  {t(
                    "Choisissez votre créneau",
                    "Choose your time",
                    "اختاروا وقتكم",
                  )}
                  <Check size={17} />
                </div>
              </div>
            </section>
            <section className="section advice">
              <div className="section-top">
                <div>
                  <div className="eyebrow">
                    {t(
                      "POUR TOUTE LA FAMILLE",
                      "FOR THE WHOLE FAMILY",
                      "لكل العائلة",
                    )}
                  </div>
                  <h2>
                    {t(
                      "Les bonnes habitudes\ncommencent ensemble.",
                      "Healthy habits\nstart together.",
                      "العادات الصحية\nتبدأ معاً.",
                    )}
                  </h2>
                </div>
                <p>
                  {t(
                    "Des échanges simples pour mieux comprendre votre santé bucco-dentaire.",
                    "Simple conversations to better understand your oral health.",
                    "حوارات بسيطة لفهم صحة الفم والأسنان.",
                  )}
                </p>
              </div>
              <div className="advice-grid">
                {[
                  t(
                    "Préparer sa première visite",
                    "Preparing for your first visit",
                    "الاستعداد للزيارة الأولى",
                  ),
                  t(
                    "Poser les bonnes questions",
                    "Questions to ask your dentist",
                    "أسئلة لطبيب الأسنان",
                  ),
                  t(
                    "Accompagner les enfants",
                    "Helping children feel comfortable",
                    "مساعدة الأطفال على الشعور بالراحة",
                  ),
                ].map((title, i) => (
                  <article key={title}>
                    <span>
                      0{i + 1} / {t("CONSEIL", "GUIDE", "دليل")}
                    </span>
                    <h3>{title}</h3>
                    <p>
                      {
                        [
                          t(
                            "Notez vos questions et apportez les informations utiles à votre consultation.",
                            "Write down your questions and bring any information relevant to your consultation.",
                            "دونوا أسئلتكم وأحضروا المعلومات المفيدة للاستشارة.",
                          ),
                          t(
                            "Demandez des explications sur les options, les étapes et le suivi proposé.",
                            "Ask about your options, the treatment steps and proposed follow-up.",
                            "اسألوا عن الخيارات والخطوات والمتابعة المقترحة.",
                          ),
                          t(
                            "Présentez la visite avec des mots simples et laissez votre enfant poser ses questions.",
                            "Describe the visit in simple words and let your child ask questions.",
                            "اشرحوا الزيارة بكلمات بسيطة واتركوا لطفلكم فرصة طرح الأسئلة.",
                          ),
                        ][i]
                      }
                    </p>
                  </article>
                ))}
              </div>
              <p className="demo-note">
                {t(
                  "Les vidéos éducatives seront ajoutées après validation du cabinet.",
                  "Educational videos will be added after clinic approval.",
                  "ستضاف الفيديوهات التعليمية بعد اعتماد العيادة.",
                )}
              </p>
            </section>
          </>
        )}
        <section className="section faq">
          <div>
            <div className="eyebrow">
              {t("VOS QUESTIONS", "YOUR QUESTIONS", "أسئلتكم")}
            </div>
            <h2>
              {t(
                "Tout simplement,\non vous répond.",
                "A little clarity,\nbefore your visit.",
                "إجابات بسيطة،\nقبل زيارتكم.",
              )}
            </h2>
          </div>
          <div>
            {[
              t(
                "Comment prendre rendez-vous ?",
                "How do I request an appointment?",
                "كيف أطلب موعداً؟",
              ),
              t(
                "Ma demande est-elle confirmée immédiatement ?",
                "Is my appointment confirmed immediately?",
                "هل يتم تأكيد الموعد فوراً؟",
              ),
              t(
                "Quels soins propose le cabinet ?",
                "Which treatments are available?",
                "ما العلاجات المتوفرة؟",
              ),
              t(
                "Comment préparer ma première consultation ?",
                "How do I prepare for my first visit?",
                "كيف أستعد لاستشارتي الأولى؟",
              ),
            ].map((q, i) => (
              <details key={q}>
                <summary>
                  {q}
                  <Plus size={17} />
                </summary>
                <p>
                  {
                    [
                      t(
                        "Utilisez le parcours en ligne : soin, date, horaire et coordonnées. Cette démonstration enregistre uniquement sur votre appareil.",
                        "Choose a treatment, date and time, then enter your contact details. This demo saves only on your device.",
                        "اختاروا العلاج والتاريخ والوقت وأدخلوا بيانات التواصل. هذه التجربة تحفظ البيانات على جهازكم فقط.",
                      ),
                      t(
                        "Non. Une demande nécessite toujours une validation du cabinet. Aucun rendez-vous réel n’est créé dans cette démonstration.",
                        "No. Requests always require clinic approval. This demonstration does not create real appointments.",
                        "لا. يتطلب الطلب موافقة العيادة. هذه التجربة لا تنشئ مواعيد حقيقية.",
                      ),
                      t(
                        "Le catalogue présenté est provisoire. Les prestations doivent être confirmées auprès du cabinet.",
                        "The displayed catalog is provisional. Please confirm available services with the clinic.",
                        "الكتالوج المعروض مؤقت. يرجى التأكد من الخدمات لدى العيادة.",
                      ),
                      t(
                        "Préparez vos questions et les informations utiles à partager directement avec votre praticien.",
                        "Prepare your questions and any relevant information to share directly with your practitioner.",
                        "جهزوا أسئلتكم والمعلومات المفيدة لمشاركتها مباشرة مع الطبيب.",
                      ),
                    ][i]
                  }
                </p>
              </details>
            ))}
          </div>
        </section>
        <section className="contact section" id="contact">
          <div>
            <div className="eyebrow">
              {t(
                "AU PLAISIR DE VOUS ACCUEILLIR",
                "WE LOOK FORWARD TO WELCOMING YOU",
                "يسعدنا استقبالكم",
              )}
            </div>
            <h2>
              {t(
                "Votre sourire a rendez-vous\nà El Jadida.",
                "Your smile has a home\nin El Jadida.",
                "مكان للعناية بابتسامتكم\nفي الجديدة.",
              )}
            </h2>
            <p>
              <MapPin size={18} />
              El Jadida, {t("Maroc", "Morocco", "المغرب")}
            </p>
            <p className="demo-note">
              {t(
                "Adresse, horaires et coordonnées à valider avant publication.",
                "Address, opening hours and contact details require verification before launch.",
                "يجب التحقق من العنوان والأوقات وبيانات الاتصال قبل الإطلاق.",
              )}
            </p>
            <button className="button" onClick={() => setBooking(true)}>
              {t("Demander un rendez-vous", "Request a visit", "طلب موعد")}
              <ArrowUpRight size={17} />
            </button>
          </div>
          <Image
            src="/images/clinic.png"
            width={700}
            height={400}
            alt={t(
              "Le cabinet à El Jadida",
              "The clinic in El Jadida",
              "العيادة في الجديدة",
            )}
          />
        </section>
      </main>
      <footer>
        <div className="footer-top">
          <Link href={`/${l}`} className="footer-logo">
            <Logo />
          </Link>
          <p>
            {t(
              "Une attention sincère.\nUn sourire qui vous ressemble.",
              "Thoughtful attention.\nA smile that feels like you.",
              "اهتمام صادق.\nابتسامة تشبهكم.",
            )}
          </p>
          <div>
            {nav.map((n, i) => (
              <Link key={n} href={hrefs[i]}>
                {n}
              </Link>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Dr. Adam Hajji ·{" "}
            {t("Démonstration", "Demonstration", "نسخة تجريبية")}
          </span>
          <Link href="/admin">
            {t(
              "Espace praticien · démo",
              "Practitioner area · demo",
              "مساحة الطبيب · تجريبية",
            )}
            <ArrowUpRight size={13} />
          </Link>
          <span>
            {t(
              "Aucune donnée transmise au cabinet",
              "No data sent to the clinic",
              "لا ترسل البيانات إلى العيادة",
            )}
          </span>
        </div>
      </footer>
      {booking && (
        <Booking
          locale={l}
          initialService={chosen?.[0]}
          onClose={() => setBooking(false)}
        />
      )}
    </>
  );
}
