export function TrustBar() {
  return (
    <div className="mb-10 grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted)] sm:grid-cols-3">
      <p>✓ Säker betalning via Stripe</p>
      <p>✓ Leverans inom 3–5 vardagar</p>
      <p>✓ 30 dagars öppet köp</p>
    </div>
  );
}
