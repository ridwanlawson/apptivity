import { setRequestLocale } from "next-intl/server";
import { getMessages } from "next-intl/server";
import Hero, { type HeroDict } from "@/components/sections/Hero";
import About, { type AboutDict } from "@/components/sections/About";
import Scheme, { type SchemeDict } from "@/components/sections/Scheme";
import Ownership, { type OwnershipDict } from "@/components/sections/Ownership";
import Mechanism, { type MechanismDict } from "@/components/sections/Mechanism";
import Legal, { type LegalDict } from "@/components/sections/Legal";
import Brief, { type BriefDict } from "@/components/sections/Brief";
import Faq, { type FaqDict } from "@/components/sections/Faq";
import Cta, { type CtaDict } from "@/components/sections/Cta";
import Marquee from "@/components/Marquee";
import type { Locale } from "@/lib/i18n";

type PageMessages = {
  hero: HeroDict;
  about: AboutDict;
  why: { eyebrow: string; body: string };
  scheme: SchemeDict;
  ownership: OwnershipDict;
  mechanism: MechanismDict;
  legal: LegalDict;
  brief: BriefDict;
  faq: FaqDict;
  cta: CtaDict;
  ticker: string[];
};

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const m = (await getMessages()) as unknown as PageMessages;

  return (
    <>
      <Hero dict={m.hero} locale={locale as Locale} />
      <Marquee items={m.ticker} />
      <About dict={m.about} why={m.why} />
      <Scheme dict={m.scheme} />
      <Ownership dict={m.ownership} />
      <Mechanism dict={m.mechanism} />
      <Legal dict={m.legal} />
      <Brief dict={m.brief} />
      <Faq dict={m.faq} />
      <Cta dict={m.cta} waText={m.hero.waText} />
    </>
  );
}
