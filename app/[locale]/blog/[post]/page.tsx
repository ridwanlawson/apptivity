import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/lib/i18n";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import Cta, { type CtaDict } from "@/components/sections/Cta";
import KeywordPage, { type KeywordDict } from "@/components/sections/KeywordPage";
import type { HeroDict } from "@/components/sections/Hero";
import { BLOG_POSTS } from "@/lib/slugs";
import enMessages from "@/messages/en.json";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    BLOG_POSTS.map((post) => ({ locale, post })),
  );
}

type Props = { params: Promise<{ locale: string; post: string }> };

type Loose = Record<string, Record<string, KeywordDict>>;

async function getArticle(locale: string, post: string): Promise<KeywordDict | null> {
  void locale;
  const all = (await getMessages()) as unknown as Loose;
  return (
    all.pages?.[post] ??
    (enMessages as unknown as Loose).pages?.[post] ??
    null
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, post } = await params;
  if (!hasLocale(routing.locales, locale) || !(BLOG_POSTS as readonly string[]).includes(post)) {
    return {};
  }
  const dict = await getArticle(locale, post);
  if (!dict) return {};
  const url = `${SITE_URL}/${locale}/blog/${post}`;
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}/blog/${post}`;
  return {
    title: dict.title,
    description: dict.description,
    alternates: {
      canonical: url,
      languages: { ...languages, "x-default": `${SITE_URL}/en/blog/${post}` },
    },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: dict.title,
      description: dict.description,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: SITE_NAME }],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { locale, post } = await params;
  if (!hasLocale(routing.locales, locale) || !(BLOG_POSTS as readonly string[]).includes(post)) {
    notFound();
  }
  setRequestLocale(locale as Locale);
  const dict = await getArticle(locale, post);
  if (!dict) notFound();
  const m = (await getMessages()) as unknown as { hero: HeroDict; cta: CtaDict };
  const url = `${SITE_URL}/${locale}/blog/${post}`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/${locale}/blog` },
      { "@type": "ListItem", position: 3, name: post, item: url },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KeywordPage
        dict={dict as KeywordDict}
        slug={`blog/${post}`}
        locale={locale}
        related={[{ href: `/${locale}/blog`, label: "Blog" }]}
      />
      <Cta dict={m.cta} waText={m.hero.waText} />
    </>
  );
}
