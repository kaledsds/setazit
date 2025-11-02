// src/components/inventory/GarageFilterSection.tsx
"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FilterState {
  name: string;
  address: string;
  services: string;
}

interface GarageFilterSectionProps {
  onApply: (filters: FilterState) => void;
  onReset: () => void;
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function GarageFilterSection({
  onApply,
  onReset,
  isCollapsed,
  setCollapsed,
}: GarageFilterSectionProps) {
  const [filters, setFilters] = useState<FilterState>({
    name: "",
    address: "",
    services: "",
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  const handleReset = () => {
    setFilters({ name: "", address: "", services: "" });
    onReset();
  };

  return (
    <div
      className={cn(
        "rounded-2xl border p-8 backdrop-blur",
        "bg-card-car border-[rgba(212,175,55,0.3)]",
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-(--accent-gold)">
          Find a Garage
        </h2>
        <Button
          variant="outline"
          className="bg-card-car text-foreground border border-[rgba(212,175,55,0.3)]"
          onClick={() => setCollapsed(!isCollapsed)}
        >
          {isCollapsed ? "Show Filters" : "Hide Filters"}
        </Button>
      </div>

      {!isCollapsed && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col">
              <label className="text-foreground mb-2 text-sm font-medium">
                Nom
              </label>
              <input
                type="text"
                placeholder="Ex: AutoPro"
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
                className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-foreground mb-2 text-sm font-medium">
                Adresse
              </label>
              <input
                type="text"
                placeholder="Ex: Tunis"
                value={filters.address}
                onChange={(e) => handleFilterChange("address", e.target.value)}
                className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-foreground mb-2 text-sm font-medium">
                Services
              </label>
              <input
                type="text"
                placeholder="Ex: Réparation, Vidange"
                value={filters.services}
                onChange={(e) => handleFilterChange("services", e.target.value)}
                className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="rounded-full bg-[linear_gradient(45deg,var(--accent-gold),var(--accent-gold-light))] px-6 py-2 text-black shadow-md transition hover:scale-105"
              onClick={handleApply}
            >
              Appliquer
            </Button>
            <Button
              className="bg-card-car hover:bg-card-car text-foreground rounded-full border border-[rgba(212,175,55,0.3)] px-6 py-2 backdrop-blur hover:border-(--accent-gold)"
              onClick={handleReset}
            >
              Réinitialiser
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
