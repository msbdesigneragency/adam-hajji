"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { pick } from "@/lib/data";
export default function NotFound() {
  const l = usePathname().split("/")[1] || "fr";
  return (
    <main className="page-heading" style={{ minHeight: "80vh" }}>
      <div className="eyebrow">404</div>
      <h1>
        {pick(
          l,
          "Cette page reste à découvrir.",
          "This page could not be found.",
          "لم يتم العثور على هذه الصفحة.",
        )}
      </h1>
      <p>
        {pick(
          l,
          "Retrouvez le cabinet et nos soins depuis l’accueil.",
          "Discover the clinic and treatments from the home page.",
          "اكتشفوا العيادة والعلاجات من الصفحة الرئيسية.",
        )}
      </p>
      <Link
        className="button"
        style={{ marginTop: 30 }}
        href={`/${["fr", "en", "ar"].includes(l) ? l : "fr"}`}
      >
        {pick(l, "Retour à l’accueil", "Back to home", "العودة للرئيسية")}
      </Link>
    </main>
  );
}
