import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "@/utils/api";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: ("CLIENT" | "DEALERSHIP")[];
  requireDealership?: boolean;
}

export function RoleGuard({ 
  children, 
  allowedRoles,
  requireDealership = false 
}: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Fetch user's dealership if they're a dealership owner
  const { data: dealership, isLoading: dealershipLoading } = api.dealership.getMy.useQuery(
    undefined,
    {
      enabled: session?.user?.role === "DEALERSHIP",
      retry: false,
    }
  );

  useEffect(() => {
    if (status === "loading") return;

    // Not authenticated - redirect to sign in
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    // User has no role - redirect to role selection
    if (!session?.user?.role) {
      router.push("/role-selection");
      return;
    }

    // Check if user's role is allowed
    if (allowedRoles && !allowedRoles.includes(session.user.role as any)) {
      router.push("/unauthorized");
      return;
    }

    // If dealership is required but doesn't exist, redirect to setup
    if (
      requireDealership && 
      session?.user?.role === "DEALERSHIP" && 
      !dealershipLoading && 
      !dealership
    ) {
      router.push("/dealership/setup");
      return;
    }
  }, [status, session, dealership, dealershipLoading, router, allowedRoles, requireDealership]);

  // Show loading state
  if (status === "loading" || (session?.user?.role === "DEALERSHIP" && dealershipLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent mx-auto"></div>
          <p className="text-yellow-500">Chargement...</p>
        </div>
      </div>
    );
  }

  // User is not authenticated or doesn't have the right role
  if (
    status === "unauthenticated" || 
    !session?.user?.role ||
    (allowedRoles && !allowedRoles.includes(session.user.role as any)) ||
    (requireDealership && session?.user?.role === "DEALERSHIP" && !dealership)
  ) {
    return null;
  }

  return <>{children}</>;
}