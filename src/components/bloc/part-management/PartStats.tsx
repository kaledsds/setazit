export function PartStats({
  totalParts,
  availableParts,
}: {
  totalParts: number;
  availableParts: number;
}) {
  return (
    <div className="bg-card-car mb-6 rounded-2xl border border-[rgba(212,175,55,0.3)] p-6 shadow backdrop-blur">
      <div className="text-foreground flex justify-between text-sm">
        <div>
          <span className="text-lg font-bold text-(--accent-gold)">
            {availableParts}
          </span>{" "}
          pièces disponibles
        </div>
        <div>
          Total:{" "}
          <span className="font-semibold text-(--accent-gold)">
            {totalParts}
          </span>
        </div>
      </div>
    </div>
  );
}
