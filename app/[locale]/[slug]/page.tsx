import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/i18n";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import About, { type AboutDict } from "@/components/sections/About";
import Pricing, { type PricingDict } from "@/components/sections/Pricing";
import Portfolio, { type PortfolioDict } from "@/components/sections/Portfolio";
import Products, { type ProductsDict } from "@/components/sections/Products";
import Faq, { type FaqDict } from "@/components/sections/Faq";
import Cta, { type CtaDict } from "@/components/sections/Cta";
import type { HeroDict } from "@/components/sections/Hero";

export const SLUGS = ["tentang", "harga", "portofolio", "produk", "faq"] as const;
export type Slug = (typeof SLUGS)[number];

// nav key + messages namespace per slug (titles/descriptions reuse existing copy).
const SLUG_CONF: Record<Slug, { navKey: string; ns: string }> = {
  tentang: { navKey: "about", ns: "about" },
  harga: { navKey: "pricing", ns: "pricing" },
  portofolio: { navKey: "portfolio", ns: "portfolio" },
  produk: { navKey: "products", ns: "products" },
  faq: { navKey: "faq", ns: "faq" },
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SLUGS.map((slug) => ({ locale, slug })),
  );
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale) || !(slug in SLUG_CONF)) return {};
  const conf = SLUG_CONF[slug as Slug];
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  // Description: section intro/body if available, else site description.
  let description: string = tMeta("description");
  try {
    const all = (await getMessages()) as unknown as Record<string, Record<string, unknown>>;
    const ns = all[conf.ns] as Record<string, unknown> | undefined;
    const candidate = ns?.intro ?? ns?.body1;
    if (typeof candidate === "string" && candidate.length > 0) description = candidate;
  } catch {
    /* keep site description */
  }
  const url = `${SITE_URL}/${locale}/${slug}`;
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}/${slug}`;
  return {
    title: `${tNav(conf.navKey)} | ${SITE_NAME}`,
    description,
    alternates: { canonical: url, languages: { ...languages, "x-default": `${SITE_URL}/id/${slug}` } },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: `${tNav(conf.navKey)} | ${SITE_NAME}`,
      description,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: { card: "summary_large_image", title: `${tNav(conf.navKey)} | ${SITE_NAME}`, description },
  };
}

type Messages = {
  hero: HeroDict;
  about: AboutDict;
  why: { eyebrow: string; body: string };
  pricing: PricingDict;
  portfolio: PortfolioDict;
  products: ProductsDict;
  faq: FaqDict;
  cta: CtaDict;
};

export default async function SlugPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale) || !(slug in SLUG_CONF)) notFound();
  setRequestLocale(locale as Locale);
  const m = (await getMessages()) as unknown as Messages;
  const url = `${SITE_URL}/${locale}/${slug}`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: slug, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {slug === "tentang" && <About dict={m.about} why={m.why} />}
      {slug === "harga" && <Pricing dict={m.pricing} />}
      {slug === "portofolio" && <Portfolio dict={m.portfolio} />}
      {slug === "produk" && <Products dict={m.products} />}
      {slug === "faq" && <Faq dict={m.faq} />}
      <Cta dict={m.cta} waText={m.hero.waText} />
    </>
  );
}
