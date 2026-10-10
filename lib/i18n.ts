import { defineRouting } from "next-intl/routing";

export const locales = ["id", "en", "ja", "zh"] as const;
export type Locale = (typeof locales)[number];
// Global default is English; id/ja/zh are served by geo/browser detection
// (middleware "/") or explicit user choice (NEXT_LOCALE cookie).
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  id: "Indonesia",
  en: "English",
  ja: "日本語",
  zh: "中文",
};

// Country → locale mapping for geo-based default (x-vercel-ip-country).
const countryToLocale: Record<string, Locale> = {
  ID: "id",
  MY: "id",
  JP: "ja",
  CN: "zh",
  TW: "zh",
  HK: "zh",
  SG: "zh",
};

const englishCountries = new Set([
  "US", "GB", "AU", "CA", "NZ", "IE", "PH", "IN", "AE", "SA", "DE",
  "NL", "FR", "ES", "IT", "BR", "KR", "TH", "VN", "MY",
]);

export function localeFromCountry(country: string | null): Locale | null {
  if (!country) return null;
  const c = country.toUpperCase();
  const direct = countryToLocale[c];
  if (direct) return direct;
  if (englishCountries.has(c)) return "en";
  return null;
}

export function localeFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  // Full q-weighted parse: "fr-FR,fr;q=0.9,en;q=0.8" must resolve to "en",
  // not give up on the unsupported first tag.
  const ranges = header
    .split(",")
    .map((part) => {
      const [range = "", ...params] = part.trim().split(";");
      let q = 1;
      for (const p of params) {
        const m = p.trim().match(/^q=([0-9.]+)$/);
        if (m) q = Number(m[1]);
      }
      return { range: range.trim().toLowerCase(), q };
    })
    .filter((r) => r.range && r.range !== "*" && r.q > 0)
    .sort((a, b) => b.q - a.q);
  const pick = (tag: string): Locale | null => {
    if (tag.startsWith("ja")) return "ja";
    if (tag.startsWith("zh")) return "zh";
    if (tag.startsWith("id") || tag.startsWith("ms")) return "id";
    if (tag.startsWith("en")) return "en";
    return null;
  };
  for (const r of ranges) {
    const hit = pick(r.range);
    if (hit) return hit;
  }
  return null;
}

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always",
});
