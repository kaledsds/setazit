import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { dealershipInputSchema } from "@/validation/dealership/dealershipInputSchema";

export const dealershipRouter = createTRPCRouter({
  // Create dealership
  create: protectedProcedure
    .input(dealershipInputSchema)
    .mutation(async ({ ctx, input }) => {
      const existingDealership = await ctx.db.dealership.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (existingDealership) {
        throw new Error("Vous avez déjà un concessionnaire");
      }
      const dealership = await ctx.db.dealership.create({
        data: {
          name: input.name,
          phone: input.phone,
          address: input.address,
          image: input.image,
          nature: input.nature,
          email: input.email,
          userId: ctx.session.user.id,
        },
      });

      return dealership;
    }),

  // Get my dealership
  getMy: protectedProcedure.query(async ({ ctx }) => {
    const dealership = await ctx.db.dealership.findUnique({
      where: { userId: ctx.session.user.id },
      include: {
        cars: true,
        _count: {
          select: {
            cars: true,
          },
        },
      },
    });

    return dealership;
  }),

  // Update dealership
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).optional(),
        description: z.string().min(10).optional(),
        phone: z.string().min(8).optional(),
        address: z.string().min(5).optional(),
        city: z.string().min(2).optional(),
        logo: z.string().url().optional().or(z.literal("")),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dealership = await ctx.db.dealership.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!dealership) {
        throw new Error("Concessionnaire introuvable");
      }

      const updated = await ctx.db.dealership.update({
        where: { id: dealership.id },
        data: input,
      });

      return updated;
    }),
});
