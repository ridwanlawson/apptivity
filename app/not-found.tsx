import Link from "next/link";

// Root 404 (outside any locale): plain fallback that routes into /en.
export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "7rem 1rem", textAlign: "center" }}>
          <p style={{ fontSize: "4rem", fontWeight: 800, margin: 0 }}>404</p>
          <h1>Page not found</h1>
          <p>
            <Link href="/en">Back to home</Link>
          </p>
        </div>
      </body>
    </html>
  );
}
