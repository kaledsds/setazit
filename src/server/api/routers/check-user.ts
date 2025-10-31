import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const checkUserRouter = createTRPCRouter({
  // Update user role
  updateRole: protectedProcedure
    .input(
      z.object({
        role: z.enum(["USER", "ADMIN"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { role: input.role },
      });

      return updatedUser;
    }),

  // Get current user with role
  getMe: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        Dealership: true,
      },
    });

    return user;
  }),
  hasDealership: protectedProcedure.query(async ({ ctx }) => {
    const dealership = await ctx.db.dealership.findUnique({
      where: { userId: ctx.session.user.id },
    });
    return !!dealership;
  }),
});
