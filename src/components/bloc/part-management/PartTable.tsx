import { api } from "@/utils/api";
import React from "react";
import { usePagination } from "@/common/components/pagination/hooks/use-pagination";
import { TemplatePagination } from "@/common/components/pagination/components/template-pagination";
import { useSession } from "next-auth/react";
import { EditPartModal } from "./EditPartModal";
import { DeletePartModal } from "./DeletePartModal";
import Image from "next/image";

interface PartTableProps {
  searchValue: string;
}

export const PartTable: React.FC<PartTableProps> = ({ searchValue }) => {
  const { status } = useSession();
  const { paginationStates, paginationSetStates } = usePagination();

  const { data, isLoading, error } = api.part.getMyParts.useQuery(
    {
      page: paginationStates.currentPage,
      pageSize: paginationStates.itemsPerPage,
      search: searchValue,
    },
    {
      enabled: status === "authenticated",
      refetchOnWindowFocus: false,
    },
  );

  React.useEffect(() => {
    if (searchValue) {
      paginationSetStates.setCurrentPage(1);
    }
  }, [searchValue, paginationSetStates]);

  if (status === "loading") return <div>Loading session...</div>;
  if (status === "unauthenticated") return <div>Please sign in</div>;
  if (isLoading)
    return (
      <div className="text-center text-(--accent-gold)">Loading parts...</div>
    );
  if (error)
    return (
      <div className="text-center text-(--accent-gold)">
        Error: {error.message}
      </div>
    );

  const parts = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="bg-card-car overflow-auto rounded-xl border border-[rgba(212,175,55,0.3)] shadow backdrop-blur">
        <table className="text-foreground w-full min-w-[800px] text-left text-sm">
          <thead className="bg-[rgba(212,175,55,0.05)] text-(--accent-gold)">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Marque</th>
              <th className="px-4 py-3">Modèle</th>
              <th className="px-4 py-3">État</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Disponibilité</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parts.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-8 text-center text-(--accent-gold)"
                >
                  {searchValue
                    ? "Aucune pièce trouvée."
                    : "Aucune pièce disponible."}
                </td>
              </tr>
            ) : (
              parts.map((part) => (
                <tr
                  key={part.id}
                  className="border-t border-[rgba(212,175,55,0.1)] hover:bg-[rgba(212,175,55,0.02)]"
                >
                  <td className="px-4 py-3">
                    <Image
                      src={part.image ?? "/placeholder-part.jpg"}
                      alt={part.name}
                      width={80}
                      height={48}
                      className="h-12 w-20 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold">{part.name}</td>
                  <td className="px-4 py-3">{part.brand}</td>
                  <td className="px-4 py-3">{part.model}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${part.condition >= 80 ? "bg-green-500/20 text-green-400" : part.condition >= 50 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}
                    >
                      {part.condition}%
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{part.price} DT</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${part.availability ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                    >
                      {part.availability ? "Disponible" : "Indisponible"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <EditPartModal part={part} />
                      <DeletePartModal partId={part.id} partName={part.name} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-card-car overflow-auto rounded-xl border border-[rgba(212,175,55,0.3)] shadow backdrop-blur">
        <TemplatePagination meta={meta} />
      </div>
    </div>
  );
};
