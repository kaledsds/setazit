interface CarCardProps {
  image: string;
  title: string;
  year: string;
  engine: string;
  mileage: string;
  price: string;
  status?: string;
  features: string[];
}

export default function CarCard({
  image,
  title,
  year,
  engine,
  mileage,
  price,
  status = "Available",
  features,
}: CarCardProps) {
  return (
    <div className="bg-card-car card-hover">
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
      <img
        src={image}
        alt={title}
        className="mb-6 h-[250px] w-full rounded-xl object-cover"
      />
      <div className="space-y-3">
        <h3 className="text-2xl font-semibold text-(--accent-gold)">{title}</h3>
        <div className="text-foreground flex justify-between text-sm">
          <span>{year}</span>
          <span>{engine}</span>
          <span>{mileage}</span>
        </div>
        <div className="my-2 flex flex-wrap gap-2">
          {features.map((feature, index) => (
            <span
              key={index}
              className="text-foreground rounded-full border border-(--card-border) bg-(--service-card-bg) px-3 py-1 text-xs"
            >
              {feature}
            </span>
          ))}
        </div>
        <div className="text-foreground text-2xl font-bold drop-shadow">
          {price}
        </div>
        <div className="mt-3 flex gap-3">
          <a
            href="#"
            className="flex-1 rounded-full bg-linear-to-r from-(--accent-gold) to-(--accent-gold-light) px-4 py-2 text-center font-semibold text-black transition-transform hover:-translate-y-1"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
}
