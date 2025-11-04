// src/components/blocs/admin-shops/AdminShopsTable.tsx
"use client";

import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { TemplatePagination } from "@/common/components/pagination/components/template-pagination";
import { usePagination } from "@/common/components/pagination/hooks/use-pagination";
import Image from "next/image";
import { Check, X, Loader2, Shield } from "lucide-react";

interface AdminShopsTableProps {
  searchValue: string;
}

export const AdminShopsTable: React.FC<AdminShopsTableProps> = ({
  searchValue,
}) => {
  const { paginationStates } = usePagination();
  const utils = api.useUtils();

  const { data, isLoading } = api.shop.getAll.useQuery({
    page: paginationStates.currentPage,
    pageSize: paginationStates.itemsPerPage,
    search: searchValue,
  });

  const update = api.shop.updateStatus.useMutation({
    onSuccess: () => utils.shop.invalidate(),
  });

  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center gap-3">
        <Shield className="h-8 w-8 text-(--accent-gold)" />
        <h1 className="text-3xl font-bold text-(--accent-gold)">
          Admin: All Part Orders
        </h1>
      </div>

      <div className="bg-card-car overflow-hidden rounded-xl border border-[rgba(212,175,55,0.3)]">
        <table className="w-full">
          <thead className="bg-[rgba(212,175,55,0.08)]">
            <tr>
              <th className="px-4 py-3 text-left text-(--accent-gold)">
                Client
              </th>
              <th className="px-4 py-3 text-left text-(--accent-gold)">
                Dealership
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
            {data?.data.map((shop) => (
              <tr
                key={shop.id}
                className="border-t border-[rgba(212,175,55,0.1)]"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={shop.user.image ?? "/avatar.png"}
                      alt=""
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">{shop.user.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {shop.user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">{shop.part.dealership.name}</td>
                <td className="px-4 py-4">
                  <p>{shop.part.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {shop.part.price} DT
                  </p>
                </td>
                <td className="px-4 py-4">
                  {new Date(shop.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      shop.status === "confirmed"
                        ? "bg-green-500/20 text-green-400"
                        : shop.status === "cancelled"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {shop.status.toUpperCase()}
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
