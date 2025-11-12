import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  User as UserIcon,
  Mail,
  Calendar,
  Building2,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MainLayout } from "@/layouts/main-layout";

// User profile schema
const userProfileSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  dateOfBirth: z.string().optional(),
  image: z.string().optional(),
});

type UserProfileType = z.infer<typeof userProfileSchema>;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // Fetch user profile
  const {
    data: profile,
    isLoading,
    refetch,
  } = api.profile.getProfile.useQuery();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UserProfileType>({
    resolver: zodResolver(userProfileSchema),
  });

  // Set form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name ?? "",
        email: profile.email,
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
          : "",
        image: profile.image ?? "",
      });
      if (profile.image) {
        setUploadedUrl(profile.image);
      }
    }
  }, [profile, reset]);

  const updateProfileMutation = api.profile.updateProfile.useMutation({
    onSuccess: async () => {
      await refetch();
      setIsEditing(false);
    },
  });

  const onSubmit = (data: UserProfileType) => {
    updateProfileMutation.mutate({
      ...data,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
    });
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = (await response.json()) as { url: string };
      setUploadedUrl(data.url);
      setValue("image", data.url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Erreur lors du téléchargement de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-100 via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-linear-to-br from-gray-100 via-gray-50 to-white p-6 transition-colors dark:from-gray-900 dark:via-gray-800 dark:to-black">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Mon Profil
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Gérez vos informations personnelles
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Card */}
            <Card className="border-yellow-200 bg-white shadow-xl lg:col-span-2 dark:border-yellow-500/30 dark:bg-gray-900/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">
                      Informations Personnelles
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      Vos données de compte
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Modifier
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        reset();
                      }}
                      variant="ghost"
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Annuler
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Profile Image */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative h-32 w-32">
                      {uploadedUrl || profile?.image ? (
                        <Image
                          src={uploadedUrl ?? profile?.image ?? ""}
                          alt="Profile"
                          fill
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-yellow-500">
                          <UserIcon className="h-16 w-16 text-white" />
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void handleImageUpload(file);
                          }}
                          disabled={isUploading}
                          className="text-sm"
                        />
                        {isUploading && (
                          <p className="mt-1 text-xs text-gray-500">
                            Upload en cours...
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500"
                    >
                      <UserIcon className="h-4 w-4" />
                      Nom complet
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      disabled={!isEditing}
                      className="border-yellow-200 bg-gray-50 disabled:opacity-70 dark:border-yellow-500/30 dark:bg-gray-800/50"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      disabled={!isEditing}
                      className="border-yellow-200 bg-gray-50 disabled:opacity-70 dark:border-yellow-500/30 dark:bg-gray-800/50"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="dateOfBirth"
                      className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500"
                    >
                      <Calendar className="h-4 w-4" />
                      Date de naissance
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register("dateOfBirth")}
                      disabled={!isEditing}
                      className="border-yellow-200 bg-gray-50 disabled:opacity-70 dark:border-yellow-500/30 dark:bg-gray-800/50"
                    />
                  </div>

                  {/* Role Badge */}
                  <div className="space-y-2">
                    <Label className="text-yellow-600 dark:text-yellow-500">
                      Rôle
                    </Label>
                    <div>
                      <Badge className="bg-yellow-500 text-black hover:bg-yellow-600">
                        {profile?.role ?? "USER"}
                      </Badge>
                    </div>
                  </div>

                  {isEditing && (
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="w-full bg-linear-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700"
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Enregistrer les modifications
                        </>
                      )}
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Dealership Card */}
            <Card className="border-yellow-200 bg-white shadow-xl dark:border-yellow-500/30 dark:bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                  <Building2 className="h-5 w-5 text-yellow-500" />
                  Mon Concessionnaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile?.Dealership ? (
                  <div className="space-y-4">
                    {profile.Dealership.image && (
                      <div className="relative h-40 w-full overflow-hidden rounded-lg">
                        <Image
                          src={profile.Dealership.image}
                          alt={profile.Dealership.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {profile.Dealership.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {profile.Dealership.nature}
                        </p>
                      </div>
                      <Separator />
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                          <span>{profile.Dealership.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Phone className="h-4 w-4 text-yellow-500" />
                          <span>{profile.Dealership.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Mail className="h-4 w-4 text-yellow-500" />
                          <span className="truncate">
                            {profile.Dealership.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <Building2 className="h-10 w-10 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Vous n&apos;avez pas encore de concessionnaire
                      </p>
                    </div>
                    <Button
                      onClick={() =>
                        (window.location.href = "/dealership/setup")
                      }
                      className="w-full bg-linear-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700"
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      Créer mon concessionnaire
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Account Info */}
          <Card className="mt-6 border-yellow-200 bg-white shadow-xl dark:border-yellow-500/30 dark:bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Informations du compte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Membre depuis
                  </p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString(
                          "fr-FR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )
                      : "N/A"}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Dernière mise à jour
                  </p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {profile?.updatedAt
                      ? new Date(profile.updatedAt).toLocaleDateString(
                          "fr-FR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
