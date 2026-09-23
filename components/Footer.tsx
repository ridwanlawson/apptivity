import LogoMark from "./LogoMark";
import { SITE_NAME, COMPANY, IG_URL, waLink } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

export default function Footer({
  locale,
  tagline,
  rights,
  waText,
}: {
  locale: Locale;
  tagline: string;
  rights: string;
  waText: string;
}) {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <LogoMark className="h-9 w-9" />
            <p className="text-lg font-extrabold">{SITE_NAME}</p>
          </div>
          <p className="mt-2 text-sm text-sky-hi">{tagline}</p>
          <p className="mt-1 text-sm text-white/60">{COMPANY}</p>
        </div>
        <nav aria-label="Footer" className="text-sm">
          <p className="font-bold text-gold">Apptivity.id</p>
          <ul className="mt-2 space-y-2 text-white/75">
            <li>
              <a href={`/${locale}#tentang`} className="hover:text-gold">
                Tentang
              </a>
            </li>
            <li>
              <a href={`/${locale}#skema`} className="hover:text-gold">
                Skema Bisnis
              </a>
            </li>
            <li>
              <a href={`/${locale}#kepemilikan`} className="hover:text-gold">
                Kepemilikan
              </a>
            </li>
            <li>
              <a href={`/${locale}#mekanisme`} className="hover:text-gold">
                Mekanisme
              </a>
            </li>
          </ul>
        </nav>
        <div className="text-sm">
          <p className="font-bold text-gold">Kontak</p>
          <ul className="mt-2 space-y-2 text-white/75">
            <li>
              <a
                href={waLink(waText)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold"
              >
                WhatsApp: 0812-7038-9862
              </a>
            </li>
            <li>
              <a
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold"
              >
                Instagram: @apptivity.id
              </a>
            </li>
            <li>
              <a href="https://apptivity.id" className="hover:text-gold">
                apptivity.id
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-white/50 sm:px-6">
          {rights}
        </p>
      </div>
    </footer>
  );
}
