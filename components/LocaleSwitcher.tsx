"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { routing, localeNames, type Locale } from "@/lib/i18n";

// Preserves the current path while switching locale.
export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const rest = pathname.replace(/^\/(id|en|ja|zh)(?=\/|$)/, "") || "/";

  return (
    <label className="relative inline-flex items-center gap-1 text-sm font-semibold">
      <span className="sr-only">Language / Bahasa</span>
      <span aria-hidden="true" className="text-white/60">
        🌐
      </span>
      <select
        value={locale}
        onChange={(e) => {
          const next = e.target.value;
          document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000`;
          router.replace(`/${next}${rest}`);
        }}
        className="cursor-pointer appearance-none bg-transparent py-1 pl-1 pr-5 text-white hover:text-gold"
        aria-label="Language / Bahasa"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} className="text-ink">
            {localeNames[l as Locale]}
          </option>
        ))}
      </select>
    </label>
  );
}

export function LocaleLinks({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(id|en|ja|zh)(?=\/|$)/, "") || "/";
  return (
    <div className="flex items-center gap-1 text-sm font-semibold">
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          aria-current={l === locale ? "true" : undefined}
          className={`rounded-full px-2 py-1 ${
            l === locale ? "bg-gold text-navy-950" : "text-white/70 hover:text-gold"
          }`}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
