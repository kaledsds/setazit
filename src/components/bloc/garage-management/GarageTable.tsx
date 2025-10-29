import { api } from "@/utils/api";
import React from "react";
import { usePagination } from "@/common/components/pagination/hooks/use-pagination";
import { TemplatePagination } from "@/common/components/pagination/components/template-pagination";
import { useSession } from "next-auth/react";
import { EditGarageModal } from "./EditGarageModal";
import { DeleteGarageModal } from "./DeleteGarageModal";
import Image from "next/image";

interface GarageTableProps {
  searchValue: string;
}

export const GarageTable: React.FC<GarageTableProps> = ({ searchValue }) => {
  const { status } = useSession();
  const { paginationStates, paginationSetStates } = usePagination();

  const { data, isLoading, error } = api.garage.getMyGarages.useQuery(
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
      <div className="text-center text-(--accent-gold)">
        Loading garages...
      </div>
    );
  if (error)
    return (
      <div className="text-center text-(--accent-gold)">
        Error: {error.message}
      </div>
    );

  const garages = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="bg-card-car overflow-auto rounded-xl border border-[rgba(212,175,55,0.3)] shadow backdrop-blur">
        <table className="text-foreground w-full min-w-[800px] text-left text-sm">
          <thead className="bg-[rgba(212,175,55,0.05)] text-(--accent-gold)">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Adresse</th>
              <th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">Services</th>
              <th className="px-4 py-3">Disponibilité</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {garages.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-(--accent-gold)"
                >
                  {searchValue
                    ? "Aucun garage trouvé."
                    : "Aucun garage disponible."}
                </td>
              </tr>
            ) : (
              garages.map((garage) => (
                <tr
                  key={garage.id}
                  className="border-t border-[rgba(212,175,55,0.1)] hover:bg-[rgba(212,175,55,0.02)]"
                >
                  <td className="px-4 py-3">
                    <Image
                      src={garage.image ?? "/placeholder-garage.jpg"}
                      alt={garage.name}
                      width={80}
                      height={48}
                      className="h-12 w-20 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold">{garage.name}</td>
                  <td className="px-4 py-3">{garage.address}</td>
                  <td className="px-4 py-3">{garage.phone}</td>
                  <td className="px-4 py-3">{garage.services}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${garage.availability ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                    >
                      {garage.availability ? "Disponible" : "Indisponible"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <EditGarageModal garage={garage} />
                      <DeleteGarageModal
                        garageId={garage.id}
                        garageName={garage.name}
                      />
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
