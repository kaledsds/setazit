// components/blocs/car-management/CarHeaderWithModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function CarHeaderWithModal({ onAddCar }: { onAddCar: () => void }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-[var(--accent-gold)]">
        🚗 Car Management
      </h2>
      <Button
        onClick={onAddCar}
        className="bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-gold-light)] text-black shadow-md hover:scale-105"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Car
      </Button>
    </div>
  );
}
