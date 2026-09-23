import { setRequestLocale } from "next-intl/server";
import { getMessages } from "next-intl/server";
import Hero, { type HeroDict } from "@/components/sections/Hero";
import About, { type AboutDict } from "@/components/sections/About";
import Scheme, { type SchemeDict } from "@/components/sections/Scheme";
import Ownership, { type OwnershipDict } from "@/components/sections/Ownership";
import Mechanism, { type MechanismDict } from "@/components/sections/Mechanism";
import Legal, { type LegalDict } from "@/components/sections/Legal";
import Cta, { type CtaDict } from "@/components/sections/Cta";
import type { Locale } from "@/lib/i18n";

type PageMessages = {
  hero: HeroDict;
  about: AboutDict;
  why: { eyebrow: string; body: string };
  scheme: SchemeDict;
  ownership: OwnershipDict;
  mechanism: MechanismDict;
  legal: LegalDict;
  cta: CtaDict;
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
      <About dict={m.about} why={m.why} />
      <Scheme dict={m.scheme} />
      <Ownership dict={m.ownership} />
      <Mechanism dict={m.mechanism} />
      <Legal dict={m.legal} />
      <Cta dict={m.cta} />
    </>
  );
}
