import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { routing, type Locale } from "@/lib/i18n";
import { IG_URL, SITE_URL, SITE_NAME, TAGLINE, COMPANY } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import LenisProvider from "@/components/LenisProvider";

// CJK locales use system fonts (Hiragino/Yu Gothic/PingFang/YaHei via
// --font-sans): Noto webfonts cost ~560KB render-blocking CSS + MBs of woff2
// on every locale, while OS CJK rendering is excellent.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#061029",
};

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
  // Preview deployments (vercel.app) must never compete with production:
  // noindex keeps canonical → apptivity.id valid and self-consistent.
  const isPreview =
    process.env.VERCEL_ENV !== undefined &&
    process.env.VERCEL_ENV !== "production";
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
      images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og.png"],
    },
    robots: isPreview ? { index: false, follow: false } : { index: true, follow: true },
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

  const fontVars = jakarta.variable;

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
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+62-812-7038-9862",
      contactType: "customer service",
      availableLanguage: ["id", "en"],
    },
  };

  return (
    // suppressHydrationWarning: the inline <head> script sets
    // data-preload-hidden on <html> before hydration (returning visitors).
    <html
      lang={loc}
      className={`h-full ${fontVars} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('apptivity:seen')==='1')" +
              "document.documentElement.setAttribute('data-preload-hidden','')}catch(e){}",
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LenisProvider>
          <Cursor />
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
              faq: tNav("faq"),
              contact: tNav("contact"),
              skip: tNav("skip"),
            }}
            waText={tHero("waText")}
          />
          <main id="konten" className="flex-1">
            {children}
          </main>
          <Footer
            locale={loc}
            tagline={tFooter("tagline")}
            contactTitle={tFooter("contactTitle")}
            links={tFooter.raw("links") as unknown as string[]}
            rights={tFooter("rights")}
            waText={tHero("waText")}
          />
        </LenisProvider>
      </body>
    </html>
  );
}
