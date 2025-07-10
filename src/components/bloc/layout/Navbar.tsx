"use client";

import { Bell, LogOut, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "../landing/ThemeToggle";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname() ?? "";

  const getTitle = () => {
    if (pathname.startsWith("/dashboard")) return "Dashboard";
    if (pathname.startsWith("/parts")) return "Cog";
    if (pathname.startsWith("/service")) return "Services";
    if (pathname.startsWith("/Cars-management")) return "My Cars";
    if (pathname.startsWith("/parts-management")) return "My Parts";
    if (pathname.startsWith("/service-management")) return "My Services";
    if (pathname.startsWith("/profile")) return "Profile";
    return "Dashboard";
  };

  return (
    <header className="bg-card-car sticky top-0 z-40 flex items-center justify-between border-b border-[rgba(212,175,55,0.2)] px-6 py-4 shadow-md backdrop-blur">
      <h1 className="hidden text-lg font-semibold text-[var(--accent-gold)] md:block">
        {getTitle()}
      </h1>

      <div className="ml-auto flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="text-foreground hover:bg-[rgba(212,175,55,0.1)]"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Cart"
          className="text-foreground hover:bg-[rgba(212,175,55,0.1)]"
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar.jpg" alt="User" />
                <AvatarFallback>MF</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)] backdrop-blur"
          >
            <DropdownMenuItem className="hover:text-[var(--accent-gold)]">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:text-[var(--accent-gold)]">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Logout clicked")}
              className="hover:text-[var(--accent-gold)]"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
