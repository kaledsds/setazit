import { z } from "zod";

export const dealershipInputSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  nature: z.string().min(3),
  phone: z.string().min(8),
  email: z.string().email(),
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
});

export type dealershipInputSchemaType = z.infer<typeof dealershipInputSchema>;
