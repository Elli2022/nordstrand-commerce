import Link from "next/link";
import { ProductDetail } from "@/components/product-detail";

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <Link href="/" className="mb-8 inline-block text-sm text-[var(--muted)]">
        ← Tillbaka till produkter
      </Link>
      <ProductDetail slug={slug} />
    </div>
  );
}
