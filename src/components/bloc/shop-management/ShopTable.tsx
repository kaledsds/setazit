// src/components/blocs/shop-management/ShopTable.tsx
import { api } from "@/utils/api";
import React from "react";
import { usePagination } from "@/common/components/pagination/hooks/use-pagination";
import { TemplatePagination } from "@/common/components/pagination/components/template-pagination";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ShopTableProps {
  searchValue: string;
}

export const ShopTable: React.FC<ShopTableProps> = ({ searchValue }) => {
  const { status } = useSession();
  const { paginationStates, paginationSetStates } = usePagination();

  const { data, isLoading, error } = api.shop.getMyShops.useQuery(
    {
      page: paginationStates.currentPage,
      pageSize: paginationStates.itemsPerPage,
      search: searchValue,
    },
    { enabled: status === "authenticated" },
  );

  const utils = api.useUtils();
  const cancelShop = api.shop.cancel.useMutation({
    onSuccess: () => {
      void utils.shop.invalidate();
    },
  });

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

  const shops = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="bg-card-car overflow-auto rounded-xl border border-[rgba(212,175,55,0.3)] shadow backdrop-blur">
        <table className="text-foreground w-full min-w-[800px] text-left text-sm">
          <thead className="bg-[rgba(212,175,55,0.05)] text-(--accent-gold)">
            <tr>
              <th className="px-4 py-3">Pièce</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {shops.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-(--accent-gold)"
                >
                  Aucune commande trouvée.
                </td>
              </tr>
            ) : (
              shops.map((shop) => (
                <tr
                  key={shop.id}
                  className="border-t border-[rgba(212,175,55,0.1)] hover:bg-[rgba(212,175,55,0.02)]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={shop.part.image ?? "/placeholder-part.jpg"}
                        alt={shop.part.name}
                        width={60}
                        height={40}
                        className="h-10 w-14 rounded object-cover"
                      />
                      <div>
                        <p className="font-semibold">{shop.part.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {shop.part.brand} {shop.part.model}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(shop.date).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        shop.status === "confirmed"
                          ? "bg-green-500/20 text-green-400"
                          : shop.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {shop.status === "pending"
                        ? "En attente"
                        : shop.status === "confirmed"
                          ? "Confirmée"
                          : "Annulée"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {shop.status === "pending" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => cancelShop.mutate({ id: shop.id })}
                        disabled={cancelShop.isPending}
                      >
                        {cancelShop.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Annuler"
                        )}
                      </Button>
                    )}
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
