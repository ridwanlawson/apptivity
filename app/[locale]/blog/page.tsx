import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/lib/i18n";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { BLOG_POSTS } from "@/lib/slugs";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import enMessages from "@/messages/en.json";

type BlogDict = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  readMore: string;
  soonLabel: string;
  upcoming: { title: string; desc: string }[];
};

type PostMeta = { title: string; description: string };

async function getBlog(locale: string): Promise<BlogDict> {
  const all = (await getMessages()) as unknown as Record<string, Record<string, BlogDict>>;
  const fallback = (enMessages as unknown as Record<string, Record<string, BlogDict>>).pages;
  const dict = all.pages?.blog ?? fallback?.blog;
  if (!dict) throw new Error("messages: pages.blog hilang");
  return dict;
}

async function getPostMeta(locale: string, post: string): Promise<PostMeta | null> {
  const all = (await getMessages()) as unknown as Record<string, Record<string, PostMeta>>;
  const fallback = (enMessages as unknown as Record<string, Record<string, PostMeta>>).pages;
  return all.pages?.[post] ?? fallback?.[post] ?? null;
}

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
  const dict = await getBlog(locale);
  const url = `${SITE_URL}/${locale}/blog`;
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}/blog`;
  return {
    title: dict.title,
    description: dict.description,
    alternates: { canonical: url, languages: { ...languages, "x-default": `${SITE_URL}/id/blog` } },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: dict.title,
      description: dict.description,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: SITE_NAME }],
    },
  };
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const dict = await getBlog(locale);

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal>
          <div data-reveal>
            <SectionHeading eyebrow="Blog" title={dict.h1} />
          </div>
        </Reveal>
        <Reveal>
          <p data-reveal className="mt-6 text-lg leading-relaxed text-muted">
            {dict.intro}
          </p>
        </Reveal>
        <div className="mt-10 space-y-5">
          {await Promise.all(
            BLOG_POSTS.map(async (post) => {
              const meta = await getPostMeta(locale, post);
              if (!meta) return null;
              return (
                <article
                  key={post}
                  className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-ink/5"
                >
                  <h2 className="text-xl font-extrabold tracking-tight text-ink">
                    <a href={`/${locale}/blog/${post}`} className="hover:text-brand">
                      {meta.title.split(" | ")[0]}
                    </a>
                  </h2>
                  <p className="mt-2 leading-relaxed text-muted">{meta.description}</p>
                  <a
                    href={`/${locale}/blog/${post}`}
                    className="mt-4 inline-block rounded-full bg-navy-950 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-navy-800"
                  >
                    {dict.readMore}
                  </a>
                </article>
              );
            }),
          )}
          {dict.upcoming.map((u) => (
            <article
              key={u.title}
              className="rounded-3xl bg-white/60 p-7 ring-1 ring-ink/5"
              aria-label={`${u.title} — ${dict.soonLabel}`}
            >
              <p className="text-xs font-extrabold uppercase tracking-widest text-gold">
                {dict.soonLabel}
              </p>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight text-ink/70">
                {u.title}
              </h2>
              <p className="mt-2 leading-relaxed text-muted">{u.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
