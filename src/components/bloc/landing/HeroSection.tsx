"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="bg-image relative flex h-screen items-center justify-center overflow-hidden bg-cover bg-center text-center"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-radial from-yellow-500/10 via-transparent to-transparent"></div>

      <div className="relative z-10 max-w-3xl px-4">
        <h1 className="from-foreground bg-linear-to-r to-yellow-400 bg-clip-text text-4xl font-bold text-transparent drop-shadow-xl md:text-5xl lg:text-6xl">
          SetaZit Luxury Redefined
        </h1>
        <p className="mt-4 text-lg text-white md:text-xl">
          Experience the pinnacle of automotive excellence with our curated
          collection of premium vehicles.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link href="/sign-in">
            <Button
              size="lg"
              className="cursor-pointer rounded-full bg-linear-to-r from-yellow-400 to-yellow-300 text-black shadow-xl"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer rounded-full border-yellow-400 bg-transparent text-yellow-300 bg-blend-saturation hover:bg-yellow-300/10"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
