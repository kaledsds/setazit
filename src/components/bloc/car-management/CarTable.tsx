import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import React from "react";
import { usePagination } from "@/common/components/pagination/hooks/use-pagination";
import { TemplatePagination } from "@/common/components/pagination/components/template-pagination";
import { useSession } from "next-auth/react";

interface CarTableProps {
  searchValue: string;
}

export const CarTable: React.FC<CarTableProps> = ({ searchValue }) => {
  const { data: session, status } = useSession(); // Move this up before using it
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
    console.error("Car fetch error:", error); // Add client-side logging
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
      <div className="flex-col gap-4 md:flex-row md:justify-between"></div>

      <div className="bg-card-car overflow-auto rounded-xl border border-[rgba(212,175,55,0.3)] shadow backdrop-blur">
        <table className="text-foreground w-full min-w-[800px] text-left text-sm">
          <thead className="bg-[rgba(212,175,55,0.05)] text-(--accent-gold)">
            <tr>
              <th className="px-4 py-3">Car</th>
              <th className="px-4 py-3">Make</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Fuel</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars?.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-8 text-center text-(--accent-gold)"
                >
                  {searchValue.trim()
                    ? "No cars found matching your search."
                    : "No cars available."}
                </td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr
                  key={car.id}
                  className="border-t border-[rgba(212,175,55,0.1)]"
                >
                  <td className="flex items-center gap-3 px-4 py-3">
                    <img
                      // src={car.image}
                      alt={car.brand}
                      className="h-12 w-20 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-semibold">{car.brand}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{car.brand}</td>
                  <td className="px-4 py-3">{car.model}</td>
                  <td className="px-4 py-3">{car.year}</td>
                  <td className="px-4 py-3">{car.price}</td>
                  <td className="px-4 py-3">${car.price}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${car.color || "bg-gray-200"}`}
                    >
                      {car.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        // onClick={() => onEdit(car.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
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
