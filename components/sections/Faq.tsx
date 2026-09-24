import SectionHeading from "../SectionHeading";
import FaqList from "./FaqList";
import Reveal from "../Reveal";

export type FaqDict = {
  eyebrow: string;
  title: string;
  items: { q: string; a: string }[];
};

// Server-rendered FAQ + FAQPage JSON-LD (eligible for rich results).
export default function Faq({ dict }: { dict: FaqDict }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal>
          <div id="faq-title" data-reveal>
            <SectionHeading eyebrow={dict.eyebrow} title={dict.title} />
          </div>
        </Reveal>
        <Reveal>
          <FaqList items={dict.items} />
        </Reveal>
      </div>
    </section>
  );
}
