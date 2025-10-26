import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import React from "react";
import { usePagination } from "@/common/components/pagination/hooks/use-pagination";
import { TemplatePagination } from "@/common/components/pagination/components/template-pagination";
import { useSession } from "next-auth/react";
import { EditCarModal } from "./EditCarModal";

interface CarTableProps {
  searchValue: string;
}

export const CarTable: React.FC<CarTableProps> = ({ searchValue }) => {
  const { data: session, status } = useSession();
  const { paginationStates, paginationSetStates } = usePagination();

  const { data, isLoading, error } = api.car.getMycars.useQuery(
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

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Please sign in to view cars</div>;
  }

  if (isLoading) {
    return (
      <div className="bg-card-car overflow-auto rounded-xl border border-[rgba(212,175,55,0.3)] shadow backdrop-blur">
        <div className="text-center text-(--accent-gold)">Loading cars...</div>
      </div>
    );
  }

  if (error) {
    console.error("Car fetch error:", error);
    return (
      <div className="bg-card-car overflow-auto rounded-xl border border-[rgba(212,175,55,0.3)] shadow backdrop-blur">
        <div className="text-center text-(--accent-gold)">
          Error: {error.message || "Failed to load cars"}
        </div>
      </div>
    );
  }

  const cars = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="bg-card-car overflow-auto rounded-xl border border-[rgba(212,175,55,0.3)] shadow backdrop-blur">
        <table className="text-foreground w-full min-w-[800px] text-left text-sm">
          <thead className="bg-[rgba(212,175,55,0.05)] text-(--accent-gold)">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Marque</th>
              <th className="px-4 py-3">Modèle</th>
              <th className="px-4 py-3">Année</th>
              <th className="px-4 py-3">Couleur</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Disponibilité</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars?.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-8 text-center text-(--accent-gold)"
                >
                  {searchValue.trim()
                    ? "Aucune voiture trouvée correspondant à votre recherche."
                    : "Aucune voiture disponible."}
                </td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr
                  key={car.id}
                  className="border-t border-[rgba(212,175,55,0.1)] hover:bg-[rgba(212,175,55,0.02)]"
                >
                  <td className="px-4 py-3">
                    <img
                      src={car.image || "/placeholder-car.jpg"}
                      alt={`${car.brand} ${car.model}`}
                      className="h-12 w-20 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold">{car.brand}</td>
                  <td className="px-4 py-3">{car.model}</td>
                  <td className="px-4 py-3">{car.year}</td>
                  <td className="px-4 py-3">
                    <span className="capitalize">{car.color}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{car.price} DT</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        car.status === "new"
                          ? "bg-green-500/20 text-green-400"
                          : car.status === "used"
                            ? "bg-blue-500/20 text-blue-400"
                            : car.status === "certified"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {car.status === "new"
                        ? "Neuf"
                        : car.status === "used"
                          ? "Occasion"
                          : car.status === "certified"
                            ? "Certifié"
                            : car.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        car.availability
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {car.availability ? "Disponible" : "Indisponible"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <EditCarModal car={car} />
                      <Button
                        size="icon"
                        variant="destructive"
                        // onClick={() => onDelete(car.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
