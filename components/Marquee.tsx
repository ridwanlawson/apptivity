// Trust ticker: credibility reasons, infinite marquee (CSS only).
// Alternating gold/white rhythm; pauses on hover; still when reduced motion.
export default function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={t} className="flex items-center whitespace-nowrap">
          <span
            className={`px-6 text-sm font-bold uppercase tracking-widest sm:text-base ${
              i % 2 === 0 ? "text-gold" : "text-white/85"
            }`}
          >
            {t}
          </span>
          <span aria-hidden="true" className="text-white/30">
            ◆
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee-wrap overflow-hidden border-y border-white/10 bg-navy-800 py-4" role="presentation">
      <div className="marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
