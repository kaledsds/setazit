"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`bg-background sticky top-0 z-40 w-full border-b backdrop-blur-lg transition-all duration-300 ${
        scrolled ? "bg-(--header-bg-scroll)" : "C"
      } border-(--card-border) py-4`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8">
        <div className="text-3xl font-bold text-(--accent-gold) drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
          Setazit
        </div>
        <nav className="hidden gap-8 md:flex">
          <Link
            href="/"
            className="text-foreground relative font-medium transition-all hover:text-(--accent-gold) hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]"
          >
            Home
          </Link>
          <Link
            href="/#inventory"
            className="text-foreground relative font-medium transition-all hover:text-(--accent-gold) hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]"
          >
            Inventory
          </Link>
          <Link
            href="/cars"
            className="text-foreground relative font-medium transition-all hover:text-(--accent-gold) hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]"
          >
            Cars
          </Link>
          <Link
            href="/parts"
            className="text-foreground relative font-medium transition-all hover:text-(--accent-gold) hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]"
          >
            Parts
          </Link>
          <Link
            href="#services"
            className="text-foreground relative font-medium transition-all hover:text-(--accent-gold) hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]"
          >
            Services
          </Link>
          <Link
            href="#contact"
            className="text-foreground relative font-medium transition-all hover:text-(--accent-gold) hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]"
          >
            Contact
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
