import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { CartLink } from "@/components/cart-link";
import { CartProvider } from "@/hooks/use-cart";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display"
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Nordstrand — Nordisk heminredning",
  description:
    "Utvald heminredning och hantverk från Norden. Textil, keramik och köksdetaljer med säker checkout."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={`${display.variable} ${body.variable}`}>
      <body>
        <CartProvider>
          <header className="border-b border-[var(--border)] bg-[var(--card)]/95 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
              <Link href="/" className="font-display text-2xl tracking-wide">
                Nordstrand
              </Link>
              <nav className="flex items-center gap-6 text-sm font-medium text-[var(--muted)]">
                <Link className="transition hover:text-[var(--foreground)]" href="/">
                  Butik
                </Link>
                <CartLink />
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
          <footer className="border-t border-[var(--border)] bg-[var(--card)] px-6 py-10 text-sm text-[var(--muted-soft)]">
            <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
              <div>
                <p className="font-display text-lg text-[var(--foreground)]">Nordstrand</p>
                <p className="mt-2">Nordisk heminredning med fokus på material, hantverk och tidlös form.</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)]">Kundservice</p>
                <p className="mt-2">Frakt 3–5 vardagar</p>
                <p>30 dagars öppet köp</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)]">Betalning</p>
                <p className="mt-2">Kort, Apple Pay och Klarna via Stripe.</p>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
