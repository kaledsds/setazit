import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const profileRouter = createTRPCRouter({
  // Get user profile with dealership
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        dateOfBirth: true,
        createdAt: true,
        updatedAt: true,
        Dealership: {
          select: {
            id: true,
            name: true,
            address: true,
            nature: true,
            phone: true,
            email: true,
            image: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).optional(),
        email: z.string().email().optional(),
        dateOfBirth: z.date().optional(),
        image: z.string().url().optional().or(z.literal("")),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          email: input.email,
          dateOfBirth: input.dateOfBirth,
          image: input.image ?? null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          dateOfBirth: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    }),

  // Get user statistics (optional - for dashboard)
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Get dealership if exists
    const dealership = await ctx.db.dealership.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!dealership) {
      return {
        hasDealership: false,
        totalCars: 0,
        totalParts: 0,
        totalGarages: 0,
        totalOrders: 0,
        totalReviews: 0,
      };
    }

    // Get counts if dealership exists
    const [carsCount, partsCount, garagesCount, ordersCount, reviewsCount] =
      await Promise.all([
        ctx.db.car.count({ where: { dealershipId: dealership.id } }),
        ctx.db.part.count({ where: { dealershipId: dealership.id } }),
        ctx.db.garage.count({ where: { dealershipId: dealership.id } }),
        ctx.db.order.count({ where: { usertId: userId } }),
        ctx.db.review.count({ where: { userId } }),
      ]);

    return {
      hasDealership: true,
      totalCars: carsCount,
      totalParts: partsCount,
      totalGarages: garagesCount,
      totalOrders: ordersCount,
      totalReviews: reviewsCount,
    };
  }),
});
