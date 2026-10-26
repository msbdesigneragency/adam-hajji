import { headers } from "next/headers";
import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "./globals.css";
import SiteShell from "@/components/SiteShell";
export const metadata: Metadata = {
  title: "Dr. Adam Hajji | Adam Dental Center",
  description:
    "Cabinet dentaire du Dr. Adam Hajji à El Jadida. Découvrez le cabinet et notre expérience de rendez-vous en ligne.",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (await headers()).get("x-clinic-locale") || "fr";
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
