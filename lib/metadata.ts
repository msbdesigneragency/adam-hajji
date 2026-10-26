import type { Metadata } from "next";
export function localizedMetadata(
  locale: string,
  path: string,
  title: string,
  description: string,
): Metadata {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    title,
    description,
    ...(base
      ? {
          alternates: {
            canonical: `${base}/${locale}${path}`,
            languages: {
              fr: `${base}/fr${path}`,
              en: `${base}/en${path}`,
              ar: `${base}/ar${path}`,
            },
          },
        }
      : {}),
  };
}
