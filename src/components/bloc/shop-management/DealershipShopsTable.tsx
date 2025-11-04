// src/components/blocs/dealership-shops/DealershipShopsTable.tsx
"use client";

import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { TemplatePagination } from "@/common/components/pagination/components/template-pagination";
import { usePagination } from "@/common/components/pagination/hooks/use-pagination";
import Image from "next/image";
import { Check, X, Loader2 } from "lucide-react";

interface DealershipShopsTableProps {
  searchValue: string;
}

export const DealershipShopsTable: React.FC<DealershipShopsTableProps> = ({
  searchValue,
}) => {
  const { paginationStates } = usePagination();
  const utils = api.useUtils();

  const { data, isLoading } = api.shop.getDealerShops.useQuery({
    page: paginationStates.currentPage,
    pageSize: paginationStates.itemsPerPage,
    search: searchValue,
  });

  const update = api.shop.updateStatus.useMutation({
    onSuccess: () => utils.shop.invalidate(),
  });

  if (isLoading)
    return <p className="text-center">Loading incoming part orders...</p>;

  const shops = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="bg-card-car overflow-hidden rounded-xl border border-[rgba(212,175,55,0.3)]">
        <table className="w-full">
          <thead className="bg-[rgba(212,175,55,0.05)]">
            <tr>
              <th className="px-4 py-3 text-left text-(--accent-gold)">
                Client
              </th>
              <th className="px-4 py-3 text-left text-(--accent-gold)">Part</th>
              <th className="px-4 py-3 text-left text-(--accent-gold)">Date</th>
              <th className="px-4 py-3 text-left text-(--accent-gold)">
                Status
              </th>
              <th className="px-4 py-3 text-left text-(--accent-gold)">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop) => (
              <tr
                key={shop.id}
                className="border-t border-[rgba(212,175,55,0.1)] hover:bg-[rgba(212,175,55,0.02)]"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={shop.user.image ?? "/avatar.png"}
                      alt="client"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="font-medium">{shop.user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p>{shop.part.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {shop.part.price} DT
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {new Date(shop.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      shop.status === "confirmed"
                        ? "bg-green-500/20 text-green-400"
                        : shop.status === "cancelled"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {shop.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {shop.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          update.mutate({ id: shop.id, status: "confirmed" })
                        }
                        disabled={update.isPending}
                      >
                        {update.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          update.mutate({ id: shop.id, status: "cancelled" })
                        }
                        disabled={update.isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data?.meta && <TemplatePagination meta={data.meta} />}
    </div>
  );
};
