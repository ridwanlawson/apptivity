import SectionHeading from "../SectionHeading";

export type PricingDict = {
  eyebrow: string;
  title: string;
  intro: string;
  fromLabel: string;
  price: string;
  usd: string;
  usdNote: string;
  payTitle: string;
  payBody: string;
  cta: string;
  note: string;
  productNote: string;
  productLink: string;
};

// TODO(data): tampilkan estimasi harga per jenis proyek (web profil,
// web app, mobile, AI/integrasi) hanya jika angka resmi diberikan.
// Tanpa data: halaman ini tetap memakai "mulai dari Rp500 ribu".
export default function Pricing({ dict }: { dict: PricingDict }) {
  return (
    <section
      id="harga"
      aria-labelledby="harga-title"
      className="scroll-mt-20 bg-navy-950"
      style={{
        backgroundImage: "linear-gradient(160deg, #061029 0%, #0d2758 85%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div id="harga-title">
          <SectionHeading eyebrow={dict.eyebrow} title={dict.title} dark />
        </div>
        <p data-reveal className="mt-4 max-w-3xl text-lg leading-relaxed text-white/70">
          {dict.intro}
        </p>

        <div data-reveal className="mt-10 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-sky-hi">
            {dict.fromLabel}
          </p>
          <p className="mt-3 text-6xl font-extrabold tracking-tight text-gold sm:text-7xl">
            {dict.price}
          </p>
          <p className="mt-4 text-lg font-semibold text-white">
            {dict.usd}{" "}
            <span className="font-normal text-white/55">{dict.usdNote}</span>
          </p>
        </div>

        <div
          data-reveal
          className="mt-8 rounded-3xl border border-gold/30 bg-gold/5 p-6 sm:p-7"
        >
          <h3 className="font-extrabold text-gold">{dict.payTitle}</h3>
          <p className="mt-2 leading-relaxed text-white/80">{dict.payBody}</p>
        </div>

        <p data-reveal className="mx-auto mt-6 max-w-2xl text-center text-[15px] leading-relaxed text-white/65">
          {dict.productNote}
        </p>
        <div data-reveal className="mt-4 text-center">
          <a
            href="#produk"
            className="inline-block rounded-full border border-gold/60 px-6 py-2.5 text-sm font-bold text-gold transition-colors hover:bg-gold hover:text-navy-950"
          >
            {dict.productLink}
          </a>
        </div>

        <div data-reveal className="mt-8 flex flex-col items-center gap-3 text-center">
          <a
            href="#mulai"
            className="inline-block rounded-full bg-gold px-8 py-3.5 font-bold text-navy-950 shadow-lg shadow-gold/20 transition-all hover:-translate-y-0.5 hover:shadow-gold/40"
          >
            {dict.cta}
          </a>
          <p className="text-sm text-white/50">{dict.note}</p>
        </div>
      </div>
    </section>
  );
}
