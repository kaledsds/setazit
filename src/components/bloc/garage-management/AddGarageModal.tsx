import { Badge } from "@/components/ui/badge";
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
  garageInputSchema,
  type garageInputSchemaType,
} from "@/validation/garage/garageInputSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Plus, Upload } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const AddGarageModal = () => {
  const [open, setOpen] = React.useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<garageInputSchemaType>({
    resolver: zodResolver(garageInputSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      services: "",
      description: "",
      availability: true,
    },
  });
  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = (await response.json()) as { error?: string };
          throw new Error(
            errorData.error ?? `Upload failed with status ${response.status}`,
          );
        }

        const data = (await response.json()) as { url: string };
        console.log("✅ Image uploaded:", data.url);
        setUploadedUrl(data.url);
        setValue("image", data.url, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } catch (error) {
        console.error("❌ Upload error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Erreur inconnue";
        alert(`Erreur lors du téléchargement: ${errorMessage}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const createGarageMutation = api.garage.createGarage.useMutation({
    onSuccess: async () => {
      toast.success("Garage ajouté avec succès!");
      await utils.garage.invalidate();
      reset();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de l'ajout");
    },
  });

  const onSubmit = (data: garageInputSchemaType) => {
    createGarageMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2 rounded-lg bg-linear-to-r from-yellow-500 to-yellow-400 p-2 text-black shadow-md transition hover:scale-105">
          <Plus className="h-4 w-4" />
          <span>Ajouter Garage</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card-car max-h-[90vh] overflow-auto rounded-xl border border-[rgba(212,175,55,0.3)] shadow backdrop-blur">
        <DialogHeader>
          <DialogTitle className="mb-2 text-3xl font-bold text-yellow-500">
            Ajouter un nouveau garage
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-4 lg:p-8"
        >
          <div className="space-y-2">
            <Label htmlFor="image" className="text-yellow-500">
              Image *
            </Label>
            <div
              className="hover:border-primary/50 cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all"
              onClick={(e) => {
                if (!uploadedUrl && !isUploading) {
                  e.currentTarget
                    .querySelector<HTMLInputElement>('input[type="file"]')
                    ?.click();
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                void onDrop(Array.from(e.dataTransfer.files));
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              {uploadedUrl ? (
                <div className="space-y-4">
                  <Image
                    src={uploadedUrl}
                    alt="Produit"
                    height={200}
                    width={460}
                    className="mx-auto max-h-64 rounded-lg shadow-xl"
                  />
                  <div className="flex justify-center gap-2">
                    <Badge variant="default" className="gap-1">
                      <Check className="h-3 w-3" />
                      Prête
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedUrl("");
                        setValue("image", "");
                      }}
                    >
                      Changer
                    </Button>
                  </div>
                </div>
              ) : isUploading ? (
                <div className="space-y-4">
                  <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
                  <p className="text-sm">Upload en cours...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="text-muted-foreground mx-auto h-14 w-14" />
                  <p className="text-sm">
                    Glissez votre image ici ou{" "}
                    <span className="text-primary underline">cliquez</span>
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        void onDrop(Array.from(e.target.files));
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <p className="text-muted-foreground text-xs">
                    Max 4 Mo • JPG, PNG
                  </p>
                </div>
              )}
            </div>
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image.message}</p>
            )}
          </div>
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
            disabled={createGarageMutation.isPending}
            className="mt-6 w-full rounded-full bg-linear-to-r from-yellow-500 to-yellow-400 font-semibold text-black transition hover:scale-105"
          >
            {createGarageMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              "Ajouter le garage"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
