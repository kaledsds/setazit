// src/components/layout/Sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Wrench,
  Cog,
  User,
  LogOut,
  PackageCheck,
  AlignLeft,
  X,
  Car,
  Drill,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import type { Session } from "@prisma/client";

type Role = "ADMIN" | "DEALERSHIP" | "CLIENT" | null;

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// MENU PER ROLE
const MENU_BY_ROLE: Record<NonNullable<Role>, NavItem[]> = {
  ADMIN: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Cars", href: "/cars", icon: Car },
    { name: "Parts", href: "/parts", icon: Cog },
    { name: "Garages", href: "/garages", icon: Wrench },
    { name: "Orders", href: "/orders-management", icon: PackageCheck },
    { name: "Shops", href: "/shops-management", icon: Package },
    { name: "Profile", href: "/profile", icon: User },
  ],
  DEALERSHIP: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Cars", href: "/car-management", icon: Car },
    { name: "My Parts", href: "/parts-management", icon: PackageCheck },
    { name: "My Garages", href: "/service-management", icon: Drill },
    { name: "Orders", href: "/orders-management", icon: PackageCheck },
    { name: "Shops", href: "/shops-management", icon: Package },
    { name: "Profile", href: "/profile", icon: User },
  ],
  CLIENT: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Parts", href: "/parts", icon: Cog },
    { name: "Garages", href: "/garages", icon: Wrench },
    { name: "My Orders", href: "/orders-management", icon: PackageCheck },
    { name: "My Shops", href: "/shops-management", icon: Package },
    { name: "Profile", href: "/profile", icon: User },
  ],
};

export default function Sidebar() {
  const { data: session, status } = useSession();
  const [collapsed, setCollapsed] = useState(true);

  const role = (session as unknown as Session)?.sessionType as Role;
  const navItems = role ? (MENU_BY_ROLE[role] ?? []) : [];

  if (status === "loading") {
    return (
      <aside className="bg-card-car sticky top-0 hidden w-16 flex-col md:flex" />
    );
  }

  return (
    <aside
      className={clsx(
        "sticky top-0 hidden max-h-screen flex-col transition-all duration-300 md:flex",
        collapsed ? "w-16" : "w-60",
        "bg-card-car border-r border-[rgba(212,175,55,0.3)] shadow-xl backdrop-blur",
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <span className="text-xl font-bold text-(--accent-gold)">
            Setazit
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <AlignLeft /> : <X />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {navItems.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            className={clsx(
              "text-foreground flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
              "hover:bg-[rgba(212,175,55,0.1)] hover:text-(--accent-gold)",
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{name}</span>}
          </Link>
        ))}
      </nav>

      <form action="/api/auth/signout" method="post" className="m-4">
        <Button
          type="submit"
          variant="ghost"
          className="text-foreground w-full justify-start gap-2 text-sm hover:bg-[rgba(212,175,55,0.1)]"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "Logout"}
        </Button>
      </form>
    </aside>
  );
}
