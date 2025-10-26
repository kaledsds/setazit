import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.string(),
  date: z.string().optional(),
  comment: z.string().optional().nullable(),
  clientId: z.number(),
  garageId: z.number().optional().nullable(),
});

export type reviewSchemaType = z.infer<typeof reviewSchema>;
