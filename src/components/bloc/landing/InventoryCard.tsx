// src/components/ui/Card.tsx
import Image from "next/image";

interface BaseCardProps {
  image: string;
  title: string;
  subtitle?: string;
  price?: string;
  status?: string;
  tags: string[];
  children?: React.ReactNode;
}

export function InventoryCard({
  image,
  title,
  subtitle,
  price,
  status = "Available",
  tags,
  children,
}: BaseCardProps) {
  return (
    <div className="bg-card-car card-hover relative overflow-hidden rounded-xl border border-[rgba(212,175,55,0.3)] shadow backdrop-blur">
      <div
        className={`absolute top-4 right-4 z-10 rounded-full px-3 py-1 text-sm font-semibold ${
          status === "Sold"
            ? "bg-red-600 text-white"
            : status === "Reserved"
              ? "bg-yellow-500 text-white"
              : "bg-(--accent-gold) text-black"
        }`}
      >
        {status}
      </div>
      <Image
        src={image}
        alt={title}
        height={250}
        width={300}
        className="mb-6 h-[250px] w-full rounded-t-xl object-cover"
      />
      <div className="space-y-3 p-4">
        <h3 className="text-2xl font-semibold text-(--accent-gold)">{title}</h3>
        {subtitle && <p className="text-sm text-foreground">{subtitle}</p>}
        <div className="my-2 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="rounded-full border border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.05)] px-3 py-1 text-xs text-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        {price && (
          <div className="text-2xl font-bold text-foreground drop-shadow">{price}</div>
        )}
        <div className="mt-3 flex gap-3">{children}</div>
      </div>
    </div>
  );
}