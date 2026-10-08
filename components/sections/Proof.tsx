import SectionHeading from "../SectionHeading";

export type ProofDict = {
  eyebrow: string;
  title: string;
  intro: string;
  stats: { value: string; label: string }[];
  casesTitle: string;
  cases: { problem: string; solution: string; result: string }[];
  problemLabel: string;
  solutionLabel: string;
  resultLabel: string;
  testiTitle: string;
  testimonial: { quote: string; name: string };
  techTitle: string;
  tech: string[];
  techNote: string;
  cta: string;
};

export default function Proof({ dict }: { dict: ProofDict }) {
  return (
    <section
      id="bukti"
      aria-labelledby="bukti-title"
      className="scroll-mt-20 bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div id="bukti-title">
          <SectionHeading eyebrow={dict.eyebrow} title={dict.title} />
        </div>
        <p data-reveal className="mt-4 max-w-3xl text-lg text-muted">
          {dict.intro}
        </p>

        {/* Stats */}
        <dl className="mt-10 grid gap-5 sm:grid-cols-3">
          {dict.stats.map((s) => (
            <div
              key={s.label}
              data-reveal
              className="rounded-3xl bg-navy-950 p-7 text-center"
            >
              <dt className="order-2 mt-2 block text-sm font-semibold leading-relaxed text-white/65">
                {s.label}
              </dt>
              <dd className="order-1 text-4xl font-extrabold tracking-tight text-gold">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Case placeholders */}
        <h3 data-reveal className="mt-14 text-xl font-extrabold text-ink">
          {dict.casesTitle}
        </h3>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {dict.cases.map((c, i) => (
            <article
              key={i}
              data-reveal
              className="rounded-3xl bg-paper p-7 ring-1 ring-ink/5"
            >
              <div className="space-y-4 text-[15px] leading-relaxed">
                <p>
                  <span className="mb-1 block text-xs font-extrabold uppercase tracking-widest text-brand">
                    {dict.problemLabel}
                  </span>
                  <span className="text-muted">{c.problem}</span>
                </p>
                <p>
                  <span className="mb-1 block text-xs font-extrabold uppercase tracking-widest text-brand">
                    {dict.solutionLabel}
                  </span>
                  <span className="text-muted">{c.solution}</span>
                </p>
                <p className="rounded-2xl bg-emerald-50 p-4">
                  <span className="mb-1 block text-xs font-extrabold uppercase tracking-widest text-emerald-700">
                    {dict.resultLabel}
                  </span>
                  <span className="font-semibold text-emerald-800">{c.result}</span>
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Testimonial + tech + founder */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <figure
            data-reveal
            className="flex flex-col rounded-3xl bg-navy-950 p-8 text-white"
          >
            <figcaption className="text-sm font-bold uppercase tracking-widest text-gold">
              {dict.testiTitle}
            </figcaption>
            <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-white/85">
              <span aria-hidden="true" className="text-3xl leading-none text-gold">
                &ldquo;
              </span>
              {dict.testimonial.quote}
            </blockquote>
            <p className="mt-4 text-sm font-bold text-sky-hi">{dict.testimonial.name}</p>
          </figure>

          <div className="flex flex-col gap-5">
            <div data-reveal className="flex-1 rounded-3xl bg-paper p-7 ring-1 ring-ink/5">
              <h3 className="font-extrabold text-ink">{dict.techTitle}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {dict.tech.map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-navy-950 px-3.5 py-1.5 text-xs font-bold text-white"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-muted">{dict.techNote}</p>
            </div>
          </div>
        </div>

        <div data-reveal className="mt-10 text-center">
          <a
            href="#mulai"
            className="inline-block rounded-full bg-navy-950 px-8 py-3.5 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-navy-800"
          >
            {dict.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
