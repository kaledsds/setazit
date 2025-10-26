import { z } from "zod";

export const partSchema = z.object({
  name: z.string(),
  brand: z.string(),
  model: z.string(),
  condition: z.number().int(),
  price: z.string(),
  availability: z.boolean().optional().default(true),
  dealershipId: z.number(),
});

export type partSchemaType = z.infer<typeof partSchema>;
