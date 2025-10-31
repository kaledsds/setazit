import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      void router.push("/sign-in");
    }
  }, [router, sessionStatus]);

  if (["loading", "unauthenticated"].includes(sessionStatus)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span>loading...</span>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
