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
  editPartSchema,
  type editPartSchemaType,
} from "@/validation/part/editPartSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Part } from "@prisma/client";
import { Loader2, Pencil } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditPartModalProps {
  part: Part;
}

export const EditPartModal = ({ part }: EditPartModalProps) => {
  const [open, setOpen] = React.useState(false);
  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<editPartSchemaType>({
    resolver: zodResolver(editPartSchema),
    defaultValues: {
      id: part.id,
      name: part.name,
      brand: part.brand,
      model: part.model,
      condition: part.condition,
      price: part.price,
      image: part.image ?? "",
      availability: part.availability,
    },
  });

  const editPartMutation = api.part.edit.useMutation({
    onSuccess: async () => {
      toast.success("Pièce modifiée avec succès!");
      await utils.part.invalidate();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la modification");
    },
  });

  const onSubmit = (data: editPartSchemaType) => {
    editPartMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-[rgba(212,175,55,0.3)] bg-white text-yellow-500 transition hover:bg-yellow-500/10"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card-car max-h-[90vh] overflow-auto rounded-xl border border-[rgba(212,175,55,0.3)] shadow backdrop-blur">
        <DialogHeader>
          <DialogTitle className="mb-2 text-3xl font-bold text-yellow-500">
            Modifier la pièce
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
                Image URL
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
            disabled={editPartMutation.isPending}
            className="mt-6 w-full rounded-full bg-linear-to-r from-yellow-500 to-yellow-400 font-semibold text-black transition hover:scale-105"
          >
            {editPartMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Modification...
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
