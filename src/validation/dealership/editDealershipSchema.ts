import { z } from "zod";

export const editDealershipSchema = z.object({
  id: z.string(),
  image: z.string().optional(),
  name: z.string().min(1, "Le nom est requis"),
  address: z.string(),
  nature: z.string(),
  phone: z.string(),
  email: z.string(),
  userId: z.string(),
});

export type editDealershipSchemaType = z.infer<typeof editDealershipSchema>;
