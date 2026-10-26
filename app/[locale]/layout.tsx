import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { pick } from "@/lib/data";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    ...(process.env.NEXT_PUBLIC_SITE_URL
      ? {
          alternates: {
            canonical: process.env.NEXT_PUBLIC_SITE_URL + "/" + locale,
            languages: {
              fr: process.env.NEXT_PUBLIC_SITE_URL + "/fr",
              en: process.env.NEXT_PUBLIC_SITE_URL + "/en",
              ar: process.env.NEXT_PUBLIC_SITE_URL + "/ar",
            },
          },
        }
      : {}),
    title: pick(
      locale,
      "Dr. Adam Hajji · Cabinet dentaire à El Jadida",
      "Dr. Adam Hajji · Dental clinic in El Jadida",
      "د. آدم حجي · عيادة طب الأسنان في الجديدة",
    ),
    description: pick(
      locale,
      "Découvrez le cabinet du Dr. Adam Hajji à El Jadida. Démonstration de prise de rendez-vous.",
      "Discover Dr. Adam Hajji’s clinic in El Jadida. Appointment booking demonstration.",
      "اكتشفوا عيادة الدكتور آدم حجي في الجديدة. تجربة حجز المواعيد.",
    ),
  };
}
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!["fr", "en", "ar"].includes(locale)) notFound();
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={{}}
      timeZone="Africa/Casablanca"
    >
      <div dir={locale === "ar" ? "rtl" : "ltr"} lang={locale}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Dentist",
              name: "Adam Dental Center — Dr. Adam Hajji",
              address: {
                "@type": "PostalAddress",
                addressLocality: "El Jadida",
                addressCountry: "MA",
              },
              ...(process.env.NEXT_PUBLIC_SITE_URL
                ? { url: process.env.NEXT_PUBLIC_SITE_URL + "/" + locale }
                : {}),
            }),
          }}
        />
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
