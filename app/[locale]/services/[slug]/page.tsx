import { localizedMetadata } from "@/lib/metadata";
import { serviceDescription } from "@/lib/serviceContent";
import { notFound } from "next/navigation";
import { services, name } from "@/lib/data";
import Clinic from "@/components/Clinic";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!services.some((s) => s[0] === slug)) notFound();
  return <Clinic locale={locale} serviceSlug={slug} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const service = services.find((s) => s[0] === slug);
  if (!service) return {};
  return localizedMetadata(
    locale,
    "/services/" + slug,
    name(service, locale) + " | Dr. Adam Hajji",
    serviceDescription(slug, locale),
  );
}
