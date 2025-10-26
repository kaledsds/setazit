import { z } from "zod";

export const orderSchema = z.object({
  date: z.string().optional(), // accept ISO string; convert to Date if needed
  status: z.string(),
  carId: z.number(),
  clientId: z.number(),
});

export type orderSchemaType = z.infer<typeof orderSchema>;
