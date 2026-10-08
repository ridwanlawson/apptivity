import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import {
  routing,
  defaultLocale,
  localeFromCountry,
  localeFromAcceptLanguage,
  type Locale,
} from "./lib/i18n";

const intlMiddleware = createMiddleware(routing);
const locales = routing.locales as readonly string[];

function isValidLocale(v: string | undefined): v is Locale {
  return !!v && (locales as string[]).includes(v);
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Single canonical host: apex → www (301) so sitemap, canonical,
  // and indexed URLs never split across two hosts.
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (host === "apptivity.id") {
    const url = req.nextUrl.clone();
    url.host = "www.apptivity.id";
    url.protocol = "https";
    return NextResponse.redirect(url, 301);
  }

  // Geo-based default only for bare "/" (no locale yet, no cookie override).
  if (pathname === "/") {
    const cookie = req.cookies.get("NEXT_LOCALE")?.value;
    let locale: Locale;
    if (isValidLocale(cookie)) {
      locale = cookie;
    } else {
      locale =
        localeFromCountry(req.headers.get("x-vercel-ip-country")) ??
        localeFromAcceptLanguage(req.headers.get("accept-language")) ??
        defaultLocale;
    }
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
