import { z } from "zod";

export const editCarSchema = z.object({
  id: z.string(),
  image: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().optional(),
  price: z.string().optional(),
  status: z.string().optional(),
  color: z.string().optional(),
  availability: z.boolean().optional(),
});

export type editCarSchemaType = z.infer<typeof editCarSchema>;
