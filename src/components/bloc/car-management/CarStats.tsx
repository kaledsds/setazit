// components/blocs/car-management/CarStats.tsx
export function CarStats({
  totalCars,
  filteredCars,
}: {
  totalCars: number;
  filteredCars: number;
}) {
  return (
    <div className="bg-card-car mb-6 rounded-2xl border border-[rgba(212,175,55,0.3)] p-6 shadow backdrop-blur">
      <div className="text-foreground flex justify-between text-sm">
        <div>
          <span className="text-lg font-bold text-[var(--accent-gold)]">
            {filteredCars}
          </span>{" "}
          cars found
        </div>
        <div>
          Showing{" "}
          <span className="font-semibold text-[var(--accent-gold)]">
            {filteredCars}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[var(--accent-gold)]">
            {totalCars}
          </span>{" "}
          total
        </div>
      </div>
    </div>
  );
}
