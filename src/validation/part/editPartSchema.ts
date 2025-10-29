import { z } from "zod";

export const editPartSchema = z.object({
  id: z.string(),
  image: z.string().optional(),
  name: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  condition: z.number().int().optional(),
  price: z.string().optional(),
  availability: z.boolean().optional(),
});

export type editPartSchemaType = z.infer<typeof editPartSchema>;