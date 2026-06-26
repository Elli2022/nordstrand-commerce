import { getProducts } from "@/lib/api";
import { ShopCatalog } from "@/components/shop-catalog";
import { TrustBar } from "@/components/trust-bar";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div>
      <section className="mb-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Ny kollektion · Vår 2026
          </p>
          <h1 className="font-display mb-5 text-4xl leading-tight sm:text-5xl">
            Tidlös heminredning från Norden
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-[var(--muted)]">
            Utvalda textilier, keramik och köksdetaljer — kuraterat för ett
            lugnt hem med naturliga material och genomtänkt design.
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="font-display text-2xl text-[var(--foreground)]">Fri frakt över 799 kr</p>
          <p className="mt-2 text-[var(--muted)]">
            Handla säkert med kort, Apple Pay eller Klarna. Leverans inom 3–5 vardagar.
          </p>
        </div>
      </section>

      <TrustBar />
      <ShopCatalog products={products} />
    </div>
  );
}
