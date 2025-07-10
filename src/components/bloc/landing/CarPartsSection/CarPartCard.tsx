interface CarPartCardProps {
  image: string;
  title: string;
  description: string;
  price: string;
  features: string[];
}

export default function CarPartCard({
  image,
  title,
  description,
  price,
  features,
}: CarPartCardProps) {
  return (
    <div className="bg-card-car card-hover rounded-2xl border border-[rgba(212,175,55,0.3)] p-6 backdrop-blur transition hover:scale-105">
      <img
        src={image}
        alt={title}
        className="mb-6 h-[200px] w-full rounded-xl object-cover"
      />

      <div className="space-y-3">
        <h3 className="text-2xl font-semibold text-[var(--accent-gold)]">
          {title}
        </h3>

        <p className="text-foreground text-sm">{description}</p>

        <div className="my-2 flex flex-wrap gap-2">
          {features.map((feature, index) => (
            <span
              key={index}
              className="text-foreground rounded-full border border-[var(--card-border)] bg-[var(--service-card-bg)] px-3 py-1 text-xs"
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
            className="flex-1 rounded-full bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-gold-light)] px-4 py-2 text-center font-semibold text-black transition-transform hover:-translate-y-1"
          >
            Buy Now
          </a>
          <a
            href="#"
            className="text-foreground flex-1 rounded-full border border-[var(--card-border)] px-4 py-2 text-center font-semibold transition hover:border-[var(--accent-gold)] hover:bg-[var(--card-bg)]"
          >
            Details
          </a>
        </div>
      </div>
    </div>
  );
}
