import Clinic from "@/components/Clinic";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <Clinic locale={locale} />;
}
