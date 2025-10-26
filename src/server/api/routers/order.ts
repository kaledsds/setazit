// src/server/api/routers/order.ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { orderSchema } from "@/validation/orderSchema";

export const orderRouter = createTRPCRouter({
  create: publicProcedure
    .input(orderSchema)
    .mutation(async ({ ctx, input }) => {
      // ensure relations exist
      const car = await ctx.db.car.findUnique({ where: { id: input.carId } });
      const client = await ctx.db.client.findUnique({
        where: { id: input.clientId },
      });
      if (!car || !client)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid carId or clientId",
        });

      return ctx.db.order.create({
        data: {
          date: input.date ? new Date(input.date) : new Date(),
          status: input.status,
          carId: input.carId,
          clientId: input.clientId,
        },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const o = await ctx.db.order.findUnique({
        where: { id: input.id },
        include: { car: true, client: true },
      });
      if (!o)
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      return o;
    }),

  list: publicProcedure
    .input(
      z.object({
        skip: z.number().optional(),
        take: z.number().optional(),
        clientId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = input.clientId ? { clientId: input.clientId } : undefined;
      return ctx.db.order.findMany({
        where,
        skip: input.skip,
        take: input.take ?? 20,
        include: { car: true, client: true },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          date: z.string().optional(),
          status: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data: any = {};
      if (input.data.date) data.date = new Date(input.data.date);
      if (input.data.status) data.status = input.data.status;
      return ctx.db.order.update({ where: { id: input.id }, data });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.order.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
