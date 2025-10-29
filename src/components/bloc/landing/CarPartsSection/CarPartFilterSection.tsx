"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CarPartFilterSection({
  onApply,
  onReset,
  isCollapsed,
  setCollapsed,
}: {
  onApply: () => void;
  onReset: () => void;
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-8 backdrop-blur",
        "bg-card-car border-[rgba(212,175,55,0.3)]",
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[color:(--accent-gold) text-xl font-bold">
          🛠️ Find Car Parts That Fit
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
            {/* Category */}
            <div className="flex flex-col">
              <label
                htmlFor="categoryFilter"
                className="text-foreground mb-2 text-sm font-medium"
              >
                Category
              </label>
              <select
                id="categoryFilter"
                className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
              >
                <option value="">All Categories</option>
                <option value="Exhaust">Exhaust</option>
                <option value="Spoiler">Spoiler</option>
                <option value="Brakes">Brakes</option>
                <option value="Suspension">Suspension</option>
                <option value="Interior">Interior</option>
              </select>
            </div>

            {/* Brand */}
            <div className="flex flex-col">
              <label
                htmlFor="brandFilter"
                className="text-foreground mb-2 text-sm font-medium"
              >
                Brand
              </label>
              <select
                id="brandFilter"
                className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
              >
                <option value="">All Brands</option>
                <option value="Aftermarket">Aftermarket</option>
                <option value="CarbonTech">CarbonTech</option>
                <option value="OEM">OEM</option>
              </select>
            </div>

            {/* Material */}
            <div className="flex flex-col">
              <label
                htmlFor="materialFilter"
                className="text-foreground mb-2 text-sm font-medium"
              >
                Material
              </label>
              <select
                id="materialFilter"
                className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
              >
                <option value="">All Materials</option>
                <option value="Steel">Steel</option>
                <option value="Carbon Fiber">Carbon Fiber</option>
                <option value="Aluminum">Aluminum</option>
                <option value="Plastic">Plastic</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="flex flex-col">
              <label className="text-foreground mb-2 text-sm font-medium">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
                />
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="rounded-full bg-[linear-gradient(45deg,var(--accent-gold),var(--accent-gold-light))] px-6 py-2 text-black shadow-md transition hover:scale-105"
              onClick={onApply}
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              className="hover:bg-card-car text-foreground rounded-full border border-[rgba(212,175,55,0.3)] px-6 py-2 backdrop-blur hover:border-(--accent-gold)"
              onClick={onReset}
            >
              Reset All
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
