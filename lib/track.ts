// Conversion-event helper. Sends to the analytics backend when present
// (Fase 6 wires @vercel/analytics), otherwise records a DOM event that
// tests/debug tools can observe. Never throws, never blocks navigation.
export type TrackProps = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, props: TrackProps = {}): void {
  try {
    const w = window as unknown as {
      va?: ((t: string, p?: Record<string, unknown>) => void) | { track?: (n: string, p?: TrackProps) => void };
    };
    if (typeof w.va === "function") {
      w.va("event", { name, data: props });
    } else if (w.va && typeof w.va.track === "function") {
      w.va.track(name, props);
    }
    window.dispatchEvent(new CustomEvent("apptivity:track", { detail: { name, ...props } }));
  } catch {
    /* analytics must never break the page */
  }
}
