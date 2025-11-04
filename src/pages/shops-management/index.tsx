// src/app/dashboard/shop/page.tsx
import { Card } from "@/components/ui/card";
import { MainLayout } from "@/layouts/main-layout";
import { useState } from "react";
import { SearchBar } from "@/common/components/pagination/search-bar";
import { PaginationContextProvider } from "@/common/components/pagination/context/pagination.context";
import { ShopTable } from "@/components/bloc/shop-management/ShopTable";
import { useSession } from "next-auth/react";
import type { Session } from "@prisma/client";
import { DealershipShopsTable } from "@/components/bloc/shop-management/DealershipShopsTable";
import { AdminShopsTable } from "@/components/bloc/shop-management/AdminShopsTable";

type Role = "ADMIN" | "DEALERSHIP" | "CLIENT" | null;

export default function ShopPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const role = (session as unknown as Session)?.sessionType as Role;

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
              {role === "CLIENT" ? (
                <ShopTable searchValue={searchTerm} />
              ) : role === "DEALERSHIP" ? (
                <DealershipShopsTable searchValue={searchTerm} />
              ) : role === "ADMIN" ? (
                <AdminShopsTable searchValue={searchTerm} />
              ) : null}
            </PaginationContextProvider>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
