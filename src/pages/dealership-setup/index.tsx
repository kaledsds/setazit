import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/utils/api";
import {
  dealershipInputSchema,
  type dealershipInputSchemaType,
} from "@/validation/dealership/dealershipInputSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function DealershipSetup() {
  const router = useRouter();
  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<dealershipInputSchemaType>({
    resolver: zodResolver(dealershipInputSchema),
    defaultValues: {
      name: "",
      address: "",
      nature: "",
      phone: "",
      email: "",
      image: "",
    },
  });

  const createDealershipMutation = api.dealership.create.useMutation({
    onSuccess: async () => {
      toast.success("Concessionnaire créé avec succès!");
      await utils.dealership.invalidate();
      void router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la création");
    },
  });

  const onSubmit = (data: dealershipInputSchemaType) => {
    createDealershipMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-yellow-500">
            Configuration du Concessionnaire
          </h1>
          <p className="mt-2 text-gray-300">
            Complétez les informations de votre concessionnaire
          </p>
        </div>

        <div className="bg-card-car rounded-2xl border border-[rgba(212,175,55,0.3)] p-8 backdrop-blur">
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-yellow-500">
                Nom du Concessionnaire *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: Auto Premium"
                className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)]"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Nature */}
            <div className="space-y-2">
              <Label htmlFor="nature" className="text-yellow-500">
                Nature de l&apos;activité *
              </Label>
              <Input
                id="nature"
                type="text"
                placeholder="Ex: Vente de voitures neuves et occasions"
                className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)]"
                {...register("nature")}
              />
              {errors.nature && (
                <p className="text-sm text-red-500">{errors.nature.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-yellow-500">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@autopremium.com"
                className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)]"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-yellow-500">
                Téléphone *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Ex: +216 12 345 678"
                className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)]"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-yellow-500">
                Adresse *
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="Ex: 123 Avenue Habib Bourguiba, Tunis"
                className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)]"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-yellow-500">
                Image/Logo URL (optionnel)
              </Label>
              <Input
                id="image"
                type="url"
                placeholder="https://..."
                className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)]"
                {...register("image")}
              />
              {errors.image && (
                <p className="text-sm text-red-500">{errors.image.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={createDealershipMutation.isPending}
              className="w-full rounded-full bg-linear-to-r from-yellow-500 to-yellow-600 py-6 text-lg font-semibold text-black transition hover:scale-105"
            >
              {createDealershipMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Création en cours...
                </>
              ) : (
                "Créer mon Concessionnaire"
              )}
            </Button>
          </div>

          <div className="mt-6 border-t border-[rgba(212,175,55,0.3)] pt-4 text-center">
            <p className="text-xs text-gray-400">
              * Tous les champs sont obligatoires
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
