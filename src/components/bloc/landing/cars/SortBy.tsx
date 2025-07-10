"use client";
export default function SortBy({
  onChange,
}: {
  onChange: (value: string) => void;
}) {
  return (
    <div className="mb-8 flex items-center justify-between rounded-lg border border-[rgba(212,175,55,0.3)] bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-4 backdrop-blur">
      <span className="text-foreground text-sm">Sort by:</span>
      <select
        title="Sort"
        onChange={(e) => onChange(e.target.value)}
        className="text-foreground rounded-md border border-[rgba(212,175,55,0.3)] bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-2"
      >
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="year-new">Year: Newest First</option>
        <option value="year-old">Year: Oldest First</option>
        <option value="mileage-low">Mileage: Low to High</option>
        <option value="mileage-high">Mileage: High to Low</option>
      </select>
    </div>
  );
}
