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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/utils/api";
import {
  editCarSchema,
  type editCarSchemaType,
} from "@/validation/car/editCarSchema";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Car } from "@prisma/client";
import { Loader2, Pencil } from "lucide-react";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

interface EditCarModalProps {
  car: Car;
}

export const EditCarModal = ({ car }: EditCarModalProps) => {
  const [open, setOpen] = React.useState(false);
  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<editCarSchemaType>({
    resolver: zodResolver(editCarSchema),
    defaultValues: {
      id: car.id,
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      status: car.status,
      color: car.color,
      image: car.image || "",
      availability: car.availability,
    },
  });

  const editCarMutation = api.car.editcarPost.useMutation({
    onSuccess: () => {
      toast.success("Voiture modifiée avec succès!");
      utils.car.invalidate();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la modification");
    },
  });

  const onSubmit = (data: editCarSchemaType) => {
    editCarMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="flex items-center space-x-2 border-[rgba(212,175,55,0.3)] bg-white text-yellow-500 transition hover:bg-yellow-500/10"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card-car max-h-[90vh] overflow-auto rounded-xl border border-[rgba(212,175,55,0.3)] shadow backdrop-blur">
        <DialogHeader>
          <DialogTitle className="mb-2 text-3xl font-bold text-yellow-500">
            Modifier la voiture
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col justify-center p-4 lg:p-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Brand Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="brand"
                  className="text-sm font-semibold text-yellow-500"
                >
                  Marque
                </Label>
                <Input
                  id="brand"
                  type="text"
                  className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)]"
                  placeholder="Ex: Toyota, BMW"
                  {...register("brand")}
                />
                {errors.brand && (
                  <p className="text-sm text-red-500">{errors.brand.message}</p>
                )}
              </div>

              {/* Model Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="model"
                  className="text-sm font-semibold text-yellow-500"
                >
                  Modèle
                </Label>
                <Input
                  id="model"
                  type="text"
                  className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)]"
                  placeholder="Ex: Camry, X5"
                  {...register("model")}
                />
                {errors.model && (
                  <p className="text-sm text-red-500">{errors.model.message}</p>
                )}
              </div>

              {/* Year Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="year"
                  className="text-sm font-semibold text-yellow-500"
                >
                  Année
                </Label>
                <Input
                  id="year"
                  type="number"
                  className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)]"
                  placeholder="2024"
                  {...register("year", { valueAsNumber: true })}
                />
                {errors.year && (
                  <p className="text-sm text-red-500">{errors.year.message}</p>
                )}
              </div>

              {/* Price Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="price"
                  className="text-sm font-semibold text-yellow-500"
                >
                  Prix
                </Label>
                <Input
                  id="price"
                  type="text"
                  className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)]"
                  placeholder="25000 DT"
                  {...register("price")}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Status Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="status"
                  className="text-sm font-semibold text-yellow-500"
                >
                  Statut
                </Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)]">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Neuf</SelectItem>
                        <SelectItem value="used">Occasion</SelectItem>
                        <SelectItem value="certified">Certifié</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p className="text-sm text-red-500">
                    {errors.status.message}
                  </p>
                )}
              </div>

              {/* Color Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="color"
                  className="text-sm font-semibold text-yellow-500"
                >
                  Couleur
                </Label>
                <Input
                  id="color"
                  type="text"
                  className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)]"
                  placeholder="Ex: Noir, Blanc"
                  {...register("color")}
                />
                {errors.color && (
                  <p className="text-sm text-red-500">{errors.color.message}</p>
                )}
              </div>

              {/* Image URL Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="image"
                  className="text-sm font-semibold text-yellow-500"
                >
                  Image URL (optionnel)
                </Label>
                <Input
                  id="image"
                  type="text"
                  className="bg-card-car text-foreground border-[rgba(212,175,55,0.3)]"
                  placeholder="https://..."
                  {...register("image")}
                />
              </div>

              {/* Availability Field */}
              <div className="flex items-center space-x-2 pt-8">
                <input
                  type="checkbox"
                  id="availability"
                  className="h-4 w-4 rounded border-[rgba(212,175,55,0.3)] text-yellow-500 focus:ring-yellow-500"
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
          </div>

          {/* Submit Button - Full Width Below Grid */}
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={editCarMutation.isPending}
            className="mt-6 w-full rounded-full bg-linear-to-r from-(--accent-gold) to-(--accent-gold-light) font-semibold text-black transition hover:scale-105"
          >
            {editCarMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Modification en cours...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>

          {/* Footer */}
          <div className="mt-6 border-t border-[rgba(212,175,55,0.3)] pt-4 text-center">
            <p className="text-muted-foreground text-xs">
              Modifiez uniquement les champs que vous souhaitez changer
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
