// src/server/api/routers/review.ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { reviewSchema } from "@/validation/reviewSchema";

export const reviewRouter = createTRPCRouter({
  create: publicProcedure
    .input(reviewSchema)
    .mutation(async ({ ctx, input }) => {
      const client = await ctx.db.client.findUnique({
        where: { id: input.clientId },
      });
      if (!client)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid clientId",
        });
      if (input.garageId) {
        const g = await ctx.db.garage.findUnique({
          where: { id: input.garageId },
        });
        if (!g)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid garageId",
          });
      }

      return ctx.db.review.create({
        data: {
          rating: input.rating,
          date: input.date ? new Date(input.date) : new Date(),
          comment: input.comment ?? "",
          clientId: input.clientId,
          garageId: input.garageId ?? null,
        },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const r = await ctx.db.review.findUnique({
        where: { id: input.id },
        include: { client: true, garage: true },
      });
      if (!r)
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" });
      return r;
    }),

  list: publicProcedure
    .input(
      z.object({
        skip: z.number().optional(),
        take: z.number().optional(),
        garageId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = input.garageId ? { garageId: input.garageId } : undefined;
      return ctx.db.review.findMany({
        where,
        skip: input.skip,
        take: input.take ?? 20,
        include: { client: true, garage: true },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          rating: z.string().optional(),
          date: z.string().optional(),
          comment: z.string().optional().nullable(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data: any = {};
      if (input.data.rating) data.rating = input.data.rating;
      if (input.data.date) data.date = new Date(input.data.date);
      if (input.data.comment !== undefined) data.comment = input.data.comment;
      return ctx.db.review.update({ where: { id: input.id }, data });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.review.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
