import { z } from "zod";

export const garageInputSchema = z.object({
  image: z.string().optional(),
  name: z.string().min(1, "Le nom est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  phone: z.string().min(1, "Le téléphone est requis"),
  services: z.string().min(1, "Les services sont requis"),
  description: z.string().min(1, "La description est requise"),
  availability: z.boolean(),
});

export type garageInputSchemaType = z.infer<typeof garageInputSchema>;
