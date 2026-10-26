"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { pick, services } from "@/lib/data";
import Booking from "./Booking";
export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setLeaving(false);
    setMenu(false);
    if (timer.current) clearTimeout(timer.current);
  }, [pathname]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const navigate = (e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest("a");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target)
      return;
    const url = new URL(a.href);
    if (url.origin !== location.origin || url.pathname === pathname || url.hash)
      return;
    e.preventDefault();
    if (timer.current) clearTimeout(timer.current);
    setLeaving(true);
    timer.current = setTimeout(
      () => router.push(url.pathname + url.search),
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 120,
    );
  };
  const l = pathname.split("/")[1] || "fr";
  const catalog = pathname.endsWith("/services");
  const chosen = services.find((s) => pathname.endsWith("/services/" + s[0]));
  const t = (a: string, b: string, c: string) => pick(l, a, b, c);
  const [menu, setMenu] = useState(false),
    [booking, setBooking] = useState(false);
  const mobileMenu = useRef<HTMLDivElement>(null);
  const mobileToggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menu) return;
    const previousOverflow = document.body.style.overflow;
    const mobile = window.matchMedia("(max-width:900px)");
    if (!mobile.matches) {
      setMenu(false);
      return;
    }
    document.body.style.overflow = "hidden";
    mobileMenu.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const close = () => setMenu(false);
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        mobileToggle.current?.focus();
      }
      if (event.key === "Tab") {
        const links =
          mobileMenu.current?.querySelectorAll<HTMLAnchorElement>("a");
        if (!links?.length) return;
        const first = links[0],
          last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          mobileToggle.current?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          mobileToggle.current?.focus();
        } else if (document.activeElement === mobileToggle.current) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    mobile.addEventListener("change", close);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", key);
      mobile.removeEventListener("change", close);
    };
  }, [menu]);
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
  if (pathname.startsWith("/admin")) return <>{children}</>;
  return (
    <div onClickCapture={navigate}>
      <header className="nav-shell">
        <nav className="glass">
          <Link href={`/${l}`} className="brand">
            <Logo priority />
          </Link>
          <div className="desktop-links">
            {nav.map((n, i) => (
              <Link
                className={i === 0 && !catalog && !chosen ? "active" : ""}
                key={n}
                href={hrefs[i]}
              >
                {n}
              </Link>
            ))}
          </div>
          <div className="nav-actions">
            <div className="languages">
              {["fr", "en", "ar"].map((lang) => (
                <Link
                  key={lang}
                  className={l === lang ? "selected" : ""}
                  href={`/${lang}${chosen ? "/services/" + chosen[0] : catalog ? "/services" : ""}`}
                >
                  {lang.toUpperCase()}
                </Link>
              ))}
            </div>
            <button
              className="button nav-book"
              onClick={() => {
                setMenu(false);
                setBooking(true);
              }}
            >
              {t("Prendre rendez-vous", "Book a visit", "حجز موعد")}
              <ArrowUpRight size={15} />
            </button>
            <button
              className="icon mobile-toggle"
              ref={mobileToggle}
              aria-label={t("Menu", "Menu", "القائمة")}
              aria-expanded={menu}
              aria-controls="mobile-navigation"
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </nav>
        {menu && (
          <button
            className="mobile-menu-backdrop"
            aria-label={t("Fermer le menu", "Close menu", "إغلاق القائمة")}
            tabIndex={-1}
            onClick={() => setMenu(false)}
          />
        )}
        <AnimatePresence>
          {menu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mobile-menu"
              id="mobile-navigation"
              ref={mobileMenu}
            >
              {nav.map((n, i) => (
                <Link key={n} onClick={() => setMenu(false)} href={hrefs[i]}>
                  {n}
                </Link>
              ))}
              <div className="languages">
                {["fr", "en", "ar"].map((lang) => (
                  <Link
                    key={lang}
                    className={l === lang ? "selected" : ""}
                    onClick={() => setMenu(false)}
                    href={`/${lang}${chosen ? "/services/" + chosen[0] : catalog ? "/services" : ""}`}
                  >
                    {lang.toUpperCase()}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <div className="route-content" data-leaving={leaving}>
        {children}
      </div>
      {booking && <Booking locale={l} onClose={() => setBooking(false)} />}
    </div>
  );
}
