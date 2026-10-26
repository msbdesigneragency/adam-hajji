import { localizedMetadata } from "@/lib/metadata";
import { pick } from "@/lib/data";
import Clinic from "@/components/Clinic";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <Clinic locale={locale} catalog />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return localizedMetadata(
    locale,
    "/services",
    pick(
      locale,
      "Nos soins | Dr. Adam Hajji",
      "Treatments | Dr. Adam Hajji",
      "العلاجات | د. آدم حجي",
    ),
    pick(
      locale,
      "Catalogue de démonstration des soins dentaires. Prestations à confirmer auprès du cabinet.",
      "Demonstration dental treatment catalog. Offerings require verification with the clinic.",
      "كتالوج تجريبي للعلاجات. يرجى التحقق من الخدمات لدى العيادة.",
    ),
  );
}
