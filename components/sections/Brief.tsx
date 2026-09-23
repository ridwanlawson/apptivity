"use client";

import { useRef, useState } from "react";
import SectionHeading from "../SectionHeading";
import { useReveal } from "@/lib/anim";
import { waLink } from "@/lib/site";

export type BriefDict = {
  eyebrow: string;
  title: string;
  sub: string;
  steps: string[];
  typeLabel: string;
  types: string[];
  ownLabel: string;
  buy: string;
  rent: string;
  nameLabel: string;
  namePh: string;
  contactLabel: string;
  contactPh: string;
  detailLabel: string;
  detailPh: string;
  back: string;
  next: string;
  submit: string;
  reviewTitle: string;
  required: string;
  waIntro: string;
};

// 3-step project brief → composed into a WhatsApp message (no backend).
export default function Brief({ dict }: { dict: BriefDict }) {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [type, setType] = useState<number | null>(null);
  const [own, setOwn] = useState<"buy" | "rent">("buy");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [detail, setDetail] = useState("");
  const [tried, setTried] = useState(false);
  const headRef = useRef<HTMLHeadingElement>(null);
  useReveal(ref);

  const go = (n: number) => {
    setTried(false);
    setStep(n);
    headRef.current?.focus();
  };

  const next = () => {
    if (step === 0 && type === null) {
      setTried(true);
      return;
    }
    go(Math.min(2, step + 1));
  };

  const validDetails =
    name.trim() !== "" && contact.trim() !== "" && detail.trim() !== "";

  const submit = () => {
    if (!validDetails) {
      setTried(true);
      return;
    }
    const lines = [
      dict.waIntro,
      ``,
      `1. ${dict.steps[0]}: ${dict.types[type ?? 0]}`,
      `2. ${dict.steps[1]}: ${own === "buy" ? dict.buy : dict.rent}`,
      `3. ${dict.nameLabel}: ${name.trim()}`,
      `   ${dict.contactLabel}: ${contact.trim()}`,
      `   ${dict.detailLabel}: ${detail.trim()}`,
    ];
    window.open(waLink(lines.join("\n")), "_blank", "noopener");
  };

  const err = (bad: boolean) =>
    tried && bad ? (
      <p role="alert" className="mt-1 text-sm font-semibold text-red-600">
        {dict.required}
      </p>
    ) : null;

  const inputCls =
    "mt-1 w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-muted/60 focus:border-brand focus:outline-none";

  return (
    <section
      ref={ref}
      id="mulai"
      aria-labelledby="mulai-title"
      className="scroll-mt-20 bg-white"
    >
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:py-28">
        <div id="mulai-title">
          <SectionHeading eyebrow={dict.eyebrow} title={dict.title} />
        </div>
        <p data-reveal className="mt-4 text-lg text-muted">
          {dict.sub}
        </p>

        <div data-reveal className="mt-8 rounded-3xl bg-paper p-6 ring-1 ring-ink/5 sm:p-8">
          {/* progress */}
          <ol className="flex items-center gap-2" aria-label={dict.eyebrow}>
            {dict.steps.map((s, i) => (
              <li key={s} className="flex flex-1 items-center gap-2 last:flex-none">
                <span
                  aria-current={i === step ? "step" : undefined}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                    i < step
                      ? "bg-emerald-500 text-white"
                      : i === step
                        ? "bg-navy-950 text-white"
                        : "bg-ink/10 text-muted"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </span>
                <span
                  className={`hidden text-sm font-bold sm:block ${i === step ? "text-ink" : "text-muted"}`}
                >
                  {s}
                </span>
                {i < dict.steps.length - 1 && (
                  <span aria-hidden="true" className="h-px flex-1 bg-ink/15" />
                )}
              </li>
            ))}
          </ol>

          <h3
            ref={headRef}
            tabIndex={-1}
            className="mt-6 text-xl font-extrabold text-ink focus:outline-none"
          >
            {dict.steps[step]}
          </h3>

          {step === 0 && (
            <fieldset className="mt-4">
              <legend className="font-bold text-ink">{dict.typeLabel}</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2" role="radiogroup">
                {dict.types.map((t, i) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={type === i}
                    onClick={() => setType(i)}
                    className={`rounded-2xl border-2 px-4 py-3 text-left font-semibold transition-colors ${
                      type === i
                        ? "border-brand bg-brand/5 text-ink"
                        : "border-ink/10 bg-white text-muted hover:border-brand/50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {err(type === null)}
            </fieldset>
          )}

          {step === 1 && (
            <fieldset className="mt-4">
              <legend className="font-bold text-ink">{dict.ownLabel}</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2" role="radiogroup">
                {(["buy", "rent"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={own === m}
                    onClick={() => setOwn(m)}
                    className={`rounded-2xl border-2 px-4 py-3 text-left font-semibold transition-colors ${
                      own === m
                        ? "border-gold bg-gold/10 text-ink"
                        : "border-ink/10 bg-white text-muted hover:border-gold/60"
                    }`}
                  >
                    {m === "buy" ? dict.buy : dict.rent}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="brief-name" className="font-bold text-ink">
                  {dict.nameLabel}
                </label>
                <input
                  id="brief-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={dict.namePh}
                  autoComplete="name"
                  aria-invalid={tried && name.trim() === ""}
                  className={inputCls}
                />
                {err(name.trim() === "")}
              </div>
              <div>
                <label htmlFor="brief-contact" className="font-bold text-ink">
                  {dict.contactLabel}
                </label>
                <input
                  id="brief-contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder={dict.contactPh}
                  autoComplete="tel"
                  aria-invalid={tried && contact.trim() === ""}
                  className={inputCls}
                />
                {err(contact.trim() === "")}
              </div>
              <div>
                <label htmlFor="brief-detail" className="font-bold text-ink">
                  {dict.detailLabel}
                </label>
                <textarea
                  id="brief-detail"
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder={dict.detailPh}
                  rows={4}
                  aria-invalid={tried && detail.trim() === ""}
                  className={`${inputCls} resize-y`}
                />
                {err(detail.trim() === "")}
              </div>

              <div className="rounded-2xl bg-navy-950 p-4 text-sm text-white/85">
                <p className="font-bold text-gold">{dict.reviewTitle}</p>
                <p className="mt-1">
                  {dict.types[type ?? 0]} · {own === "buy" ? dict.buy : dict.rent}
                  {name.trim() && ` · ${name.trim()}`}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between gap-3">
            <button
              type="button"
              onClick={() => go(Math.max(0, step - 1))}
              disabled={step === 0}
              className="rounded-full border border-ink/15 px-6 py-2.5 font-bold text-muted disabled:opacity-40"
            >
              {dict.back}
            </button>
            {step < 2 ? (
              <button
                type="button"
                onClick={next}
                className="rounded-full bg-navy-950 px-6 py-2.5 font-bold text-white hover:bg-navy-800"
              >
                {dict.next}
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                className="rounded-full bg-gold px-6 py-2.5 font-bold text-navy-950 hover:brightness-105"
              >
                {dict.submit}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
