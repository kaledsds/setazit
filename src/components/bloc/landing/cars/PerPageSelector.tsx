"use client";

export default function PerPageSelector({
  perPage,
  onChange,
}: {
  perPage: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mb-8 flex items-center justify-between rounded-lg border border-[rgba(212,175,55,0.3)] bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-4 backdrop-blur">
      <span className="text-foreground text-sm">Results per page:</span>
      <select
        title="pagination"
        value={perPage}
        onChange={(e) => onChange(Number(e.target.value))}
        className="text-foreground rounded-md border border-[rgba(212,175,55,0.3)] bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-2"
      >
        {[3, 6, 9, 12].map((n) => (
          <option key={n} value={n}>
            {n} per page
          </option>
        ))}
      </select>
    </div>
  );
}
