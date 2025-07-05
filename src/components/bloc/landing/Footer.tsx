export default function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--footer-bg)] px-6 pt-16 pb-6">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h4 className="mb-3 text-xl font-semibold text-[var(--accent-gold)]">
            EliteMotors
          </h4>
          <p className="text-[var(--text-secondary)]">
            Your premier destination for luxury automotive excellence.
            Experience the finest in premium vehicles and unparalleled service.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-xl font-semibold text-[var(--accent-gold)]">
            Quick Links
          </h4>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li>
              <a href="#inventory" className="hover:text-[var(--accent-gold)]">
                Vehicle Inventory
              </a>
            </li>
            <li>
              <a href="#parts" className="hover:text-[var(--accent-gold)]">
                Parts & Accessories
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-[var(--accent-gold)]">
                Service Center
              </a>
            </li>
            <li>
              <a href="#financing" className="hover:text-[var(--accent-gold)]">
                Financing
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xl font-semibold text-[var(--accent-gold)]">
            Contact Info
          </h4>
          <p className="text-[var(--text-secondary)]">
            📍 123 Luxury Boulevard
            <br />
            Beverly Hills, CA 90210
          </p>
          <p className="mt-2 text-[var(--text-secondary)]">
            📞 (555) 123-ELITE
          </p>
          <p className="text-[var(--text-secondary)]">
            ✉️ info@elitemotors.com
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-xl font-semibold text-[var(--accent-gold)]">
            Follow Us
          </h4>
          <p className="mb-3 text-[var(--text-secondary)]">
            Stay connected for the latest luxury automotive news and exclusive
            offers.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
            >
              Facebook
            </a>
            <a
              href="#"
              className="text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
      <div className="mt-12 border-t border-[var(--card-border)] pt-6 text-center text-sm text-[var(--text-muted)]">
        &copy; 2024 EliteMotors. All rights reserved. | Privacy Policy | Terms
        of Service
      </div>
    </footer>
  );
}
