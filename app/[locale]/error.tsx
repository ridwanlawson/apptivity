"use client";

import { usePathname } from "next/navigation";

// Localized runtime-error fallback WITHOUT next-intl hooks (no provider in
// this tree): locale is read from the URL, strings are inline and tiny.
const STR: Record<string, { title: string; body: string; retry: string }> = {
  id: {
    title: "Terjadi kesalahan",
    body: "Muat ulang halaman ini. Jika masih gagal, hubungi kami via WhatsApp.",
    retry: "Coba lagi",
  },
  en: {
    title: "Something went wrong",
    body: "Reload this page. If it still fails, reach us on WhatsApp.",
    retry: "Try again",
  },
  ja: {
    title: "エラーが発生しました",
    body: "このページを再読み込みしてください。改善しない場合はWhatsAppでご連絡ください。",
    retry: "再試行",
  },
  zh: {
    title: "发生错误",
    body: "请重新加载此页面。如果仍然失败,请通过WhatsApp联系我们。",
    retry: "重试",
  },
};

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] ?? "id";
  const t = STR[locale] ?? STR.id ?? { title: "", body: "", retry: "" };
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-28 text-center sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">{t.title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted">{t.body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-navy-950 px-7 py-3 font-bold text-white transition-colors hover:bg-navy-800"
          >
            {t.retry}
          </button>
        </div>
      </div>
    </div>
  );
}
