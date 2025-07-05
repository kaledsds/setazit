const services = [
  {
    icon: "🏎️",
    title: "Luxury Vehicle Sales",
    desc: "Curated selection of premium vehicles from world-renowned manufacturers, each meticulously inspected and certified.",
  },
  {
    icon: "🔧",
    title: "Genuine Parts & Accessories",
    desc: "Authentic OEM parts and luxury accessories to maintain your vehicle's performance and aesthetic excellence.",
  },
  {
    icon: "🛠️",
    title: "Expert Service Center",
    desc: "Master technicians trained by manufacturers provide world-class maintenance and repair services.",
  },
  {
    icon: "💎",
    title: "Concierge Services",
    desc: "White-glove service including home delivery, pickup services, and personalized vehicle consultations.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-[var(--bg-tertiary)] px-6 py-24">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="section-title">Premium Services</h2>
        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[var(--card-border)] bg-[var(--service-card-bg)] p-10 text-center transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 text-4xl text-[var(--accent-gold)]">
                {service.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[var(--text-primary)]">
                {service.title}
              </h3>
              <p className="leading-relaxed text-[var(--text-secondary)]">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
