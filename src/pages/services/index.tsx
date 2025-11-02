import { PaginationContextProvider } from "@/common/components/pagination/context/pagination.context";
import GarageGrid from "@/components/bloc/landing/garage/GarageGrid";
import { LandingLayout } from "@/layouts/landing-layout";
import React from "react";

const GrageServices = () => {
  return (
    <LandingLayout>
      <PaginationContextProvider ressourcesName="Type">
        <GarageGrid />
      </PaginationContextProvider>
    </LandingLayout>
  );
};
export default GrageServices;
