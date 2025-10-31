import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "@/utils/api";
import type { Session } from "@prisma/client";

interface SessionTypeGuardProps {
  children: React.ReactNode;
}

export function SessionTypeGuard({ children }: SessionTypeGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Extract sessionType safely
  const sessionType = (session as unknown as Session)?.sessionType as
    | "CLIENT"
    | "DEALERSHIP"
    | undefined;

  // Fetch dealership only when needed
  const {
    data: dealership,
    isLoading: dealershipLoading,
    isPending,
  } = api.dealership.getMy.useQuery(undefined, {
    // enabled: sessionType === "DEALERSHIP",
    retry: false,
  });

  useEffect(() => {
    if (status === "loading" || dealershipLoading || isPending) return;

    // No session → redirect to home
    if (!session) {
      void router.push("/");
      return;
    }

    // Dealership user logic
    if (sessionType === "DEALERSHIP") {
      if (!dealership) {
        void router.push("/dealership-setup");
      }

      return;
    }
  }, [
    status,
    session,
    sessionType,
    dealership,
    dealershipLoading,
    router,
    isPending,
  ]);

  // Loading state
  if (
    status === "loading" ||
    dealershipLoading ||
    isPending ||
    (sessionType === "DEALERSHIP" && !sessionType)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
          <p className="text-yellow-500">Chargement...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
