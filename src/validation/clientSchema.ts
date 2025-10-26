import { z } from "zod";

export const clientSchema = z.object({
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string().email(),
});

export type clientSchemaType = z.infer<typeof clientSchema>;
