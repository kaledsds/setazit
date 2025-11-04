// src/components/inventory/GarageCard.tsx
import Image from "next/image";
import { CreateReviewModal } from "../../review-management/CreateReviewModal";
import { ReviewList } from "../../review-management/ReviewList";

interface GarageCardProps {
  garageId: string;
  image: string;
  title: string;
  address: string;
  phone: string;
  services: string;
  status?: string;
  features: string[];
}

export default function GarageCard({
  garageId,
  image,
  title,
  address,
  phone,
  services,
  status = "Open",
  features,
}: GarageCardProps) {
  return (
    <div className="bg-card-car card-hover">
      <div
        className={`absolute top-4 right-4 z-10 rounded-full px-3 py-1 text-sm font-semibold ${
          status === "Closed"
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
        <div className="text-foreground text-sm">
          <p>{address}</p>
          <p>{services}</p>
          <p className="mt-1">{phone}</p>
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
        <div className="mt-3 flex gap-3">
          <CreateReviewModal garageId={garageId} garageName={title} />
        </div>
      </div>
      <ReviewList garageId={garageId} />
    </div>
  );
}
