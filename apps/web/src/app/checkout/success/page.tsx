import Link from "next/link";
import { getOrder } from "@/lib/api";
import { formatPrice } from "@nordstrand/shared";

export default async function CheckoutSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  const order = orderId ? await getOrder(orderId) : null;

  return (
    <div className="max-w-2xl">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--success)]">
        Orderbekräftelse
      </p>
      <h1 className="font-display mb-4 text-4xl">Tack för ditt köp</h1>
      <p className="mb-8 text-lg text-[var(--muted)]">
        Vi har tagit emot din beställning. En bekräftelse skickas till din e-post
        när betalningen är slutförd.
      </p>

      {order ? (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--muted)]">Ordernummer</p>
              <p className="font-medium">{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--muted)]">Status</p>
              <p className="font-semibold text-[var(--success)]">{order.status}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--muted)]">Totalt</p>
              <p className="text-xl font-semibold">{formatPrice(order.totalCents)}</p>
            </div>
          </div>
          <ul className="space-y-3 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted)]">
            {order.items.map((item: {
              productName: string;
              quantity: number;
              unitPriceCents: number;
            }) => (
              <li
                key={`${item.productName}-${item.quantity}`}
                className="flex justify-between gap-4"
              >
                <span>
                  {item.quantity}× {item.productName}
                </span>
                <span>{formatPrice(item.unitPriceCents * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Link href="/" className="btn-primary mt-8">
        Tillbaka till butiken
      </Link>
    </div>
  );
}
