import type { MetadataRoute } from "next";
import { services } from "@/lib/data";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return [];
  return ["fr", "en", "ar"].flatMap((l) =>
    ["", "/services", ...services.map((s) => "/services/" + s[0])].map(
      (path) => ({
        url: `${base}/${l}${path}`,
        alternates: {
          languages: {
            fr: `${base}/fr${path}`,
            en: `${base}/en${path}`,
            ar: `${base}/ar${path}`,
          },
        },
      }),
    ),
  );
}
