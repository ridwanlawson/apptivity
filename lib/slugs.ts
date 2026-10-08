// Single source of truth for public sub-page slugs (used by the
// [slug] route, sitemap, and IndexNow). Slugs stay Indonesian in every
// locale for URL stability; page content itself is localized.
export const SECTION_SLUGS = [
  "tentang",
  "harga",
  "portofolio",
  "produk",
  "faq",
] as const;

export const KEYWORD_SLUGS = [
  "jasa-pembuatan-website",
  "jasa-pembuatan-aplikasi",
  "aplikasi-sekolah",
  "aplikasi-kampus",
] as const;

export const ALL_SLUGS: readonly string[] = [...SECTION_SLUGS, ...KEYWORD_SLUGS];

export const KEYWORD_SET = new Set<string>(KEYWORD_SLUGS);

export const BLOG_POSTS = ["beli-vs-sewa-aplikasi"] as const;
