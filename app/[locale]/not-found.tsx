import { getLocale, getTranslations } from "next-intl/server";
import { waLink } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

// Localized 404 inside [locale]: home + WhatsApp links, brand styling.
export default async function NotFound() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: "notfound" });
  const tHero = await getTranslations({ locale, namespace: "hero" });
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-28 text-center sm:px-6">
        <p className="text-7xl font-extrabold tracking-tight text-navy-950">404</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink">
          {t("title")}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted">{t("body")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={`/${locale}`}
            className="rounded-full bg-navy-950 px-7 py-3 font-bold text-white transition-colors hover:bg-navy-800"
          >
            {t("home")}
          </a>
          <a
            href={waLink(tHero("waText"))}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gold px-7 py-3 font-bold text-navy-950 hover:brightness-105"
          >
            {t("contact")}
          </a>
        </div>
      </div>
    </div>
  );
}

// Note: 404 responses are never indexed, so no robots meta is needed here.
