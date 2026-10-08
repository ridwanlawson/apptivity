import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Security headers: HSTS (preload-ready), anti-sniff, tight referrer,
// minimal permissions, clickjacking + COOP protection. CSP runs in
// REPORT-ONLY first: violations are logged (browser console + any
// configured report-uri), nothing is blocked until the policy is proven.
// Trusted Types: NOT enabled — incompatible with Next.js inline hydration
// scripts; enforcing it would break the app.
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Report-only: observe first. Tighten to enforcing after reviewing
  // violation reports (TODO manual: check console/CSP reports, then flip).
  {
    key: "Content-Security-Policy-Report-Only",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://www.apptivity.id https://apptivity.id",
      "font-src 'self' data:",
      "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://wa.me",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://wa.me https://www.instagram.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
