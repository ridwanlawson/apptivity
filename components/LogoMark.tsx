import Image from "next/image";

// Original Apptivity mark, used as-is (transparent PNG).
export default function LogoMark({
  className = "",
  eager = false,
}: {
  className?: string;
  eager?: boolean;
}) {
  return (
    <span className={`relative inline-block shrink-0 ${className}`} aria-hidden="false">
      <Image
        src="/logo.png"
        alt="Logo apptivity.id — jasa pembuatan aplikasi"
        fill
        sizes="160px"
        className="object-contain"
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
      />
    </span>
  );
}
