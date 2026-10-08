import SectionHeading from "../SectionHeading";
import LogoMark from "../LogoMark";

export type LegalDict = {
  eyebrow: string;
  title: string;
  body: string;
  company: string;
  entity: string;
};

export default function Legal({ dict }: { dict: LegalDict }) {
  return (
    <section
      id="legalitas"
      aria-labelledby="legalitas-title"
      className="scroll-mt-20 bg-paper"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <div id="legalitas-title">
          <SectionHeading eyebrow={dict.eyebrow} title={dict.title} />
        </div>
        <div
          data-reveal
          className="mt-8 flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-ink/5 sm:flex-row sm:items-center"
        >
          <LogoMark className="h-16 w-16 shrink-0" />
          <div>
            <p className="flex flex-wrap items-center gap-2 text-xl font-extrabold text-ink">
              {dict.company}
              <span className="rounded-full bg-teal-deep px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                {dict.entity}
              </span>
            </p>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted">{dict.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
