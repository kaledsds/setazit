"use client";

import CarGrid from "@/components/bloc/landing/CarGrid";
import FilterSection from "@/components/bloc/landing/FilterSection";
import Footer from "@/components/bloc/landing/Footer";
import Header from "@/components/bloc/landing/Header";
import HeroSection from "@/components/bloc/landing/HeroSection";
import Services from "@/components/bloc/landing/Service";
import ServicesSection from "@/components/bloc/landing/ServicesSection";
import SortBy from "@/components/bloc/landing/SortBy";

export default function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <CarGrid />
      <ServicesSection />
      <Footer />
    </>
  );
}
