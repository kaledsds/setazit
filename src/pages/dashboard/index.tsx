import React from "react";

import { MainLayout } from "@/layouts/main-layout";
import CarGrid from "@/components/bloc/landing/cars/CarGrid";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        <CarGrid />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
