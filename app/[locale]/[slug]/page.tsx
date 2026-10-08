import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { routing } from "@/lib/i18n";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import About, { type AboutDict } from "@/components/sections/About";
import Pricing, { type PricingDict } from "@/components/sections/Pricing";
import Ownership, { type OwnershipDict } from "@/components/sections/Ownership";
import Proof, { type ProofDict } from "@/components/sections/Proof";
import type { PortfolioDict } from "@/components/sections/Portfolio";
import type { ProductsDict } from "@/components/sections/Products";
import Faq, { type FaqDict } from "@/components/sections/Faq";
import Cta, { type CtaDict } from "@/components/sections/Cta";
import KeywordPage, { type KeywordDict } from "@/components/sections/KeywordPage";
import type { HeroDict } from "@/components/sections/Hero";
// English fallback for locales without translated long-form pages (ja/zh
// ship English copy until native translations land — server-only import).
import enMessages from "@/messages/en.json";

import { ALL_SLUGS, KEYWORD_SET } from "@/lib/slugs";

const Portfolio = dynamic(() => import("@/components/sections/Portfolio"), {});
const Products = dynamic(() => import("@/components/sections/Products"), {});

export type Slug = (typeof ALL_SLUGS)[number];

// nav key + messages namespace per section-slug (titles/descriptions reuse existing copy).
const SLUG_CONF: Record<string, { navKey: string; ns: string }> = {
  tentang: { navKey: "about", ns: "about" },
  harga: { navKey: "pricing", ns: "pricing" },
  portofolio: { navKey: "portfolio", ns: "portfolio" },
  produk: { navKey: "products", ns: "products" },
  faq: { navKey: "faq", ns: "faq" },
};



export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ALL_SLUGS.map((slug) => ({ locale, slug })),
  );
}

type Props = { params: Promise<{ locale: string; slug: string }> };

type LooseMessages = Record<string, Record<string, unknown>>;

async function getKeywordDict(locale: string, slug: string): Promise<KeywordDict | null> {
  try {
    const all = (await getMessages()) as unknown as LooseMessages;
    const hit = (all.pages as Record<string, KeywordDict> | undefined)?.[slug];
    if (hit) return hit;
  } catch {
    /* fall through to English */
  }
  return (
    ((enMessages as unknown as LooseMessages).pages as Record<string, KeywordDict>)?.[slug] ??
    null
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale) || !(ALL_SLUGS).includes(slug)) {
    return {};
  }
  const url = `${SITE_URL}/${locale}/${slug}`;
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}/${slug}`;
  const alternates = {
    canonical: url,
    languages: { ...languages, "x-default": `${SITE_URL}/id/${slug}` },
  };

  if (KEYWORD_SET.has(slug)) {
    const dict = await getKeywordDict(locale, slug);
    if (!dict) return {};
    return {
      title: dict.title,
      description: dict.description,
      alternates,
      openGraph: {
        type: "website",
        url,
        siteName: SITE_NAME,
        title: dict.title,
        description: dict.description,
        images: [{ url: "/og.jpg", width: 1200, height: 630, alt: SITE_NAME }],
      },
      twitter: { card: "summary_large_image", title: dict.title, description: dict.description },
    };
  }

  const conf = SLUG_CONF[slug];
  if (!conf) return {};
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
  return {
    title: `${tNav(conf.navKey)} | ${SITE_NAME}`,
    description,
    alternates,
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
  ownership: OwnershipDict;
  portfolio: PortfolioDict;
  products: ProductsDict;
  proof: ProofDict;
  faq: FaqDict;
  cta: CtaDict;
  nav: Record<string, string>;
};

export default async function SlugPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale) || !(ALL_SLUGS).includes(slug)) {
    notFound();
  }
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

  if (KEYWORD_SET.has(slug)) {
    const dict = await getKeywordDict(locale, slug);
    if (!dict) notFound();
    const related = [
      { href: `/${locale}/harga`, label: m.nav.pricing ?? "Harga" },
      { href: `/${locale}/portofolio`, label: m.nav.portfolio ?? "Portofolio" },
      { href: `/${locale}/produk`, label: m.nav.products ?? "Produk" },
      { href: `/${locale}/faq`, label: m.nav.faq ?? "FAQ" },
    ];
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
        <KeywordPage dict={dict as KeywordDict} slug={slug} locale={locale} related={related} />
        <Cta dict={m.cta} waText={m.hero.waText} />
      </>
    );
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {slug === "tentang" && <About dict={m.about} why={m.why} />}
      {slug === "harga" && (
        <>
          <Pricing dict={m.pricing} />
          <Ownership dict={m.ownership} />
        </>
      )}
      {slug === "portofolio" && (
        <>
          <Portfolio dict={m.portfolio} />
          <Proof dict={m.proof} />
        </>
      )}
      {slug === "produk" && <Products dict={m.products} />}
      {slug === "faq" && <Faq dict={m.faq} />}
      <Cta dict={m.cta} waText={m.hero.waText} />
    </>
  );
}
