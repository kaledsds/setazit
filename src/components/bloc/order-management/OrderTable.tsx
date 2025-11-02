import { api } from "@/utils/api";
import React from "react";
import { usePagination } from "@/common/components/pagination/hooks/use-pagination";
import { TemplatePagination } from "@/common/components/pagination/components/template-pagination";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface OrderTableProps {
  searchValue: string;
}

export const OrderTable: React.FC<OrderTableProps> = ({ searchValue }) => {
  const { status } = useSession();
  const { paginationStates, paginationSetStates } = usePagination();

  const { data, isLoading, error } = api.order.getMyOrders.useQuery(
    {
      page: paginationStates.currentPage,
      pageSize: paginationStates.itemsPerPage,
      search: searchValue,
    },
    {
      enabled: status === "authenticated",
    },
  );

  React.useEffect(() => {
    if (searchValue) paginationSetStates.setCurrentPage(1);
  }, [searchValue, paginationSetStates]);

  if (status === "loading") return <div>Chargement...</div>;
  if (status === "unauthenticated") return <div>Veuillez vous connecter</div>;
  if (isLoading)
    return (
      <div className="text-center text-(--accent-gold)">Chargement...</div>
    );
  if (error)
    return (
      <div className="text-center text-red-500">Erreur: {error.message}</div>
    );

  const orders = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="bg-card-car overflow-auto rounded-xl border border-[rgba(212,175,55,0.3)] shadow backdrop-blur">
        <table className="text-foreground w-full min-w-[800px] text-left text-sm">
          <thead className="bg-[rgba(212,175,55,0.05)] text-(--accent-gold)">
            <tr>
              <th className="px-4 py-3">Voiture</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-(--accent-gold)"
                >
                  Aucune commande trouvée.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-[rgba(212,175,55,0.1)] hover:bg-[rgba(212,175,55,0.02)]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={order.car.image ?? "/placeholder-car.jpg"}
                        alt={order.car.brand}
                        width={60}
                        height={40}
                        className="h-10 w-14 rounded object-cover"
                      />
                      <div>
                        <p className="font-semibold">
                          {order.car.brand} {order.car.model}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {order.car.year}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(order.date).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        order.status === "confirmed"
                          ? "bg-green-500/20 text-green-400"
                          : order.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {order.status === "pending"
                        ? "En attente"
                        : order.status === "confirmed"
                          ? "Confirmée"
                          : order.status === "cancelled"
                            ? "Annulée"
                            : order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-card-car rounded-xl border border-[rgba(212,175,55,0.3)] shadow backdrop-blur">
        <TemplatePagination meta={meta} />
      </div>
    </div>
  );
};
