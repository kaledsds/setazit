import { z } from "zod";

export const dealershipInputSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  nature: z.string().min(3),
  phone: z.string().min(8),
  email: z.string().email(),
  image: z.string().url().optional().or(z.literal("")),
});

export type dealershipInputSchemaType = z.infer<typeof dealershipInputSchema>;
