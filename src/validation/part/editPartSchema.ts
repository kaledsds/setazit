import { z } from "zod";

export const editPartSchema = z.object({
  id: z.string(),
  image: z
    .string()
    .min(1, "L’image est obligatoire.")
    .refine(
      (val) =>
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.startsWith("/"),
      { message: "L’URL ou le chemin de l’image n’est pas valide." },
    )
    .optional()
    .nullable(),
  name: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  condition: z.number().int().optional(),
  price: z.string().optional(),
  availability: z.boolean().optional(),
});

export type editPartSchemaType = z.infer<typeof editPartSchema>;
