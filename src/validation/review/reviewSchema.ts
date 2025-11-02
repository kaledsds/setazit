import { z } from "zod";

export const createReviewSchema = z.object({
  garageId: z.string().min(1),
  rating: z.string().min(1).max(1),
  comment: z.string().min(5, "Minimum 5 caractères"),
});

export type createReviewSchemaType = z.infer<typeof createReviewSchema>;