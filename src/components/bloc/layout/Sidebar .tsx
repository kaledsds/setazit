"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Wrench,
  Plane,
  User,
  LogOut,
  PackageCheck,
  AlignLeft,
  Truck,
  CalendarDays,
  X,
  Cog,
  Car,
  Drill,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Parts", href: "/parts", icon: Cog },
  { name: "Services", href: "/service", icon: Wrench },
  { name: "Profile", href: "/profile", icon: User },
  {
    name: "Cars Management",
    href: "/car-management",
    icon: Car,
  },
  {
    name: "Parts Management",
    href: "/parts-management",
    icon: PackageCheck,
  },
  {
    name: "Service Management",
    href: "/service-management",
    icon: Drill,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside
      className={clsx(
        "sticky top-0 hidden max-h-screen flex-col transition-all duration-300 md:flex",
        collapsed ? "w-16" : "w-60",
        "bg-card-car border-r border-[rgba(212,175,55,0.3)] shadow-xl backdrop-blur",
      )}
    >
      {/* Header with logo and toggle */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <span className="text-xl font-bold text-[var(--accent-gold)]">
            Setazit
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground hover:bg-[rgba(212,175,55,0.1)]"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <AlignLeft /> : <X />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            className={clsx(
              "text-foreground flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
              "hover:bg-[rgba(212,175,55,0.1)] hover:text-[var(--accent-gold)]",
            )}
          >
            <Icon className="h-5 w-5" />
            {!collapsed && <span>{name}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <Button
        variant="ghost"
        className="text-foreground m-4 flex items-center gap-2 text-sm hover:bg-[rgba(212,175,55,0.1)]"
      >
        <LogOut className="h-4 w-4" />
        {!collapsed && "Logout"}
      </Button>
    </aside>
  );
}
