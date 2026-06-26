"use client";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-xl">
      <h1 className="mb-4 text-3xl">Något gick fel</h1>
      <p className="mb-4 text-[var(--muted)]">
        Butiken kunde inte laddas just nu. Försök igen om en stund.
      </p>
      <p className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted)]">
        Render gratisplan kan behöva en halv minut att vakna. Prova igen om en
        stund.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-[var(--accent)] px-6 py-3 text-white"
      >
        Försök igen
      </button>
    </div>
  );
}
