import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/utils/api";
import {
  dealershipInputSchema,
  type dealershipInputSchemaType,
} from "@/validation/dealership/dealershipInputSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Upload, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function DealershipSetup() {
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const router = useRouter();
  const utils = api.useUtils();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const {
    register,
    handleSubmit,
    setValue,
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

  const createDealershipMutation = api.dealership.create.useMutation({
    onSuccess: async () => {
      await utils.dealership.invalidate();
      void router.push("/dashboard");
    },
  });

  const onSubmit = (data: dealershipInputSchemaType) => {
    createDealershipMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-100 via-gray-50 to-white p-6 transition-colors dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <Button
        onClick={toggleTheme}
        className="fixed top-6 right-6 rounded-full bg-white p-3 shadow-lg transition-transform hover:scale-110 dark:bg-gray-800"
        variant="outline"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : (
          <Moon className="h-5 w-5 text-gray-700" />
        )}
      </Button>

      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-yellow-500 dark:text-yellow-500">
            Configuration du Concessionnaire
          </h1>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Complétez les informations de votre concessionnaire
          </p>
        </div>

        <div className="rounded-2xl border border-yellow-200 bg-white p-8 shadow-xl backdrop-blur dark:border-[rgba(212,175,55,0.3)] dark:bg-gray-900/50">
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-yellow-600 dark:text-yellow-500"
              >
                Nom du Concessionnaire *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: Auto Premium"
                className="border-yellow-200 bg-gray-50 text-gray-900 focus:border-yellow-500 dark:border-[rgba(212,175,55,0.3)] dark:bg-gray-800/50 dark:text-gray-100 dark:focus:border-yellow-500"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Nature */}
            <div className="space-y-2">
              <Label
                htmlFor="nature"
                className="text-yellow-600 dark:text-yellow-500"
              >
                Nature de l&apos;activité *
              </Label>
              <Input
                id="nature"
                type="text"
                placeholder="Ex: Vente de voitures neuves et occasions"
                className="border-yellow-200 bg-gray-50 text-gray-900 focus:border-yellow-500 dark:border-[rgba(212,175,55,0.3)] dark:bg-gray-800/50 dark:text-gray-100 dark:focus:border-yellow-500"
                {...register("nature")}
              />
              {errors.nature && (
                <p className="text-sm text-red-500">{errors.nature.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-yellow-600 dark:text-yellow-500"
              >
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@autopremium.com"
                className="border-yellow-200 bg-gray-50 text-gray-900 focus:border-yellow-500 dark:border-[rgba(212,175,55,0.3)] dark:bg-gray-800/50 dark:text-gray-100 dark:focus:border-yellow-500"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-yellow-600 dark:text-yellow-500"
              >
                Téléphone *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Ex: +216 12 345 678"
                className="border-yellow-200 bg-gray-50 text-gray-900 focus:border-yellow-500 dark:border-[rgba(212,175,55,0.3)] dark:bg-gray-800/50 dark:text-gray-100 dark:focus:border-yellow-500"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="text-yellow-600 dark:text-yellow-500"
              >
                Adresse *
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="Ex: 123 Avenue Habib Bourguiba, Tunis"
                className="border-yellow-200 bg-gray-50 text-gray-900 focus:border-yellow-500 dark:border-[rgba(212,175,55,0.3)] dark:bg-gray-800/50 dark:text-gray-100 dark:focus:border-yellow-500"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label
                htmlFor="image"
                className="text-yellow-600 dark:text-yellow-500"
              >
                Image *
              </Label>
              <div
                className="cursor-pointer rounded-xl border-2 border-dashed border-yellow-300 bg-gray-50 p-10 text-center transition-all hover:border-yellow-500 dark:border-yellow-500/50 dark:bg-gray-800/30 dark:hover:border-yellow-500"
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
                      <Badge
                        variant="default"
                        className="gap-1 bg-yellow-500 text-black hover:bg-yellow-600"
                      >
                        <Check className="h-3 w-3" />
                        Prête
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
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
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-yellow-500" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Upload en cours...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="mx-auto h-14 w-14 text-gray-400 dark:text-gray-500" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Glissez votre image ici ou{" "}
                      <span className="text-yellow-600 underline dark:text-yellow-500">
                        cliquez
                      </span>
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Max 4 Mo • JPG, PNG
                    </p>
                  </div>
                )}
              </div>
              {errors.image && (
                <p className="text-sm text-red-500">{errors.image.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={createDealershipMutation.isPending}
              className="w-full rounded-full bg-linear-to-r from-yellow-500 to-yellow-600 py-6 text-lg font-semibold text-black transition hover:scale-105 hover:from-yellow-600 hover:to-yellow-700"
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

          <div className="mt-6 border-t border-yellow-200 pt-4 text-center dark:border-[rgba(212,175,55,0.3)]">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              * Tous les champs sont obligatoires
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
