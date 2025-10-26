// src/server/api/routers/garage.ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { garageSchema } from "@/validation/garageSchema";

export const garageRouter = createTRPCRouter({
  create: publicProcedure
    .input(garageSchema)
    .mutation(async ({ ctx, input }) => {
      const dealer = await ctx.db.dealership.findUnique({
        where: { id: input.dealershipId },
      });
      if (!dealer)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid dealershipId",
        });
      return ctx.db.garage.create({ data: input });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const g = await ctx.db.garage.findUnique({
        where: { id: input.id },
        include: { reviews: true, dealership: true },
      });
      if (!g)
        throw new TRPCError({ code: "NOT_FOUND", message: "Garage not found" });
      return g;
    }),

  list: publicProcedure
    .input(
      z.object({
        skip: z.number().optional(),
        take: z.number().optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = input.search
        ? { name: { contains: input.search, mode: "insensitive" } }
        : undefined;
      return ctx.db.garage.findMany({
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
          phone: z.string(),
          services: z.string(),
          description: z.string(),
          availability: z.boolean().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.garage.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.garage.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
