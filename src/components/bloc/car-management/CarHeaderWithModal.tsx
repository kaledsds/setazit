// components/blocs/car-management/CarHeaderWithModal.tsx
"use client";

import { AddCarModal } from "./AddCarModal";

export const CarHeaderWithModal = () => {
  return (
    <div className="mb-6 flex items-center justify-between p-2">
      <h2 className="text-[var(--accent-gold) text-2xl font-bold">
        🚗 Car Management
      </h2>
      <AddCarModal />
    </div>
  );
};
