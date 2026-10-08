"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/track";

// One delegated click listener for the whole page: any anchor/button with
// data-track="event-name" (and optional data-track-label) reports a
// conversion event with page + language context. Mount once in the layout.
export default function TrackClicks({ locale }: { locale: string }) {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest?.("[data-track]");
      if (!(el instanceof HTMLElement)) return;
      trackEvent(el.dataset.track ?? "click", {
        source: el.dataset.trackLabel ?? el.textContent?.trim().slice(0, 80) ?? "",
        locale,
        page: window.location.pathname,
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [locale]);
  return null;
}
