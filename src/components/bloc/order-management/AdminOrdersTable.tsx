// src/components/blocs/admin-orders/AdminOrdersTable.tsx
"use client";

import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { TemplatePagination } from "@/common/components/pagination/components/template-pagination";
import { usePagination } from "@/common/components/pagination/hooks/use-pagination";
import Image from "next/image";
import { Check, X, Loader2, Shield } from "lucide-react";

interface AdminOrdersTableProps {
  searchValue: string;
}

export const AdminOrdersTable: React.FC<AdminOrdersTableProps> = ({
  searchValue,
}) => {
  const { paginationStates } = usePagination();
  const utils = api.useUtils();

  const { data, isLoading } = api.order.getAll.useQuery({
    page: paginationStates.currentPage,
    pageSize: paginationStates.itemsPerPage,
    search: searchValue,
  });

  const updateStatus = api.order.updateStatus.useMutation({
    onSuccess: () => utils.order.invalidate(),
  });

  if (isLoading) return <p className="text-center">Loading all orders...</p>;

  const orders = data?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Shield className="h-8 w-8 text-(--accent-gold)" />
        <h1 className="text-3xl font-bold text-(--accent-gold)">
          Admin: All Orders
        </h1>
      </div>

      {/* Table */}
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
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-muted-foreground py-10 text-center"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-[rgba(212,175,55,0.1)] hover:bg-[rgba(212,175,55,0.02)]"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={order.user.image ?? "/avatar.png"}
                        alt="client"
                        width={36}
                        height={36}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium">{order.user.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {order.user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium">
                      {order.car.dealership.name}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p>
                      {order.car.brand} {order.car.model}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {order.car.price} DT
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        order.status === "confirmed"
                          ? "bg-green-500/20 text-green-400"
                          : order.status === "cancelled"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {order.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() =>
                            updateStatus.mutate({
                              id: order.id,
                              status: "confirmed",
                            })
                          }
                          disabled={updateStatus.isPending}
                        >
                          {updateStatus.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updateStatus.mutate({
                              id: order.id,
                              status: "cancelled",
                            })
                          }
                          disabled={updateStatus.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data?.meta && <TemplatePagination meta={data.meta} />}
    </div>
  );
};
