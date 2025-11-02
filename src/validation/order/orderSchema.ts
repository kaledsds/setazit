import { z } from "zod";

export const createOrderSchema = z.object({
  carId: z.string().min(1, "Car ID is required"),
});

export type createOrderSchemaType = z.infer<typeof createOrderSchema>;
