import Link from "next/link";

// Root 404 (outside any locale): plain fallback that routes into /id.
export default function RootNotFound() {
  return (
    <html lang="id">
      <body style={{ fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "7rem 1rem", textAlign: "center" }}>
          <p style={{ fontSize: "4rem", fontWeight: 800, margin: 0 }}>404</p>
          <h1>Halaman tidak ditemukan</h1>
          <p>
            <Link href="/id">Kembali ke beranda</Link>
          </p>
        </div>
      </body>
    </html>
  );
}
