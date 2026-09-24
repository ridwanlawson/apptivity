import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { routing } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

// Host-aware: URLs follow the domain being accessed (vercel.app vs apptivity.id),
// because a sitemap may only list URLs on its own host.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host =
    (await headers()).get("x-forwarded-host") ??
    new URL(SITE_URL).host;
  const base = `https://${host}`;
  const now = new Date();
  return routing.locales.map((locale) => ({
    url: `${base}/${locale}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: locale === "id" ? 1 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${base}/${l}`]),
      ),
    },
  }));
}
