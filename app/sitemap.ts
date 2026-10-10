import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { routing } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { ALL_SLUGS, BLOG_POSTS } from "@/lib/slugs";

// Host-aware: URLs follow the domain being accessed (vercel.app vs apptivity.id),
// because a sitemap may only list URLs on its own host.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host =
    (await headers()).get("x-forwarded-host") ??
    new URL(SITE_URL).host;
  const base = `https://${host}`;
  const now = new Date();
  const withLangs = (paths: (l: string) => string) => ({
    languages: Object.fromEntries(routing.locales.map((l) => [l, paths(l)])),
  });
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    entries.push({
      url: `${base}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: locale === "en" ? 1 : 0.8,
      alternates: withLangs((l) => `${base}/${l}`),
    });
    for (const slug of ALL_SLUGS) {
      entries.push({
        url: `${base}/${locale}/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: withLangs((l) => `${base}/${l}/${slug}`),
      });
    }
    entries.push({
      url: `${base}/${locale}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
      alternates: withLangs((l) => `${base}/${l}/blog`),
    });
    for (const post of BLOG_POSTS) {
      entries.push({
        url: `${base}/${locale}/blog/${post}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: withLangs((l) => `${base}/${l}/blog/${post}`),
      });
    }
  }
  return entries;
}
