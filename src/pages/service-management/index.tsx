import { Card } from "@/components/ui/card";
import { MainLayout } from "@/layouts/main-layout";
import { useState } from "react";
import { SearchBar } from "@/common/components/pagination/search-bar";
import { PaginationContextProvider } from "@/common/components/pagination/context/pagination.context";
import { GarageTable } from "@/components/bloc/garage-management/GarageTable";
import { GarageHeaderWithModal } from "@/components/bloc/garage-management/GarageHeaderWithModal";

export default function GarageManagementPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <div className="mx-auto">
          <Card className="mb-6 border-0 bg-transparent">
            <GarageHeaderWithModal />
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </Card>
          <PaginationContextProvider ressourcesName="Garage">
            <GarageTable searchValue={searchTerm} />
          </PaginationContextProvider>
        </div>
      </div>
    </MainLayout>
  );
}
