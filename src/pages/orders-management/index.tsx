import { Card } from "@/components/ui/card";
import { MainLayout } from "@/layouts/main-layout";
import { useState } from "react";
import { SearchBar } from "@/common/components/pagination/search-bar";
import { PaginationContextProvider } from "@/common/components/pagination/context/pagination.context";
import { OrderTable } from "@/components/bloc/order-management/OrderTable";
import { useSession } from "next-auth/react";
import type { Session } from "@prisma/client";
import { DealershipOrdersTable } from "@/components/bloc/order-management/DealershipOrdersTable";
import { AdminOrdersTable } from "@/components/bloc/order-management/AdminOrdersTable";

type Role = "ADMIN" | "DEALERSHIP" | "CLIENT" | null;

export default function OrdersPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const role = (session as unknown as Session)?.sessionType as Role;

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
            {role === "CLIENT" ? (
              <OrderTable searchValue={searchTerm} />
            ) : role === "DEALERSHIP" ? (
              <DealershipOrdersTable searchValue={searchTerm} />
            ) : role === "ADMIN" ? (
              <AdminOrdersTable searchValue={searchTerm} />
            ) : null}
          </PaginationContextProvider>
        </div>
      </div>
    </MainLayout>
  );
}
