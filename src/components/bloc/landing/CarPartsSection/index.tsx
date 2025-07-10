// CarPartsSection.tsx
"use client";

import { useState } from "react";
import CarPartCard from "./CarPartCard";
import CarPartFilterSection from "./CarPartFilterSection";
import SortBy from "./SortBy";
import Pagination from "./Pagination";
import PerPageSelector from "./PerPageSelector";

const sampleParts = [
  {
    image: "https://images.unsplash.com/photo-1581093588401-9c5b6d9f1cdb?w=500",
    title: "Performance Exhaust",
    description:
      "Enhance sound and boost horsepower with this premium exhaust.",
    price: "$2,499",
    features: ["⚙️ Stainless Steel", "🔥 Aggressive Tone", "🔧 Easy Install"],
    category: "Exhaust",
    brand: "Aftermarket",
    material: "Steel",
  },
  {
    image: "https://images.unsplash.com/photo-1604358161866-9b339e6d964d?w=500",
    title: "Carbon Fiber Spoiler",
    description: "Lightweight aerodynamic spoiler for increased downforce.",
    price: "$1,299",
    features: ["🏁 Track Tested", "💨 Improved Stability", "🌟 High Quality"],
    category: "Spoiler",
    brand: "CarbonTech",
    material: "Carbon Fiber",
  },
  {
    image: "https://images.unsplash.com/photo-1581093588401-9c5b6d9f1cdb?w=500",
    title: "Performance Exhaust",
    description:
      "Enhance sound and boost horsepower with this premium exhaust.",
    price: "$2,499",
    features: ["⚙️ Stainless Steel", "🔥 Aggressive Tone", "🔧 Easy Install"],
    category: "Exhaust",
    brand: "Aftermarket",
    material: "Steel",
  },
  {
    image: "https://images.unsplash.com/photo-1604358161866-9b339e6d964d?w=500",
    title: "Carbon Fiber Spoiler",
    description: "Lightweight aerodynamic spoiler for increased downforce.",
    price: "$1,299",
    features: ["🏁 Track Tested", "💨 Improved Stability", "🌟 High Quality"],
    category: "Spoiler",
    brand: "CarbonTech",
    material: "Carbon Fiber",
  },
  {
    image: "https://images.unsplash.com/photo-1581093588401-9c5b6d9f1cdb?w=500",
    title: "Performance Exhaust",
    description:
      "Enhance sound and boost horsepower with this premium exhaust.",
    price: "$2,499",
    features: ["⚙️ Stainless Steel", "🔥 Aggressive Tone", "🔧 Easy Install"],
    category: "Exhaust",
    brand: "Aftermarket",
    material: "Steel",
  },
  {
    image: "https://images.unsplash.com/photo-1604358161866-9b339e6d964d?w=500",
    title: "Carbon Fiber Spoiler",
    description: "Lightweight aerodynamic spoiler for increased downforce.",
    price: "$1,299",
    features: ["🏁 Track Tested", "💨 Improved Stability", "🌟 High Quality"],
    category: "Spoiler",
    brand: "CarbonTech",
    material: "Carbon Fiber",
  },
  {
    image: "https://images.unsplash.com/photo-1581093588401-9c5b6d9f1cdb?w=500",
    title: "Performance Exhaust",
    description:
      "Enhance sound and boost horsepower with this premium exhaust.",
    price: "$2,499",
    features: ["⚙️ Stainless Steel", "🔥 Aggressive Tone", "🔧 Easy Install"],
    category: "Exhaust",
    brand: "Aftermarket",
    material: "Steel",
  },
  {
    image: "https://images.unsplash.com/photo-1604358161866-9b339e6d964d?w=500",
    title: "Carbon Fiber Spoiler",
    description: "Lightweight aerodynamic spoiler for increased downforce.",
    price: "$1,299",
    features: ["🏁 Track Tested", "💨 Improved Stability", "🌟 High Quality"],
    category: "Spoiler",
    brand: "CarbonTech",
    material: "Carbon Fiber",
  },
];

export default function CarPartsSection() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    material: "",
  });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [search, setSearch] = useState("");

  const filteredParts = sampleParts.filter((part) => {
    return (
      (filters.category === "" || part.category === filters.category) &&
      (filters.brand === "" || part.brand === filters.brand) &&
      (filters.material === "" || part.material === filters.material) &&
      (search === "" ||
        part.title.toLowerCase().includes(search.toLowerCase()) ||
        part.description.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const sortedParts = [...filteredParts].sort((a, b) => {
    if (sortOption === "price-low") {
      return (
        parseFloat(a.price.replace(/[^0-9.-]+/g, "")) -
        parseFloat(b.price.replace(/[^0-9.-]+/g, ""))
      );
    }
    if (sortOption === "price-high") {
      return (
        parseFloat(b.price.replace(/[^0-9.-]+/g, "")) -
        parseFloat(a.price.replace(/[^0-9.-]+/g, ""))
      );
    }
    if (sortOption === "title-az") {
      return a.title.localeCompare(b.title);
    }
    if (sortOption === "title-za") {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedParts.length / perPage);

  const paginatedParts = sortedParts.slice(
    (page - 1) * perPage,
    page * perPage,
  );

  const applyFilters = () => setPage(1);
  const resetFilters = () => {
    setFilters({ category: "", brand: "", material: "" });
    setPage(1);
  };

  return (
    <section className="bg-[var(--bg-secondary)] px-6 py-12">
      <div className="mx-auto max-w-[1400px] space-y-10">
        <h2 className="section-title">Premium Car Parts</h2>

        <CarPartFilterSection
          onApply={applyFilters}
          onReset={resetFilters}
          isCollapsed={!filtersVisible}
          setCollapsed={() => setFiltersVisible(!filtersVisible)}
        />

        <div className="flex-col gap-4 md:flex-row md:justify-between">
          <SortBy
            onChange={(val) => {
              setSortOption(val);
              setPage(1);
            }}
          />
          <PerPageSelector
            perPage={perPage}
            onChange={(val) => {
              setPerPage(val);
              setPage(1);
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or description"
            className="w-full rounded-lg border border-[rgba(212,175,55,0.3)] bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-3 text-[color:var(--text-primary)] backdrop-blur"
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {paginatedParts.map((part, index) => (
            <CarPartCard key={index} {...part} />
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
