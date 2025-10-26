import { z } from "zod";

export const garageSchema = z.object({
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  services: z.string(),
  description: z.string(),
  availability: z.boolean().optional().default(true),
  dealershipId: z.number(),
});

export type garageSchemaType = z.infer<typeof garageSchema>;
