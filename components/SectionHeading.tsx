export default function SectionHeading({
  eyebrow,
  title,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p
        data-reveal
        className={`text-sm font-bold uppercase tracking-widest ${
          dark ? "text-gold" : "text-brand"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        data-reveal
        className={`mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}
