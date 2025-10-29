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
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/utils/api";
import {
  editGarageSchema,
  type editGarageSchemaType,
} from "@/validation/garage/editGarageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Garage } from "@prisma/client";
import { Loader2, Pencil } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditGarageModalProps {
  garage: Garage;
}

export const EditGarageModal = ({ garage }: EditGarageModalProps) => {
  const [open, setOpen] = React.useState(false);
  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<editGarageSchemaType>({
    resolver: zodResolver(editGarageSchema),
    defaultValues: {
      id: garage.id,
      name: garage.name,
      address: garage.address,
      phone: garage.phone,
      services: garage.services,
      description: garage.description,
      image: garage.image ?? "",
      availability: garage.availability,
    },
  });

  const editGarageMutation = api.garage.edit.useMutation({
    onSuccess: async () => {
      toast.success("Garage modifié avec succès!");
      await utils.garage.invalidate();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la modification");
    },
  });

  const onSubmit = (data: editGarageSchemaType) => {
    editGarageMutation.mutate(data);
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
            Modifier le garage
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
                htmlFor="address"
                className="text-sm font-semibold text-yellow-500"
              >
                Adresse
              </Label>
              <Input
                id="address"
                className="bg-card-car border-[rgba(212,175,55,0.3)]"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-xs text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-semibold text-yellow-500"
              >
                Téléphone
              </Label>
              <Input
                id="phone"
                className="bg-card-car border-[rgba(212,175,55,0.3)]"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="services"
                className="text-sm font-semibold text-yellow-500"
              >
                Services
              </Label>
              <Input
                id="services"
                className="bg-card-car border-[rgba(212,175,55,0.3)]"
                {...register("services")}
              />
              {errors.services && (
                <p className="text-xs text-red-500">
                  {errors.services.message}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label
                htmlFor="description"
                className="text-sm font-semibold text-yellow-500"
              >
                Description
              </Label>
              <Textarea
                id="description"
                className="bg-card-car border-[rgba(212,175,55,0.3)]"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
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
            disabled={editGarageMutation.isPending}
            className="mt-6 w-full rounded-full bg-linear-to-r from-yellow-500 to-yellow-400 font-semibold text-black transition hover:scale-105"
          >
            {editGarageMutation.isPending ? (
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
