import { z } from "zod";

export const dealershipSchema = z.object({
  name: z.string(),
  address: z.string(),
  nature: z.string(),
  phone: z.string(),
  email: z.string().email(),
});

export type dealershipSchemaType = z.infer<typeof dealershipSchema>;
