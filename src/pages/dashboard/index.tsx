import React, { useState } from "react";

import { MainLayout } from "@/layouts/main-layout";
import CarGrid from "@/components/bloc/landing/cars/CarGrid";
import { useSession } from "next-auth/react";
import { PaginationContextProvider } from "@/common/components/pagination/context/pagination.context";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        <PaginationContextProvider ressourcesName="Type">
          <CarGrid />
        </PaginationContextProvider>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
