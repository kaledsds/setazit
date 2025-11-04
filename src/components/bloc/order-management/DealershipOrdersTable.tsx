// src/components/blocs/dealership-orders/DealershipOrdersTable.tsx
"use client";

import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { TemplatePagination } from "@/common/components/pagination/components/template-pagination";
import { usePagination } from "@/common/components/pagination/hooks/use-pagination";
import Image from "next/image";
import { Check, X, Loader2 } from "lucide-react";

interface DealershipOrderTableProps {
  searchValue: string;
}

export const DealershipOrdersTable: React.FC<DealershipOrderTableProps> = ({
  searchValue,
}) => {
  const { paginationStates } = usePagination();
  const utils = api.useUtils();

  const { data, isLoading } = api.order.getDealerOrders.useQuery({
    page: paginationStates.currentPage,
    pageSize: paginationStates.itemsPerPage,
    search: searchValue,
  });

  const confirm = api.order.updateStatus.useMutation({
    onSuccess: () => utils.order.invalidate(),
  });

  if (isLoading) return <p className="text-center">Loading orders...</p>;

  const orders = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="bg-card-car overflow-hidden rounded-xl border border-[rgba(212,175,55,0.3)]">
        <table className="w-full">
          <thead className="bg-[rgba(212,175,55,0.05)]">
            <tr>
              <th className="px-4 py-3 text-left text-(--accent-gold)">
                Client
              </th>
              <th className="px-4 py-3 text-left text-(--accent-gold)">Car</th>
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
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t border-[rgba(212,175,55,0.1)]"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={order.user.image ?? "/avatar.png"}
                      alt="user"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="font-medium">{order.user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p>
                      {order.car.brand} {order.car.model}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {order.car.price} DT
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      order.status === "confirmed"
                        ? "bg-green-500/20 text-green-400"
                        : order.status === "cancelled"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {order.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          confirm.mutate({ id: order.id, status: "confirmed" })
                        }
                        disabled={confirm.isPending}
                      >
                        {confirm.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          confirm.mutate({ id: order.id, status: "cancelled" })
                        }
                        disabled={confirm.isPending}
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
