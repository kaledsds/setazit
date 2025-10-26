// src/server/api/routers/part.ts
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { partSchema } from '@/validation/partSchema';


export const partRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      partSchema
    )
    .mutation(async ({ ctx, input }) => {
      const dealer = await ctx.db.dealership.findUnique({ where: { id: input.dealershipId } });
      if (!dealer) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid dealershipId' });
      return ctx.db.part.create({ data: input });
    }),

  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    const item = await ctx.db.part.findUnique({ where: { id: input.id }, include: { dealership: true } });
    if (!item) throw new TRPCError({ code: 'NOT_FOUND', message: 'Part not found' });
    return item;
  }),

  list: publicProcedure
    .input(z.object({ skip: z.number().optional(), take: z.number().optional(), search: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const where = input.search ? { name: { contains: input.search, mode: 'insensitive' } } : undefined;
      return ctx.db.part.findMany({ where:{}, skip: input.skip, take: input.take ?? 20 });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          name: z.string(),
          brand: z.string(),
          model: z.string(),
          condition: z.number().int().optional(),
          price: z.string().optional(),
          availability: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.part.update({ where: { id: input.id }, data: input.data });
    }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    await ctx.db.part.delete({ where: { id: input.id } });
    return { success: true };
  }),
});
