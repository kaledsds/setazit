import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/utils/api";
import {
  partInputSchema,
  type partInputSchemaType,
} from "@/validation/part/partInputSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const AddPartModal = () => {
  const [open, setOpen] = React.useState(false);
  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<partInputSchemaType>({
    resolver: zodResolver(partInputSchema),
    defaultValues: {
      name: "",
      brand: "",
      model: "",
      condition: 100,
      price: "",
      availability: true,
    },
  });

  const createPartMutation = api.part.create.useMutation({
    onSuccess: async () => {
      toast.success("Pièce ajoutée avec succès!");
      await utils.part.invalidate();
      reset();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de l'ajout");
    },
  });

  const onSubmit = (data: partInputSchemaType) => {
    createPartMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2 rounded-lg bg-linear-to-r from-yellow-500 to-yellow-400 p-2 text-black shadow-md transition hover:scale-105">
          <Plus className="h-4 w-4" />
          <span>Ajouter Pièce</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card-car max-h-[90vh] overflow-auto rounded-xl border border-[rgba(212,175,55,0.3)] shadow backdrop-blur">
        <DialogHeader>
          <DialogTitle className="mb-2 text-3xl font-bold text-yellow-500">
            Ajouter une nouvelle pièce
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-4 lg:p-8"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-yellow-500"
              >
                Nom
              </Label>
              <Input
                id="name"
                className="bg-card-car border-[rgba(212,175,55,0.3)]"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="brand"
                className="text-sm font-semibold text-yellow-500"
              >
                Marque
              </Label>
              <Input
                id="brand"
                className="bg-card-car border-[rgba(212,175,55,0.3)]"
                {...register("brand")}
              />
              {errors.brand && (
                <p className="text-xs text-red-500">{errors.brand.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="model"
                className="text-sm font-semibold text-yellow-500"
              >
                Modèle
              </Label>
              <Input
                id="model"
                className="bg-card-car border-[rgba(212,175,55,0.3)]"
                {...register("model")}
              />
              {errors.model && (
                <p className="text-xs text-red-500">{errors.model.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="condition"
                className="text-sm font-semibold text-yellow-500"
              >
                État (%)
              </Label>
              <Input
                id="condition"
                type="number"
                min="0"
                max="100"
                className="bg-card-car border-[rgba(212,175,55,0.3)]"
                {...register("condition", { valueAsNumber: true })}
              />
              {errors.condition && (
                <p className="text-xs text-red-500">
                  {errors.condition.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-sm font-semibold text-yellow-500"
              >
                Prix
              </Label>
              <Input
                id="price"
                className="bg-card-car border-[rgba(212,175,55,0.3)]"
                placeholder="150 DT"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-xs text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="image"
                className="text-sm font-semibold text-yellow-500"
              >
                Image URL (optionnel)
              </Label>
              <Input
                id="image"
                className="bg-card-car border-[rgba(212,175,55,0.3)]"
                {...register("image")}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="availability"
                className="h-4 w-4 rounded border-[rgba(212,175,55,0.3)] text-yellow-500"
                {...register("availability")}
              />
              <Label
                htmlFor="availability"
                className="text-sm font-semibold text-yellow-500"
              >
                Disponible
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={createPartMutation.isPending}
            className="mt-6 w-full rounded-full bg-linear-to-r from-yellow-500 to-yellow-400 font-semibold text-black transition hover:scale-105"
          >
            {createPartMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              "Ajouter la pièce"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
