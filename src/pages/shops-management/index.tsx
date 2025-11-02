// src/app/dashboard/shop/page.tsx
import { Card } from "@/components/ui/card";
import { MainLayout } from "@/layouts/main-layout";
import { useState } from "react";
import { SearchBar } from "@/common/components/pagination/search-bar";
import { PaginationContextProvider } from "@/common/components/pagination/context/pagination.context";
import { ShopTable } from "@/components/bloc/shop-management/ShopTable";

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-7xl">
          <Card className="mb-6 border-0 bg-transparent">
            <h2 className="mb-4 text-2xl font-bold text-(--accent-gold)">
              Mes Commandes de Pièces
            </h2>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </Card>

          {/* <ShopStats /> */}

          <div className="mt-8">
            <PaginationContextProvider ressourcesName="shop">
              <ShopTable searchValue={searchTerm} />
            </PaginationContextProvider>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
