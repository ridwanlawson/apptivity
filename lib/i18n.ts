import { defineRouting } from "next-intl/routing";

export const locales = ["id", "en", "ja", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

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
  const first = header.split(",")[0]?.trim().toLowerCase() ?? "";
  if (first.startsWith("ja")) return "ja";
  if (first.startsWith("zh")) return "zh";
  if (first.startsWith("id") || first.startsWith("ms")) return "id";
  if (first.startsWith("en")) return "en";
  return null;
}

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always",
});
