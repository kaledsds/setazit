// src/components/inventory/PartGrid.tsx
"use client";
import { useState } from "react";
import PartCard from "./PartCard";
import PartFilterSection from "./PartFilterSection";
import { SearchBar } from "@/common/components/pagination/search-bar";
import { api } from "@/utils/api";
import { usePagination } from "@/common/components/pagination/hooks/use-pagination";
import { TemplatePagination } from "@/common/components/pagination/components/template-pagination";

interface FilterState {
  brand: string;
  model: string;
  conditionMin: string;
  conditionMax: string;
  priceMin: string;
  priceMax: string;
}

export default function PartGrid() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    brand: "",
    model: "",
    conditionMin: "",
    conditionMax: "",
    priceMin: "",
    priceMax: "",
  });

  const { paginationStates, paginationSetStates } = usePagination();

  const { data, isLoading, error } = api.part.getAll.useQuery(
    {
      page: paginationStates.currentPage,
      pageSize: paginationStates.itemsPerPage,
      search: searchTerm,
      brand: filters.brand || undefined,
      model: filters.model || undefined,
      conditionMin: filters.conditionMin
        ? parseInt(filters.conditionMin)
        : undefined,
      conditionMax: filters.conditionMax
        ? parseInt(filters.conditionMax)
        : undefined,
      priceMin: filters.priceMin || undefined,
      priceMax: filters.priceMax || undefined,
    },
    { refetchOnWindowFocus: false },
  );

  const parts = data?.data ?? [];
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
    setFilters({
      brand: "",
      model: "",
      conditionMin: "",
      conditionMax: "",
      priceMin: "",
      priceMax: "",
    });
    paginationSetStates.setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <section id="parts" className="px-6 py-6">
        <div className="mx-auto max-w-[1400px] flex-col space-y-10">
          <h2 className="section-title">Available Parts</h2>
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center text-(--accent-gold)">
              Loading parts...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="parts" className="px-6 py-6">
        <div className="mx-auto max-w-[1400px] flex-col space-y-10">
          <h2 className="section-title">Available Parts</h2>
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
    <section id="parts" className="px-6 py-6">
      <div className="mx-auto max-w-[1400px] flex-col space-y-10">
        <h2 className="section-title">Available Parts</h2>

        <SearchBar searchTerm={searchTerm} setSearchTerm={handleSearch} />

        <PartFilterSection
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          isCollapsed={isCollapsed}
          setCollapsed={setIsCollapsed}
        />

        {parts.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center text-(--accent-gold)">
              {searchTerm.trim() || Object.values(filters).some((v) => v)
                ? "No parts found matching your criteria."
                : "No parts available at the moment."}
            </div>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {parts.map((part) => (
              <PartCard
                key={part.id}
                partId={part.id}
                image={part.image ?? "/placeholder-part.jpg"}
                title={part.name}
                brand={part.brand}
                model={part.model}
                condition={part.condition.toString()}
                price={`${part.price} DT`}
                status={part.availability ? "In Stock" : "Out of Stock"}
                features={[
                  `Brand: ${part.brand}`,
                  `Condition: ${part.condition}%`,
                  part.availability ? "In Stock" : "Out of Stock",
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
