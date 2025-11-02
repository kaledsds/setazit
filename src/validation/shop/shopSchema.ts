import { z } from "zod";

export const createShopSchema = z.object({
  partId: z.string().min(1, "Part ID is required"),
});

export type CreateShopInput = z.infer<typeof createShopSchema>;
