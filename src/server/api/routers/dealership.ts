// src/server/api/routers/dealership.ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { dealershipSchema } from "@/validation/dealershipSchema";

export const dealershipRouter = createTRPCRouter({
  create: publicProcedure
    .input(dealershipSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.dealership.create({ data: input });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.dealership.findUnique({
        where: { id: input.id },
        include: { cars: true, parts: true, garages: true },
      });
      if (!item)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dealership not found",
        });
      return item;
    }),

  list: publicProcedure
    .input(
      z.object({
        skip: z.number().min(0).optional(),
        take: z.number().min(1).max(100).optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = input.search
        ? {
            OR: [
              { name: { contains: input.search, mode: "insensitive" } },
              { address: { contains: input.search, mode: "insensitive" } },
            ],
          }
        : undefined;
      return ctx.db.dealership.findMany({
        where: {},
        skip: input.skip,
        take: input.take ?? 20,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          name: z.string(),
          address: z.string(),
          nature: z.string(),
          phone: z.string(),
          email: z.string().email(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.dealership.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.dealership.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
