"use client";

import { AddPartModal } from "./AddPartModal";

export const PartHeaderWithModal = () => {
  return (
    <div className="mb-6 flex items-center justify-between p-2">
      <h2 className="text-2xl font-bold text-(--accent-gold)">
        Part Management
      </h2>
      <AddPartModal />
    </div>
  );
};
