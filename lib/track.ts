// Conversion-event helper, backed by Vercel Analytics (cookieless).
// Falls back to a DOM event when analytics is blocked/absent.
// Never throws, never blocks navigation.
import { track } from "@vercel/analytics";

export type TrackProps = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, props: TrackProps = {}): void {
  try {
    track(name, props);
  } catch {
    /* analytics must never break the page */
  }
  try {
    window.dispatchEvent(new CustomEvent("apptivity:track", { detail: { name, ...props } }));
  } catch {
    /* noop */
  }
}
