import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { dealershipInputSchema } from "@/validation/dealership/dealershipInputSchema";
import { editDealershipSchema } from "@/validation/dealership/editDealershipSchema";

export const dealershipRouter = createTRPCRouter({
  // Create dealership
  create: protectedProcedure
    .input(dealershipInputSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user already has a dealership
      const existingDealership = await ctx.db.dealership.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (existingDealership) {
        throw new Error("Vous avez déjà un concessionnaire");
      }

      // Check if email already exists
      const emailExists = await ctx.db.dealership.findFirst({
        where: { email: input.email },
      });

      if (emailExists) {
        throw new Error("Cet email est déjà utilisé");
      }

      const dealership = await ctx.db.dealership.create({
        data: {
          name: input.name,
          address: input.address,
          nature: input.nature,
          phone: input.phone,
          email: input.email,
          image: input.image ?? null,
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
        parts: true,
        garages: true,
        _count: {
          select: {
            cars: true,
            parts: true,
            garages: true,
          },
        },
      },
    });

    return dealership;
  }),

  // Update dealership
  update: protectedProcedure
    .input(editDealershipSchema)
    .mutation(async ({ ctx, input }) => {
      const dealership = await ctx.db.dealership.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!dealership) {
        throw new Error("Concessionnaire introuvable");
      }

      // If email is being updated, check if it's already in use
      if (input.email && input.email !== dealership.email) {
        const emailExists = await ctx.db.dealership.findFirst({
          where: {
            email: input.email,
            id: { not: dealership.id },
          },
        });

        if (emailExists) {
          throw new Error("Cet email est déjà utilisé");
        }
      }

      const updated = await ctx.db.dealership.update({
        where: { id: dealership.id },
        data: input,
      });

      return updated;
    }),

  // Delete dealership
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    const dealership = await ctx.db.dealership.findUnique({
      where: { userId: ctx.session.user.id },
    });

    if (!dealership) {
      throw new Error("Concessionnaire introuvable");
    }

    await ctx.db.dealership.delete({
      where: { id: dealership.id },
    });

    return { success: true };
  }),
});
