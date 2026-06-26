import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="max-w-xl">
      <h1 className="mb-4 text-3xl">Betalningen avbröts</h1>
      <p className="mb-6 text-[var(--muted)]">
        Inga pengar har dragits. Om lagret reserverades återställs det när Stripe-sessionen
        löper ut.
      </p>
      <Link href="/cart" className="underline">
        Tillbaka till kundvagnen
      </Link>
    </div>
  );
}
