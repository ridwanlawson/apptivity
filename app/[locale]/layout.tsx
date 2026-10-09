import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { routing, type Locale } from "@/lib/i18n";
import { IG_URL, SITE_URL, SITE_NAME, SITE_DOMAIN, TAGLINE, COMPANY } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import LenisProvider from "@/components/LenisProvider";
import RevealObserver from "@/components/RevealObserver";
import TrackClicks from "@/components/TrackClicks";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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

const OG_LOCALE: Record<string, string> = {
  id: "id_ID",
  en: "en_US",
  ja: "ja_JP",
  zh: "zh_CN",
};

const KEYWORDS: Record<string, string[]> = {
  id: [
    "jasa pembuatan aplikasi",
    "jasa pembuatan aplikasi web",
    "jasa pembuatan aplikasi mobile",
    "software house indonesia",
    "jasa pembuatan website",
    "aplikasi kasir",
    "aplikasi untuk umkm",
  ],
  en: [
    "app development services",
    "web app development",
    "mobile app development",
    "software house indonesia",
  ],
  ja: [
    "アプリ開発",
    "Webアプリ開発",
    "モバイルアプリ開発",
    "インドネシアソフトウェアハウス",
  ],
  zh: ["应用开发", "Web应用开发", "移动应用开发", "印度尼西亚软件公司"],
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
  // Search-console verification tokens come from env (never committed).
  // Set GOOGLE_SITE_VERIFICATION / BING_SITE_VERIFICATION in Vercel.
  const verification: Record<string, string> = {};
  if (process.env.GOOGLE_SITE_VERIFICATION) {
    verification.google = process.env.GOOGLE_SITE_VERIFICATION;
  }
  if (process.env.BING_SITE_VERIFICATION) {
    verification.bing = process.env.BING_SITE_VERIFICATION;
  }
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    keywords: KEYWORDS[locale] ?? KEYWORDS.id,
    authors: [{ name: COMPANY, url: SITE_URL }],
    creator: COMPANY,
    publisher: COMPANY,
    manifest: "/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: { ...languages, "x-default": `${SITE_URL}/id` },
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale] ?? locale,
      url: `${SITE_URL}/${locale}`,
      siteName: SITE_NAME,
      title: t("title"),
      description: t("description"),
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og.jpg"],
    },
    robots: isPreview ? { index: false, follow: false } : { index: true, follow: true },
    ...(Object.keys(verification).length > 0 ? { verification } : {}),
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
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${SITE_URL}/#organisasi`,
        name: COMPANY,
        alternateName: SITE_NAME,
        slogan: TAGLINE,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        image: `${SITE_URL}/og.jpg`,
        sameAs: [IG_URL],
        telephone: "+62-812-7038-9862",
        priceRange: "Rp500000+",
        areaServed: { "@type": "Country", name: "ID" },
        knowsAbout: [
          "Web application development",
          "Mobile application development",
          "School management software",
          "Campus management software",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+62-812-7038-9862",
          contactType: "customer service",
          availableLanguage: ["id", "en"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#situs`,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: SITE_DOMAIN,
        inLanguage: [...routing.locales],
        publisher: { "@id": `${SITE_URL}/#organisasi` },
      },
      {
        "@type": "SiteNavigationElement",
        "@id": `${SITE_URL}/#navigasi`,
        name: SITE_NAME,
        url: SITE_URL,
        hasPart: [
          "tentang",
          "harga",
          "portofolio",
          "produk",
          "faq",
        ].map((slug) => ({
          "@type": "WebPage",
          name: slug,
          url: `${SITE_URL}/${loc}/${slug}`,
        })),
      },
    ],
  };

  return (
    // suppressHydrationWarning: the preload gate (root layout) sets
    // data-preload-hidden on <html> before hydration (returning visitors).
    <html
      lang={loc}
      className={`h-full ${fontVars} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LenisProvider>
          <Cursor />
          <RevealObserver />
          <TrackClicks locale={loc} />
          <Preloader />
          <Header
            locale={loc}
            nav={{
              about: tNav("about"),
              how: tNav("how"),
              scheme: tNav("scheme"),
              ownership: tNav("ownership"),
              mechanism: tNav("mechanism"),
              pricing: tNav("pricing"),
              portfolio: tNav("portfolio"),
              products: tNav("products"),
              company: tNav("company"),
              proof: tNav("proof"),
              join: tNav("join"),
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
            privacy={tFooter("privacy")}
            terms={tFooter("terms")}
            waText={tHero("waText")}
          />
          <Analytics />
          <SpeedInsights />
        </LenisProvider>
      </body>
    </html>
  );
}
