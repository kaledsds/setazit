import { z } from "zod";

export const carInputSchema = z.object({
  image: z.string().optional(),
  brand: z.string(),
  model: z.string(),
  status: z.string(),
  color: z.string(),
  year: z.number().int(),
  price: z.string(),
  availability: z.boolean(),
});

export type carInputSchemaType = z.infer<typeof carInputSchema>;
