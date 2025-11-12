import { z } from "zod";

export const editGarageSchema = z.object({
  id: z.string(),
  image:  z
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
  address: z.string().optional(),
  phone: z.string().optional(),
  services: z.string().optional(),
  description: z.string().optional(),
  availability: z.boolean().optional(),
});

export type editGarageSchemaType = z.infer<typeof editGarageSchema>;
