import { z } from "zod";

export const editGarageSchema = z.object({
  id: z.string(),
  image: z.string().optional(),
  name: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  services: z.string().optional(),
  description: z.string().optional(),
  availability: z.boolean().optional(),
});

export type editGarageSchemaType = z.infer<typeof editGarageSchema>;
