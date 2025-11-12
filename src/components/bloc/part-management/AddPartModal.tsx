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
import { api } from "@/utils/api";
import {
  partInputSchema,
  type partInputSchemaType,
} from "@/validation/part/partInputSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Plus, Upload } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const AddPartModal = () => {
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

  const createPartMutation = api.part.createPart.useMutation({
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
