// src/components/inventory/PartFilterSection.tsx
"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FilterState {
  brand: string;
  model: string;
  conditionMin: string;
  conditionMax: string;
  priceMin: string;
  priceMax: string;
}

interface PartFilterSectionProps {
  onApply: (filters: FilterState) => void;
  onReset: () => void;
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function PartFilterSection({
  onApply,
  onReset,
  isCollapsed,
  setCollapsed,
}: PartFilterSectionProps) {
  const [filters, setFilters] = useState<FilterState>({
    brand: "",
    model: "",
    conditionMin: "",
    conditionMax: "",
    priceMin: "",
    priceMax: "",
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  const handleReset = () => {
    setFilters({
      brand: "",
      model: "",
      conditionMin: "",
      conditionMax: "",
      priceMin: "",
      priceMax: "",
    });
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
        <h2 className="text-xl font-bold text-[var(--accent-gold)]">
          Find Your Part
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
            {/* Brand */}
            <div className="flex flex-col">
              <label className="text-foreground mb-2 text-sm font-medium">
                Marque
              </label>
              <input
                type="text"
                placeholder="Ex: Bosch"
                value={filters.brand}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
                className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
              />
            </div>

            {/* Model */}
            <div className="flex flex-col">
              <label className="text-foreground mb-2 text-sm font-medium">
                Modèle
              </label>
              <input
                type="text"
                placeholder="Ex: X5"
                value={filters.model}
                onChange={(e) => handleFilterChange("model", e.target.value)}
                className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
              />
            </div>

            {/* Condition Range */}
            <div className="flex flex-col">
              <label className="text-foreground mb-2 text-sm font-medium">
                État (%)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.conditionMin}
                  onChange={(e) =>
                    handleFilterChange("conditionMin", e.target.value)
                  }
                  className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.conditionMax}
                  onChange={(e) =>
                    handleFilterChange("conditionMax", e.target.value)
                  }
                  className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="flex flex-col">
              <label className="text-foreground mb-2 text-sm font-medium">
                Prix (DT)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) =>
                    handleFilterChange("priceMin", e.target.value)
                  }
                  className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) =>
                    handleFilterChange("priceMax", e.target.value)
                  }
                  className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="rounded-full bg-[linear-gradient(45deg,var(--accent-gold),var(--accent-gold-light))] px-6 py-2 text-black shadow-md transition hover:scale-105"
              onClick={handleApply}
            >
              Appliquer
            </Button>
            <Button
              className="bg-card-car hover:bg-card-car text-foreground rounded-full border border-[rgba(212,175,55,0.3)] px-6 py-2 backdrop-blur hover:border-[var(--accent-gold)]"
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
