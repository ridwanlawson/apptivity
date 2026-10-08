// Brand-style icons drawn to match the lucide stroke aesthetic
// (24×24, stroke currentColor, round caps) — no extra dependency.
// Simplified originals: bubble + handset reads as WhatsApp, rounded
// square + lens + flash dot reads as Instagram.
export function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.5 12a8.5 8.5 0 0 1-14.4 6.1L3 19.5l1.5-3A8.5 8.5 0 1 1 20.5 12z" />
      <path
        d="M9.2 8.6c.3-.7.7-.7 1-.4l.9.9c.2.2.3.6.1.9l-.5.5c.4.9 1.1 1.6 2 2l.5-.5c.3-.2.7-.1.9.1l.9.9c.3.3.3.7-.4 1-.8.4-1.7.5-2.7.1-1.6-.6-3.2-2.2-3.8-3.8-.4-1-.3-1.9.1-2.8z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function InstagramIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
