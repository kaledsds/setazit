import { z } from "zod";

export const partInputSchema = z.object({
  image: z.string().optional(),
  name: z.string().min(1, "Le nom est requis"),
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  condition: z.number().int().min(0).max(100),
  price: z.string().min(1, "Le prix est requis"),
  availability: z.boolean(),
});

export type partInputSchemaType = z.infer<typeof partInputSchema>;
