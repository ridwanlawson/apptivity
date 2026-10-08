import SectionHeading from "../SectionHeading";
import FaqList from "./FaqList";
import Reveal from "../Reveal";
import { SITE_URL } from "@/lib/site";

export type KeywordBlock = {
  h2: string;
  body: string;
  points: string[];
};

export type KeywordDict = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  blocks: KeywordBlock[];
  faq: { q: string; a: string }[];
};

export type RelatedLink = { href: string; label: string };

// Long-form service page: single H1, clear H2s, FAQ, internal links,
// Service + FAQPage JSON-LD. Server-rendered, zero hydration of its own.
export default function KeywordPage({
  dict,
  slug,
  locale,
  related,
}: {
  dict: KeywordDict;
  slug: string;
  locale: string;
  related: RelatedLink[];
}) {
  const url = `${SITE_URL}/${locale}/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#layanan`,
        name: dict.h1,
        description: dict.description,
        url,
        provider: { "@id": `${SITE_URL}/#organisasi` },
        areaServed: "ID",
      },
      {
        "@type": "FAQPage",
        mainEntity: dict.faq.map((it) => ({
          "@type": "Question",
          name: it.q,
          acceptedAnswer: { "@type": "Answer", text: it.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="bg-paper">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:py-28">
          <Reveal>
            <div data-reveal>
              <SectionHeading eyebrow={slug.replaceAll("-", " ")} title={dict.h1} />
            </div>
          </Reveal>
          <Reveal>
            <p data-reveal className="mt-6 text-lg leading-relaxed text-muted">
              {dict.intro}
            </p>
          </Reveal>
          {dict.blocks.map((b) => (
            <section key={b.h2} className="mt-12" aria-label={b.h2}>
              <Reveal>
                <h2 data-reveal className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                  {b.h2}
                </h2>
              </Reveal>
              <Reveal>
                <p data-reveal className="mt-3 leading-relaxed text-muted">
                  {b.body}
                </p>
              </Reveal>
              {b.points.length > 0 && (
                <ul className="mt-4 space-y-3">
                  {b.points.map((p) => (
                    <li key={p} className="flex gap-3 leading-relaxed text-muted">
                      <span aria-hidden="true" className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          {related.length > 0 && (
            <nav aria-label="Related" className="mt-12 rounded-3xl bg-white p-7 ring-1 ring-ink/5">
              <ul className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <li key={r.href}>
                    <a
                      href={r.href}
                      className="inline-block rounded-full bg-navy-950 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-navy-800"
                    >
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <div className="mt-12">
            <FaqList items={dict.faq} />
          </div>
        </div>
      </article>
    </>
  );
}
