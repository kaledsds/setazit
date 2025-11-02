// src/components/blocs/shop-management/ShopStats.tsx
import { api } from "@/utils/api";
import { Card } from "@/components/ui/card";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

export const ShopStats = () => {
  const { data, isLoading } = api.shop.getStats.useQuery();

  if (isLoading) return <div>Chargement...</div>;

  const stats = [
    {
      label: "Total",
      value: data?.total ?? 0,
      icon: Package,
      color: "text-blue-500",
    },
    {
      label: "En attente",
      value: data?.pending ?? 0,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      label: "Confirmées",
      value: data?.confirmed ?? 0,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      label: "Annulées",
      value: data?.cancelled ?? 0,
      icon: XCircle,
      color: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="bg-card-car border border-[rgba(212,175,55,0.3)] p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
              <p className="text-foreground text-2xl font-bold">{stat.value}</p>
            </div>
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
          </div>
        </Card>
      ))}
    </div>
  );
};
