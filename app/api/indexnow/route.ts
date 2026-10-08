import { NextResponse } from "next/server";
import { routing } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { ALL_SLUGS, BLOG_POSTS } from "@/lib/slugs";

// Manual IndexNow submitter: GET /api/indexnow
// Setup (once, manual):
//  1. Generate a key at Bing Webmaster Tools (any random hex string works).
//  2. Host it as public/<key>.txt containing the key (IndexNow ownership proof).
//  3. Set INDEXNOW_KEY to the same value in Vercel env vars (never committed).
// Then call this route after publishing/changing URLs.
export async function GET() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    return NextResponse.json(
      { ok: false, error: "INDEXNOW_KEY belum diisi (TODO manual)." },
      { status: 503 },
    );
  }
  const urlList: string[] = [];
  for (const locale of routing.locales) {
    urlList.push(`${SITE_URL}/${locale}`);
    for (const slug of ALL_SLUGS) urlList.push(`${SITE_URL}/${locale}/${slug}`);
    urlList.push(`${SITE_URL}/${locale}/blog`);
    for (const post of BLOG_POSTS) urlList.push(`${SITE_URL}/${locale}/blog/${post}`);
  }
  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key,
      keyLocation: `${SITE_URL}/${key}.txt`,
      urlList,
    }),
  });
  return NextResponse.json({ ok: res.ok, status: res.status, urls: urlList.length });
}
