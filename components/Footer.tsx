import LogoMark from "./LogoMark";
import { SITE_DOMAIN, SITE_URL, COMPANY, EMAIL, IG_URL, waLink } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

export default function Footer({
  locale,
  tagline,
  contactTitle,
  links,
  rights,
  privacy,
  terms,
  waText,
}: {
  locale: Locale;
  tagline: string;
  contactTitle: string;
  links: string[];
  rights: string;
  privacy: string;
  terms: string;
  waText: string;
}) {
  // Footer links point to dedicated crawlable pages (sitelinks candidates),
  // not same-page anchors.
  const hrefs = ["tentang", "harga", "portofolio", "produk", "bukti", "gabung", "faq"];
  const pageSlugs = new Set(["tentang", "harga", "portofolio", "produk", "faq"]);
  const pageHref = (slug: string) =>
    pageSlugs.has(slug) ? `/${locale}/${slug}` : `/${locale}#${slug}`;
  return (
    <footer className="bg-navy-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <LogoMark className="h-9 w-9" />
            <p className="text-lg font-extrabold">{SITE_DOMAIN}</p>
          </div>
          <p className="mt-2 text-sm text-sky-hi">{tagline}</p>
          <p className="mt-1 text-sm text-white/60">{COMPANY}</p>
        </div>
        <nav aria-label="Footer" className="text-sm">
          <p className="font-bold text-gold">Apptivity.id</p>
          <ul className="mt-2 space-y-2 text-white/75">
            {links.slice(0, 7).map((label, i) => (
              <li key={label}>
                <a
                  href={pageHref(hrefs[i] ?? "")}
                  className="hover:text-gold"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="text-sm">
          <p className="font-bold text-gold">{contactTitle}</p>
          <ul className="mt-2 space-y-2 text-white/75">
            <li>
              <a
                href={waLink(waText)}
                target="_blank"
                rel="noopener noreferrer"
                data-track="footer-wa"
                className="hover:text-gold"
              >
                WhatsApp: 0812-7038-9862
              </a>
            </li>
            <li>
              <a
                href={`mailto:${EMAIL}`}
                className="hover:text-gold"
              >
                Email: {EMAIL}
              </a>
            </li>
            <li>
              <a
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-track="footer-ig"
                className="hover:text-gold"
              >
                Instagram: @apptivity.id
              </a>
            </li>
            <li>
                <a href={SITE_URL} className="hover:text-gold">
                apptivity.id
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{rights}</p>
          <nav aria-label="Legal" className="flex gap-4">
            <a href={`/${locale}/privasi`} className="hover:text-gold">
              {privacy}
            </a>
            <a href={`/${locale}/syarat-ketentuan`} className="hover:text-gold">
              {terms}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
