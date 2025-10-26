import { Card } from "@/components/ui/card";

import type { Car } from "@/types/car";
import { MainLayout } from "@/layouts/main-layout";
import { CarTable } from "@/components/bloc/car-management/CarTable";
import CarFilterSection from "@/components/bloc/car-management/CarFilterSection";
import { useState } from "react";
import { SearchBar } from "@/common/components/pagination/search-bar";
import { PaginationContextProvider } from "@/common/components/pagination/context/pagination.context";
import { CarHeaderWithModal } from "@/components/bloc/car-management/CarHeaderWithModal";

export default function CarManagementPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <div className="mx-auto">
          <Card className="mb-6 border-0 bg-transparent">
            <CarHeaderWithModal />
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </Card>
          <PaginationContextProvider ressourcesName="Type">
            <CarTable searchValue={searchTerm} />
          </PaginationContextProvider>
        </div>
      </div>
    </MainLayout>
  );
}
