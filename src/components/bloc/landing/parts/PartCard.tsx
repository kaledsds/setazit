// src/components/inventory/PartCard.tsx
import Image from "next/image";
import { CreateShopModal } from "../../shop-management/CreateShopModal";

interface PartCardProps {
  partId: string;
  image: string;
  title: string;
  brand: string;
  model: string;
  condition: string;
  price: string;
  status?: string;
  features: string[];
}

export default function PartCard({
  partId,
  image,
  title,
  brand,
  model,
  condition,
  price,
  status = "Available",
  features,
}: PartCardProps) {
  return (
    <div className="bg-card-car card-hover">
      <div
        className={`absolute top-4 right-4 z-10 rounded-full px-3 py-1 text-sm font-semibold ${
          status === "Out of Stock"
            ? "bg-red-600 text-white"
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
        className="mb-6 h-[250px] w-full rounded-xl object-cover"
      />
      <div className="space-y-3">
        <h3 className="text-2xl font-semibold text-(--accent-gold)">{title}</h3>
        <div className="text-foreground flex justify-between text-sm">
          <span>{brand}</span>
          <span>{model}</span>
          <span>{condition}%</span>
        </div>
        <div className="my-2 flex flex-wrap gap-2">
          {features.map((feature, index) => (
            <span
              key={index}
              className="text-foreground rounded-full border border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.05)] px-3 py-1 text-xs"
            >
              {feature}
            </span>
          ))}
        </div>
        <div className="text-foreground text-2xl font-bold drop-shadow">
          {price}
        </div>
        <div className="mt-3 flex gap-3">
          <CreateShopModal partId={partId} partName={title} />
        </div>
      </div>
    </div>
  );
}
