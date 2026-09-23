import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Plus_Jakarta_Sans, Noto_Sans_JP, Noto_Sans_SC } from "next/font/google";
import "../globals.css";
import { routing, type Locale } from "@/lib/i18n";
import { IG_URL, SITE_URL, SITE_NAME, TAGLINE, COMPANY } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import LenisProvider from "@/components/LenisProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const notoJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-jp",
  display: "swap",
});

const notoSc = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sc",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: { ...languages, "x-default": `${SITE_URL}/id` },
    },
    openGraph: {
      type: "website",
      locale,
      url: `${SITE_URL}/${locale}`,
      siteName: SITE_NAME,
      title: t("title"),
      description: t("description"),
      images: [{ url: "/og.svg", width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    robots: { index: true, follow: true },
    icons: { icon: "/logo.png", apple: "/logo.png" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const loc = locale as Locale;
  setRequestLocale(loc);

  const tNav = await getTranslations({ locale: loc, namespace: "nav" });
  const tHero = await getTranslations({ locale: loc, namespace: "hero" });
  const tFooter = await getTranslations({ locale: loc, namespace: "footer" });

  const fontVars = [
    jakarta.variable,
    loc === "ja" ? notoJp.variable : "",
    loc === "zh" ? notoSc.variable : "",
  ]
    .filter(Boolean)
    .join(" ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY,
    alternateName: SITE_NAME,
    slogan: TAGLINE,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [IG_URL],
    areaServed: "ID",
  };

  return (
    <html lang={loc} className={`h-full ${fontVars} antialiased`}>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LenisProvider>
          <Preloader />
          <Header
            locale={loc}
            nav={{
              about: tNav("about"),
              scheme: tNav("scheme"),
              ownership: tNav("ownership"),
              mechanism: tNav("mechanism"),
              legal: tNav("legal"),
              brief: tNav("brief"),
              contact: tNav("contact"),
            }}
            waText={tHero("waText")}
          />
          <main id="konten" className="flex-1">
            {children}
          </main>
          <Footer
            locale={loc}
            tagline={tFooter("tagline")}
            rights={tFooter("rights")}
            waText={tHero("waText")}
          />
        </LenisProvider>
      </body>
    </html>
  );
}
