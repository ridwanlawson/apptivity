import { setRequestLocale } from "next-intl/server";
import { getMessages } from "next-intl/server";
import dynamic from "next/dynamic";
import Hero, { type HeroDict } from "@/components/sections/Hero";
import About, { type AboutDict } from "@/components/sections/About";
import Scheme, { type SchemeDict } from "@/components/sections/Scheme";
import Ownership, { type OwnershipDict } from "@/components/sections/Ownership";
import Mechanism, { type MechanismDict } from "@/components/sections/Mechanism";
import Pricing, { type PricingDict } from "@/components/sections/Pricing";
import Legal, { type LegalDict } from "@/components/sections/Legal";
// Below-fold interactive sections load in separate chunks so the initial
// bundle stays lean. SSR stays on: HTML is complete, no CLS.
const Portfolio = dynamic(() => import("@/components/sections/Portfolio"), {});
const Products = dynamic(() => import("@/components/sections/Products"), {});
const Brief = dynamic(() => import("@/components/sections/Brief"), {});
import Proof, { type ProofDict } from "@/components/sections/Proof";
import Join, { type JoinDict } from "@/components/sections/Join";
import type { PortfolioDict } from "@/components/sections/Portfolio";
import type { ProductsDict } from "@/components/sections/Products";
import type { BriefDict } from "@/components/sections/Brief";
import Faq, { type FaqDict } from "@/components/sections/Faq";
import Cta, { type CtaDict } from "@/components/sections/Cta";
import type { Locale } from "@/lib/i18n";

type PageMessages = {
  hero: HeroDict;
  about: AboutDict;
  why: { eyebrow: string; body: string };
  scheme: SchemeDict;
  ownership: OwnershipDict;
  mechanism: MechanismDict;
  pricing: PricingDict;
  legal: LegalDict;
  portfolio: PortfolioDict;
  products: ProductsDict;
  proof: ProofDict;
  join: JoinDict;
  brief: BriefDict;
  faq: FaqDict;
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
      <Pricing dict={m.pricing} />
      <Portfolio dict={m.portfolio} />
      <Products dict={m.products} />
      <Proof dict={m.proof} />
      <Join dict={m.join} />
      <Legal dict={m.legal} />
      <Brief dict={m.brief} />
      <Faq dict={m.faq} />
      <Cta dict={m.cta} waText={m.hero.waText} />
    </>
  );
}
