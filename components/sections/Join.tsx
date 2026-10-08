import SectionHeading from "../SectionHeading";
import { waLink } from "@/lib/site";

export type JoinDict = {
  eyebrow: string;
  title: string;
  intro: string;
  cards: { name: string; tag: string; body: string; cta: string }[];
  waTemplate: string;
};

export default function Join({ dict }: { dict: JoinDict }) {
  return (
    <section
      id="gabung"
      aria-labelledby="gabung-title"
      className="scroll-mt-20 bg-navy-950"
      style={{
        backgroundImage: "linear-gradient(160deg, #0d2758 0%, #061029 85%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div id="gabung-title">
          <SectionHeading eyebrow={dict.eyebrow} title={dict.title} dark />
        </div>
        <p data-reveal className="mt-4 max-w-3xl text-lg leading-relaxed text-white/70">
          {dict.intro}
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {dict.cards.map((c) => (
            <article
              key={c.name}
              data-reveal
              className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur"
            >
              <p className="text-sm font-bold uppercase tracking-widest text-sky-hi">
                {c.tag}
              </p>
              <h3 className="mt-2 text-2xl font-extrabold text-white">{c.name}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-white/75">{c.body}</p>
              <a
                href={waLink(dict.waTemplate.replace("_ROLE_", c.name))}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block w-fit rounded-full border border-gold/60 px-6 py-2.5 font-bold text-gold transition-colors hover:bg-gold hover:text-navy-950"
              >
                {c.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
