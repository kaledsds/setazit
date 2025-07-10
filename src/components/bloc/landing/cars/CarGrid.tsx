"use client";
import { useState } from "react";
import CarCard from "./CarCard";
import FilterSection from "./FilterSection";
import Pagination from "./Pagination";
import SortBy from "./SortBy";
import PerPageSelector from "./PerPageSelector"; // Reusable per-page dropdown

const sampleCars = [
  {
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop",
    title: "Lamborghini Huracán",
    year: "2023",
    engine: "V10 Engine",
    mileage: "5,000 mi",
    price: "$299,999",
    status: "Available",
    features: ["🏎️ Sports Car", "⚡ 630 HP", "🔧 AWD", "🎯 Carbon Fiber"],
  },
  {
    image: "/images/marcedes.jpg",
    title: "Mercedes-Benz S-Class",
    year: "2024",
    engine: "V8 Biturbo",
    mileage: "2,100 mi",
    price: "$149,999",
    status: "Available",
    features: [
      "🚗 Luxury Sedan",
      "💎 Premium Interior",
      "🔧 RWD",
      "🎵 Burmester Audio",
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop",
    title: "Lamborghini Huracán",
    year: "2023",
    engine: "V10 Engine",
    mileage: "5,000 mi",
    price: "$299,999",
    status: "Available",
    features: ["🏎️ Sports Car", "⚡ 630 HP", "🔧 AWD", "🎯 Carbon Fiber"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1571007982924-d8d1a6d43da2?w=500&h=300&fit=crop",
    title: "Mercedes-Benz S-Class",
    year: "2024",
    engine: "V8 Biturbo",
    mileage: "2,100 mi",
    price: "$149,999",
    status: "Available",
    features: [
      "🚗 Luxury Sedan",
      "💎 Premium Interior",
      "🔧 RWD",
      "🎵 Burmester Audio",
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop",
    title: "Lamborghini Huracán",
    year: "2023",
    engine: "V10 Engine",
    mileage: "5,000 mi",
    price: "$299,999",
    status: "Available",
    features: ["🏎️ Sports Car", "⚡ 630 HP", "🔧 AWD", "🎯 Carbon Fiber"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1571007982924-d8d1a6d43da2?w=500&h=300&fit=crop",
    title: "Mercedes-Benz S-Class",
    year: "2024",
    engine: "V8 Biturbo",
    mileage: "2,100 mi",
    price: "$149,999",
    status: "Available",
    features: [
      "🚗 Luxury Sedan",
      "💎 Premium Interior",
      "🔧 RWD",
      "🎵 Burmester Audio",
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop",
    title: "Lamborghini Huracán",
    year: "2023",
    engine: "V10 Engine",
    mileage: "5,000 mi",
    price: "$299,999",
    status: "Available",
    features: ["🏎️ Sports Car", "⚡ 630 HP", "🔧 AWD", "🎯 Carbon Fiber"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1571007982924-d8d1a6d43da2?w=500&h=300&fit=crop",
    title: "Mercedes-Benz S-Class",
    year: "2024",
    engine: "V8 Biturbo",
    mileage: "2,100 mi",
    price: "$149,999",
    status: "Available",
    features: [
      "🚗 Luxury Sedan",
      "💎 Premium Interior",
      "🔧 RWD",
      "🎵 Burmester Audio",
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop",
    title: "Lamborghini Huracán",
    year: "2023",
    engine: "V10 Engine",
    mileage: "5,000 mi",
    price: "$299,999",
    status: "Available",
    features: ["🏎️ Sports Car", "⚡ 630 HP", "🔧 AWD", "🎯 Carbon Fiber"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1571007982924-d8d1a6d43da2?w=500&h=300&fit=crop",
    title: "Mercedes-Benz S-Class",
    year: "2024",
    engine: "V8 Biturbo",
    mileage: "2,100 mi",
    price: "$149,999",
    status: "Available",
    features: [
      "🚗 Luxury Sedan",
      "💎 Premium Interior",
      "🔧 RWD",
      "🎵 Burmester Audio",
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop",
    title: "Lamborghini Huracán",
    year: "2023",
    engine: "V10 Engine",
    mileage: "5,000 mi",
    price: "$299,999",
    status: "Available",
    features: ["🏎️ Sports Car", "⚡ 630 HP", "🔧 AWD", "🎯 Carbon Fiber"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1571007982924-d8d1a6d43da2?w=500&h=300&fit=crop",
    title: "Mercedes-Benz S-Class",
    year: "2024",
    engine: "V8 Biturbo",
    mileage: "2,100 mi",
    price: "$149,999",
    status: "Available",
    features: [
      "🚗 Luxury Sedan",
      "💎 Premium Interior",
      "🔧 RWD",
      "🎵 Burmester Audio",
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop",
    title: "Lamborghini Huracán",
    year: "2023",
    engine: "V10 Engine",
    mileage: "5,000 mi",
    price: "$299,999",
    status: "Available",
    features: ["🏎️ Sports Car", "⚡ 630 HP", "🔧 AWD", "🎯 Carbon Fiber"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1571007982924-d8d1a6d43da2?w=500&h=300&fit=crop",
    title: "Mercedes-Benz S-Class",
    year: "2024",
    engine: "V8 Biturbo",
    mileage: "2,100 mi",
    price: "$149,999",
    status: "Available",
    features: [
      "🚗 Luxury Sedan",
      "💎 Premium Interior",
      "🔧 RWD",
      "🎵 Burmester Audio",
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop",
    title: "Lamborghini Huracán",
    year: "2023",
    engine: "V10 Engine",
    mileage: "5,000 mi",
    price: "$299,999",
    status: "Available",
    features: ["🏎️ Sports Car", "⚡ 630 HP", "🔧 AWD", "🎯 Carbon Fiber"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1571007982924-d8d1a6d43da2?w=500&h=300&fit=crop",
    title: "Mercedes-Benz S-Class",
    year: "2024",
    engine: "V8 Biturbo",
    mileage: "2,100 mi",
    price: "$149,999",
    status: "Available",
    features: [
      "🚗 Luxury Sedan",
      "💎 Premium Interior",
      "🔧 RWD",
      "🎵 Burmester Audio",
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop",
    title: "Lamborghini Huracán",
    year: "2023",
    engine: "V10 Engine",
    mileage: "5,000 mi",
    price: "$299,999",
    status: "Available",
    features: ["🏎️ Sports Car", "⚡ 630 HP", "🔧 AWD", "🎯 Carbon Fiber"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1571007982924-d8d1a6d43da2?w=500&h=300&fit=crop",
    title: "Mercedes-Benz S-Class",
    year: "2024",
    engine: "V8 Biturbo",
    mileage: "2,100 mi",
    price: "$149,999",
    status: "Available",
    features: [
      "🚗 Luxury Sedan",
      "💎 Premium Interior",
      "🔧 RWD",
      "🎵 Burmester Audio",
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop",
    title: "Lamborghini Huracán",
    year: "2023",
    engine: "V10 Engine",
    mileage: "5,000 mi",
    price: "$299,999",
    status: "Available",
    features: ["🏎️ Sports Car", "⚡ 630 HP", "🔧 AWD", "🎯 Carbon Fiber"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1571007982924-d8d1a6d43da2?w=500&h=300&fit=crop",
    title: "Mercedes-Benz S-Class",
    year: "2024",
    engine: "V8 Biturbo",
    mileage: "2,100 mi",
    price: "$149,999",
    status: "Available",
    features: [
      "🚗 Luxury Sedan",
      "💎 Premium Interior",
      "🔧 RWD",
      "🎵 Burmester Audio",
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop",
    title: "Lamborghini Huracán",
    year: "2023",
    engine: "V10 Engine",
    mileage: "5,000 mi",
    price: "$299,999",
    status: "Available",
    features: ["🏎️ Sports Car", "⚡ 630 HP", "🔧 AWD", "🎯 Carbon Fiber"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1571007982924-d8d1a6d43da2?w=500&h=300&fit=crop",
    title: "Mercedes-Benz S-Class",
    year: "2024",
    engine: "V8 Biturbo",
    mileage: "2,100 mi",
    price: "$149,999",
    status: "Available",
    features: [
      "🚗 Luxury Sedan",
      "💎 Premium Interior",
      "🔧 RWD",
      "🎵 Burmester Audio",
    ],
  },
  {
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop",
    title: "Lamborghini Huracán",
    year: "2023",
    engine: "V10 Engine",
    mileage: "5,000 mi",
    price: "$299,999",
    status: "Available",
    features: ["🏎️ Sports Car", "⚡ 630 HP", "🔧 AWD", "🎯 Carbon Fiber"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1571007982924-d8d1a6d43da2?w=500&h=300&fit=crop",
    title: "Mercedes-Benz S-Class",
    year: "2024",
    engine: "V8 Biturbo",
    mileage: "2,100 mi",
    price: "$149,999",
    status: "Available",
    features: [
      "🚗 Luxury Sedan",
      "💎 Premium Interior",
      "🔧 RWD",
      "🎵 Burmester Audio",
    ],
  },
];

export default function CarGrid() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  const totalPages = Math.ceil(sampleCars.length / perPage);

  const paginatedCars = sampleCars.slice((page - 1) * perPage, page * perPage);

  return (
    <section id="inventory" className="bg-[var(--bg-secondary)] px-6 py-6">
      <div className="mx-auto max-w-[1400px] flex-col space-y-10">
        <h2 className="section-title">Our Collection</h2>

        <FilterSection
          onApply={() => console.log("Apply filters")}
          onReset={() => console.log("Reset filters")}
          isCollapsed={false}
          setCollapsed={() => console.log("Toggle filters")}
        />

        <SortBy onChange={(val) => console.log("Sort by:", val)} />
        <PerPageSelector
          perPage={perPage}
          onChange={(val) => {
            setPerPage(val);
            setPage(1); // Reset to first page on change
          }}
        />

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {paginatedCars.map((car, index) => (
            <CarCard key={index} {...car} />
          ))}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </section>
  );
}
