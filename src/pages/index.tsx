"use client";

import HeroSection from "@/components/bloc/landing/HeroSection";
import ServicesSection from "@/components/bloc/landing/ServicesSection";
import { LandingLayout } from "@/layouts/landing-layout";
import FeaturedCollection from "@/components/bloc/landing/FeaturedCollection";

export default function HomePage() {
  return (
    <>
      <LandingLayout>
        <HeroSection />
        <FeaturedCollection />
        <ServicesSection />
      </LandingLayout>
    </>
  );
}
