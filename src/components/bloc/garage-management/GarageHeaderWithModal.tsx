"use client";

import { AddGarageModal } from "./AddGarageModal";

export const GarageHeaderWithModal = () => {
  return (
    <div className="mb-6 flex items-center justify-between p-2">
      <h2 className="text-2xl font-bold text-(--accent-gold)">
        Garage Management
      </h2>
      <AddGarageModal />
    </div>
  );
};
