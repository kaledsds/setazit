import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, User } from "lucide-react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import AuthGuard from "@/layouts/auth-guard";
import { api } from "@/utils/api";

export default function SessionTypeSelection() {
  const router = useRouter();
  const { data: session, update } = useSession();

  const setSessionType = api.session.setSessionType.useMutation({
    onSuccess: async () => {
      await update();
      void router.push("/dashboard");
    },
  });

  return (
    <AuthGuard>
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black p-6">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-yellow-500">
              Bienvenue, {session?.user?.name ?? "Utilisateur"}!
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Choisissez votre rôle pour continuer
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Client Card */}
            <Card className="bg-card-car border-[rgba(212,175,55,0.3)] backdrop-blur transition hover:scale-105 hover:border-yellow-500/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/20">
                  <User className="h-10 w-10 text-blue-400" />
                </div>
                <CardTitle className="text-2xl text-yellow-500">
                  Client
                </CardTitle>
                <CardDescription className="text-foreground">
                  Parcourez et achetez des voitures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Rechercher des véhicules
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Réserver des voitures
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Gérer vos commandes
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Laisser des avis
                  </li>
                </ul>
                <Button
                  onClick={() =>
                    setSessionType.mutate({ sessionType: "CLIENT" })
                  }
                  className="w-full rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"
                >
                  Continuer en tant que Client
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card-car border-[rgba(212,175,55,0.3)] backdrop-blur transition hover:scale-105 hover:border-yellow-500/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/20">
                  <Building2 className="h-10 w-10 text-yellow-500" />
                </div>
                <CardTitle className="text-2xl text-yellow-500">
                  Concessionnaire
                </CardTitle>
                <CardDescription className="text-foreground">
                  Vendez et gérez vos voitures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Gérer votre inventaire
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Ajouter des véhicules
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Suivre les commandes
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Analyser les performances
                  </li>
                </ul>
                <Button
                  onClick={() =>
                    setSessionType.mutate({ sessionType: "DEALERSHIP" })
                  }
                  className="w-full rounded-full bg-linear-to-r from-yellow-500 to-yellow-600 text-black hover:scale-105"
                >
                  Continuer en tant que Concessionnaire
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
