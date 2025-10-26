// src/server/api/routers/client.ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { clientSchema } from "@/validation/clientSchema";

export const clientRouter = createTRPCRouter({
  create: publicProcedure
    .input(clientSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.client.create({ data: input });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const client = await ctx.db.client.findUnique({
        where: { id: input.id },
        include: { orders: true, reviews: true },
      });
      if (!client)
        throw new TRPCError({ code: "NOT_FOUND", message: "Client not found" });
      return client;
    }),

  list: publicProcedure
    .input(
      z.object({ skip: z.number().optional(), take: z.number().optional() }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.client.findMany({
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
          email: z.string().email(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.client.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.client.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
