import { Card } from "@/components/ui/card";
import { MainLayout } from "@/layouts/main-layout";
import { useState } from "react";
import { SearchBar } from "@/common/components/pagination/search-bar";
import { PaginationContextProvider } from "@/common/components/pagination/context/pagination.context";
import { PartHeaderWithModal } from "@/components/bloc/part-management/PartHeaderWithModal";
import { PartTable } from "@/components/bloc/part-management/PartTable";

export default function PartManagementPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <div className="mx-auto">
          <Card className="mb-6 border-0 bg-transparent">
            <PartHeaderWithModal />
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </Card>
          <PaginationContextProvider ressourcesName="Part">
            <PartTable searchValue={searchTerm} />
          </PaginationContextProvider>
        </div>
      </div>
    </MainLayout>
  );
}
