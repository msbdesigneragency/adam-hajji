"use client";
import { usePathname } from "next/navigation";
import { pick } from "@/lib/data";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  const l = usePathname().split("/")[1];
  return (
    <main className="page-heading" style={{ minHeight: "80vh" }}>
      <div className="eyebrow">Dr. ADAM</div>
      <h1>
        {pick(
          l,
          "Un instant, s’il vous plaît.",
          "Please try again.",
          "يرجى المحاولة مرة أخرى.",
        )}
      </h1>
      <p>
        {pick(
          l,
          "La page n’a pas pu être chargée. Vos demandes enregistrées restent sur cet appareil.",
          "The page could not load. Your saved requests remain on this device.",
          "تعذر تحميل الصفحة. تبقى الطلبات المحفوظة على هذا الجهاز.",
        )}
      </p>
      <button className="button" style={{ marginTop: 30 }} onClick={reset}>
        {pick(l, "Réessayer", "Try again", "إعادة المحاولة")}
      </button>
    </main>
  );
}
