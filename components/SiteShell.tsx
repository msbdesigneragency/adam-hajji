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
              onClick={() => setBooking(true)}
            >
              {t("Prendre rendez-vous", "Book a visit", "حجز موعد")}
              <ArrowUpRight size={15} />
            </button>
            <button
              className="icon mobile-toggle"
              aria-label={t("Menu", "Menu", "القائمة")}
              aria-expanded={menu}
              aria-controls="mobile-navigation"
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </nav>
        <AnimatePresence>
          {menu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mobile-menu"
              id="mobile-navigation"
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
