import { Card } from "@/components/ui/card";
import { MainLayout } from "@/layouts/main-layout";
import { useState } from "react";
import { SearchBar } from "@/common/components/pagination/search-bar";
import { PaginationContextProvider } from "@/common/components/pagination/context/pagination.context";
import { OrderTable } from "@/components/bloc/order-management/OrderTable";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <div className="mx-auto">
          <Card className="mb-6 border-0 bg-transparent">
            <h2 className="mb-4 text-2xl font-bold text-(--accent-gold)">
              Mes Commandes
            </h2>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </Card>
          <PaginationContextProvider ressourcesName="Order">
            <OrderTable searchValue={searchTerm} />
          </PaginationContextProvider>
        </div>
      </div>
    </MainLayout>
  );
}
