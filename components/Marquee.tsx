// Trust ticker: real promises + audiences, infinite marquee (CSS only).
export default function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <span key={t} className="flex items-center whitespace-nowrap">
          <span className="px-6 text-sm font-bold uppercase tracking-widest text-white/80">
            {t}
          </span>
          <span aria-hidden="true" className="text-gold">
            ◆
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden border-y border-white/10 bg-navy-800 py-4" role="presentation">
      <div className="marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
