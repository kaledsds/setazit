// src/components/inventory/GarageGrid.tsx
"use client";
import { useState } from "react";
import { SearchBar } from "@/common/components/pagination/search-bar";
import { api } from "@/utils/api";
import { usePagination } from "@/common/components/pagination/hooks/use-pagination";
import { TemplatePagination } from "@/common/components/pagination/components/template-pagination";
import GarageCard from "./GarageCard";
import GarageFilterSection from "./GarageFilterSection";

interface FilterState {
  name: string;
  address: string;
  services: string;
}

export default function GarageGrid() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    name: "",
    address: "",
    services: "",
  });

  const { paginationStates, paginationSetStates } = usePagination();

  const { data, isLoading, error } = api.garage.getAll.useQuery(
    {
      page: paginationStates.currentPage,
      pageSize: paginationStates.itemsPerPage,
      search: searchTerm,
      name: filters.name || undefined,
      address: filters.address || undefined,
      services: filters.services || undefined,
    },
    { refetchOnWindowFocus: false }
  );

   const garages = data?.data ?? [];
  const meta = data?.meta;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    paginationSetStates.setCurrentPage(1);
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    paginationSetStates.setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ name: "", address: "", services: "" });
    paginationSetStates.setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <section id="garages" className="px-6 py-6">
        <div className="mx-auto max-w-[1400px] flex-col space-y-10">
          <h2 className="section-title">Our Garages</h2>
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center text-(--accent-gold)">
              Loading garages...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="garages" className="px-6 py-6">
        <div className="mx-auto max-w-[1400px] flex-col space-y-10">
          <h2 className="section-title">Our Garages</h2>
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center text-red-500">
              Error: {error.message}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="garages" className="px-6 py-6">
      <div className="mx-auto max-w-[1400px] flex-col space-y-10">
        <h2 className="section-title">Our Garages</h2>

        <SearchBar searchTerm={searchTerm} setSearchTerm={handleSearch} />

        <GarageFilterSection
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          isCollapsed={isCollapsed}
          setCollapsed={setIsCollapsed}
        />

        {garages.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center text-(--accent-gold)">
              {searchTerm.trim() || Object.values(filters).some(v => v)
                ? "No garages found."
                : "No garages available."}
            </div>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {garages.map((garage) => (
              <GarageCard
                key={garage.id}
                garageId={garage.id}
                image={garage.image ?? "/placeholder-garage.jpg"}
                title={garage.name}
                address={garage.address}
                phone={garage.phone}
                services={garage.services}
                status={garage.availability ? "Open" : "Closed"}
                features={[
                  `Address: ${garage.address}`,
                  `Phone: ${garage.phone}`,
                  garage.availability ? "Open" : "Closed",
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