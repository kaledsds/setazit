import { PaginationContextProvider } from "@/common/components/pagination/context/pagination.context";
import PartGrid from "@/components/bloc/landing/parts/PartGrid";
import { LandingLayout } from "@/layouts/landing-layout";
import React from "react";

const Cars = () => {
  return (
    <LandingLayout>
      <div className="space-y-6 p-6">
        <PaginationContextProvider ressourcesName="Type">
          <PartGrid />
        </PaginationContextProvider>
      </div>
    </LandingLayout>
  );
};

export default Cars;
