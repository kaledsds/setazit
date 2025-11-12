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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/utils/api";
import {
  carInputSchema,
  type carInputSchemaType,
} from "@/validation/car/carInputSchema";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Plus, Upload } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

export const AddCarModal = () => {
  const [open, setOpen] = React.useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<carInputSchemaType>({
    resolver: zodResolver(carInputSchema),
    defaultValues: {
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: "",
      status: "new",
      color: "",
      image: "",
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

  const createCarMutation = api.car.createcar.useMutation({
    onSuccess: async () => {
      toast.success("Voiture ajoutée avec succès!");
      await utils.car.invalidate();
      reset();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de l'ajout");
    },
  });

  const onSubmit = (data: carInputSchemaType) => {
    createCarMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2 rounded-lg bg-linear-to-r from-(--accent-gold) to-(--accent-gold-light) p-2 text-black shadow-md transition hover:scale-105">
          <Plus className="h-4 w-4" />
          <span>Ajouter Voiture</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card-car max-h-[90vh] overflow-auto rounded-xl border border-[rgba(212,175,55,0.3)] shadow backdrop-blur">
        <DialogHeader>
          <DialogTitle className="mb-2 text-3xl font-bold text-yellow-500">
            Ajouter une nouvelle voiture
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col justify-center space-y-2 p-4 lg:p-8">
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

              {/* Availability Field */}
              <div className="flex items-center space-x-2 pt-8">
                <input
                  type="checkbox"
                  id="availability"
                  className="h-4 w-4 rounded border-[rgba(212,175,55,0.3)] text-yellow-500 focus:ring-yellow-500"
                  defaultChecked={true}
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
            disabled={createCarMutation.isPending}
            className="mt-6 w-full rounded-full bg-linear-to-r from-(--accent-gold) to-(--accent-gold-light) font-semibold text-black transition hover:scale-105"
          >
            {createCarMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              "Ajouter la voiture"
            )}
          </Button>

          {/* Footer */}
          <div className="mt-6 border-t border-[rgba(212,175,55,0.3)] pt-4 text-center">
            <p className="text-muted-foreground text-xs">
              Tous les champs marqués sont obligatoires
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
