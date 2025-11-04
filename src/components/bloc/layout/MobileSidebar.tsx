"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Menu,
  LayoutDashboard,
  Wrench,
  User,
  LogOut,
  Car,
  Package,
  Drill,
  PackageCheck,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type Role = "admin" | "dealership" | "client" | null;

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MENU_BY_ROLE: Record<NonNullable<Role>, NavItem[]> = {
  admin: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Cars", href: "/cars", icon: Car },
    { name: "Parts", href: "/parts", icon: Package },
    { name: "Garages", href: "/garages", icon: Wrench },
    { name: "Orders", href: "/orders", icon: PackageCheck },
    { name: "Shops", href: "/shops", icon: Package },
    { name: "Profile", href: "/profile", icon: User },
  ],
  dealership: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Cars", href: "/car-management", icon: Car },
    { name: "My Parts", href: "/parts-management", icon: Package },
    { name: "My Garages", href: "/service-management", icon: Drill },
    { name: "Orders", href: "/orders", icon: PackageCheck },
    { name: "Shops", href: "/shops", icon: Package },
    { name: "Profile", href: "/profile", icon: User },
  ],
  client: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Cars", href: "/cars", icon: Car },
    { name: "Parts", href: "/parts", icon: Package },
    { name: "Garages", href: "/garages", icon: Wrench },
    { name: "My Orders", href: "/orders", icon: PackageCheck },
    { name: "My Shops", href: "/shops", icon: Package },
    { name: "Profile", href: "/profile", icon: User },
  ],
};

export default function MobileSidebar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  const role = session?.user?.role as Role;
  const navItems = role ? (MENU_BY_ROLE[role] ?? []) : [];

  const handleLinkClick = () => setOpen(false);

  if (status === "loading") {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Open menu"
            className="bg-card-car border-[rgba(212,175,55,0.3)] hover:bg-[rgba(212,175,55,0.1)]"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="bg-card-car w-64 border-r border-[rgba(212,175,55,0.3)] p-0 shadow-xl backdrop-blur"
        >
          {/* Logo */}
          <div className="border-b border-[rgba(212,175,55,0.2)] p-6">
            <h2 className="text-2xl font-bold text-(--accent-gold)">Setazit</h2>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 p-4">
            {navItems.map(({ name, href, icon: Icon }) => (
              <Link
                key={name}
                href={href}
                onClick={handleLinkClick}
                className="text-foreground flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition hover:bg-[rgba(212,175,55,0.1)] hover:text-(--accent-gold)"
              >
                <Icon className="h-5 w-5" />
                <span>{name}</span>
              </Link>
            ))}

            {/* Logout */}
            <form action="/api/auth/signout" method="post" className="mt-6">
              <Button
                type="submit"
                variant="ghost"
                className="text-foreground w-full justify-start gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-[rgba(212,175,55,0.1)] hover:text-(--accent-gold)"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </form>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
