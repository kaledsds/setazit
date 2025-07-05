"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function FilterSection({
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
        <h2 className="text-xl font-bold text-[color:var(--accent-gold)]">
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
            {[
              {
                label: "Make",
                id: "makeFilter",
                options: [
                  "Lamborghini",
                  "Mercedes-Benz",
                  "Porsche",
                  "Ferrari",
                  "BMW",
                  "Audi",
                  "Bentley",
                  "Rolls-Royce",
                ],
              },
              {
                label: "Model",
                id: "modelFilter",
                options: ["Huracán", "S-Class", "Cayenne", "488 GTB"],
              },
              {
                label: "Year",
                id: "yearFilter",
                options: ["2024", "2023", "2022", "2021", "2020"],
              },
              {
                label: "Fuel Type",
                id: "fuelFilter",
                options: ["Gasoline", "Hybrid", "Electric", "Diesel"],
              },
              {
                label: "Transmission",
                id: "transmissionFilter",
                options: ["Automatic", "Manual", "CVT"],
              },
              {
                label: "Drivetrain",
                id: "drivetrainFilter",
                options: ["AWD", "RWD", "FWD"],
              },
            ].map(({ label, id, options }) => (
              <div key={id} className="flex flex-col">
                <label
                  htmlFor={id}
                  className="text-foreground mb-2 text-sm font-medium"
                >
                  {label}
                </label>
                <select
                  id={id}
                  className="text-foreground bg-card-car rounded-lg border border-[rgba(212,175,55,0.3)] p-3"
                >
                  <option className="text-foreground" value="">
                    All {label}s
                  </option>
                  {options.map((opt) => (
                    <option
                      className="text-background bg-card-car"
                      key={opt}
                      value={opt}
                    >
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}

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

            {/* Mileage Range */}
            <div className="flex flex-col">
              <label className="text-foreground mb-2 text-sm font-medium">
                Mileage Range
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

          {/* Filter Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              className="rounded-full bg-[linear-gradient(45deg,var(--accent-gold),var(--accent-gold-light))] px-6 py-2 text-black shadow-md transition hover:scale-105"
              onClick={onApply}
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              className="hover:bg-card-car text-foreground rounded-full border border-[rgba(212,175,55,0.3)] px-6 py-2 backdrop-blur hover:border-[var(--accent-gold)]"
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
