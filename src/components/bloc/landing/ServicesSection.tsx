const services = [
  {
    icon: "🏎️",
    title: "Luxury Vehicle Sales",
    description:
      "Curated selection of premium vehicles from world-renowned manufacturers, each meticulously inspected and certified.",
  },
  {
    icon: "🔧",
    title: "Genuine Parts & Accessories",
    description:
      "Authentic OEM parts and luxury accessories to maintain your vehicle's performance and aesthetic excellence.",
  },
  {
    icon: "🛠️",
    title: "Expert Service Center",
    description:
      "Master technicians trained by manufacturers provide world-class maintenance and repair services.",
  },
  {
    icon: "💎",
    title: "Concierge Services",
    description:
      "White-glove service including home delivery, pickup services, and personalized vehicle consultations.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="bg-service pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-12 text-center text-3xl font-bold text-yellow-400 drop-shadow-lg md:text-4xl">
          Premium Services
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <div
              key={i}
              className="bg-card-service rounded-2xl border border-yellow-300/20 bg-yellow-300/5 p-8 text-center shadow transition-all hover:-translate-y-2"
            >
              <div className="mb-4 text-4xl">{service.icon}</div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
