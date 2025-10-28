import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

interface FilterSectionProps {
  onApply: (filters: FilterState) => void;
  onReset: () => void;
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function FilterSection({
  onApply,
  onReset,
  isCollapsed,
  setCollapsed,
}: FilterSectionProps) {
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
      year: "",
      status: "",
      color: "",
      priceMin: "",
      priceMax: "",
      yearMin: "",
      yearMax: "",
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
        <h2 className="text-xl font-bold text-(--accent-gold)">
          🔍 Find Your Perfect Vehicle
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
              <label
                htmlFor="brandFilter"
                className="text-foreground mb-2 text-sm font-medium"
              >
                Marque
              </label>
              <input
                id="brandFilter"
                type="text"
                placeholder="Ex: Toyota, BMW"
                value={filters.brand}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
                className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
              />
            </div>

            {/* Model */}
            <div className="flex flex-col">
              <label
                htmlFor="modelFilter"
                className="text-foreground mb-2 text-sm font-medium"
              >
                Modèle
              </label>
              <input
                id="modelFilter"
                type="text"
                placeholder="Ex: Camry, X5"
                value={filters.model}
                onChange={(e) => handleFilterChange("model", e.target.value)}
                className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <label
                htmlFor="statusFilter"
                className="text-foreground mb-2 text-sm font-medium"
              >
                Statut
              </label>
              <select
                id="statusFilter"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
              >
                <option value="">Tous les statuts</option>
                <option value="new">Neuf</option>
                <option value="used">Occasion</option>
                <option value="certified">Certifié</option>
              </select>
            </div>

            {/* Color */}
            <div className="flex flex-col">
              <label
                htmlFor="colorFilter"
                className="text-foreground mb-2 text-sm font-medium"
              >
                Couleur
              </label>
              <input
                id="colorFilter"
                type="text"
                placeholder="Ex: Noir, Blanc"
                value={filters.color}
                onChange={(e) => handleFilterChange("color", e.target.value)}
                className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
              />
            </div>

            {/* Year Range */}
            <div className="flex flex-col">
              <label className="text-foreground mb-2 text-sm font-medium">
                Année
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.yearMin}
                  onChange={(e) =>
                    handleFilterChange("yearMin", e.target.value)
                  }
                  className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.yearMax}
                  onChange={(e) =>
                    handleFilterChange("yearMax", e.target.value)
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

          {/* Filter Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="rounded-full bg-[linear-gradient(45deg,var(--accent-gold),var(--accent-gold-light))] px-6 py-2 text-black shadow-md transition hover:scale-105"
              onClick={handleApply}
            >
              Appliquer les filtres
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
