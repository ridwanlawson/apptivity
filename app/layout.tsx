import type { ReactNode } from "react";

// Locale layouts render their own <html>/<body>; root only passes through.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
