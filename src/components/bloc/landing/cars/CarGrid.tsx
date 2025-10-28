"use client";
import { useState } from "react";
import CarCard from "./CarCard";
import FilterSection from "./FilterSection";
import Pagination from "./Pagination";
import SortBy from "./SortBy";
import PerPageSelector from "./PerPageSelector";
import { SearchBar } from "@/common/components/pagination/search-bar";
import { api } from "@/utils/api";
import { usePagination } from "@/common/components/pagination/hooks/use-pagination";
import { TemplatePagination } from "@/common/components/pagination/components/template-pagination";

interface FilterState {
  brand: string;
  model: string;
  year: string;
  status: string;
  color: string;
  priceMin: string;
  priceMax: string;
  yearMin: string;
  yearMax: string;
}

export default function CarGrid() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    brand: "",
    model: "",
    year: "",
    status: "",
    color: "",
    priceMin: "",
    priceMax: "",
    yearMin: "",
    yearMax: "",
  });

  const { paginationStates, paginationSetStates } = usePagination();

  // Fetch real data from API with filters
  const { data, isLoading, error } = api.car.getcars.useQuery(
    {
      page: paginationStates.currentPage,
      pageSize: paginationStates.itemsPerPage,
      search: searchTerm,
      // Pass filters to API
      brand: filters.brand || undefined,
      model: filters.model || undefined,
      status: filters.status || undefined,
      color: filters.color || undefined,
      yearMin: filters.yearMin ? parseInt(filters.yearMin) : undefined,
      yearMax: filters.yearMax ? parseInt(filters.yearMax) : undefined,
      priceMin: filters.priceMin || undefined,
      priceMax: filters.priceMax || undefined,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const cars = data?.data ?? [];
  const meta = data?.meta;

  // Reset to page 1 when search changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    paginationSetStates.setCurrentPage(1);
  };

  // Apply filters
  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    paginationSetStates.setCurrentPage(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      brand: "",
      model: "",
      year: "",
      status: "",
      color: "",
      priceMin: "",
      priceMax: "",
      yearMin: "",
      yearMax: "",
    });
    paginationSetStates.setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <section id="inventory" className="px-6 py-6">
        <div className="mx-auto max-w-[1400px] flex-col space-y-10">
          <h2 className="section-title">Our Collection</h2>
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center text-(--accent-gold)">
              Loading cars...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="inventory" className="px-6 py-6">
        <div className="mx-auto max-w-[1400px] flex-col space-y-10">
          <h2 className="section-title">Our Collection</h2>
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center text-red-500">
              Error loading cars: {error.message}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="inventory" className="px-6 py-6">
      <div className="mx-auto max-w-[1400px] flex-col space-y-10">
        <h2 className="section-title">Our Collection</h2>

        <SearchBar searchTerm={searchTerm} setSearchTerm={handleSearch} />

        <FilterSection
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          isCollapsed={isCollapsed}
          setCollapsed={setIsCollapsed}
        />

        <div className="flex items-center justify-between">
          <SortBy onChange={(val) => console.log("Sort by:", val)} />
          <PerPageSelector
            perPage={paginationStates.itemsPerPage}
            onChange={(val) => {
              paginationSetStates.setItemsPerPage(val);
              paginationSetStates.setCurrentPage(1);
            }}
          />
        </div>

        {cars.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center text-(--accent-gold)">
              {searchTerm.trim() ||
              filters.brand ||
              filters.model ||
              filters.status ||
              filters.color
                ? "No cars found matching your criteria."
                : "No cars available at the moment."}
            </div>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard
                key={car.id}
                image={car.image || "/placeholder-car.jpg"}
                title={`${car.brand} ${car.model}`}
                year={car.year.toString()}
                engine={
                  car.status === "new"
                    ? "Neuf"
                    : car.status === "used"
                      ? "Occasion"
                      : "Certifié"
                }
                mileage={car.color}
                price={`${car.price} DT`}
                status={car.availability ? "Available" : "Sold"}
                features={[
                  `🚗 ${car.brand}`,
                  `📅 ${car.year}`,
                  `🎨 ${car.color}`,
                  car.availability ? "✅ Available" : "❌ Sold",
                ]}
              />
            ))}
          </div>
        )}

        {meta && <TemplatePagination meta={meta} />}
      </div>
    </section>
  );
}
