import Image from "next/image";

// Original Apptivity mark, used as-is (transparent PNG).
export default function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-block shrink-0 ${className}`} aria-hidden="false">
      <Image
        src="/logo.png"
        alt="Apptivity logo"
        fill
        sizes="160px"
        className="object-contain"
      />
    </span>
  );
}
