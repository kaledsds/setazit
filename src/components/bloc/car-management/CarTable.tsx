// components/blocs/car-management/CarTable.tsx
"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Car } from "@/types/car";
import SortBy from "../landing/CarPartsSection/SortBy";
import PerPageSelector from "../landing/CarPartsSection/PerPageSelector";
import Pagination from "../landing/CarPartsSection/Pagination";

export function CarTable({
  cars,
  onEdit,
  onDelete,
  sortOption,
  onSortChange,
  currentPage,
  onPageChange,
  perPage,
  onPerPageChange,
  totalPages,
}: {
  cars: Car[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  sortOption: string;
  onSortChange: (val: string) => void;
  currentPage: number;
  onPageChange: (p: number) => void;
  perPage: number;
  onPerPageChange: (val: number) => void;
  totalPages: number;
}) {
  return (
    <div className="space-y-6">
      <div className="flex-col gap-4 md:flex-row md:justify-between">
        <SortBy onChange={onSortChange} />
        <PerPageSelector perPage={perPage} onChange={onPerPageChange} />
      </div>

      <div className="bg-card-car overflow-auto rounded-xl border border-[rgba(212,175,55,0.3)] shadow backdrop-blur">
        <table className="text-foreground w-full min-w-[800px] text-left text-sm">
          <thead className="bg-[rgba(212,175,55,0.05)] text-[var(--accent-gold)]">
            <tr>
              <th className="px-4 py-3">Car</th>
              <th className="px-4 py-3">Make</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Fuel</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr
                key={car.id}
                className="border-t border-[rgba(212,175,55,0.1)]"
              >
                <td className="flex items-center gap-3 px-4 py-3">
                  <img
                    src={car.image}
                    alt={car.title}
                    className="h-12 w-20 rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-semibold">{car.title}</div>
                  </div>
                </td>
                <td className="px-4 py-3">{car.make}</td>
                <td className="px-4 py-3">{car.model}</td>
                <td className="px-4 py-3">{car.year}</td>
                <td className="px-4 py-3">{car.fuelType}</td>
                <td className="px-4 py-3">${car.price}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${car.statusColor}`}
                  >
                    {car.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onEdit(car.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => onDelete(car.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
