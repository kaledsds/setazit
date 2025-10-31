import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const sessionRouter = createTRPCRouter({
  setSessionType: protectedProcedure
    .input(z.object({ sessionType: z.enum(["CLIENT", "DEALERSHIP"]) }))
    .mutation(async ({ ctx, input }) => {
      const sessionToken = ctx.req.cookies["next-auth.session-token"];
      if (!sessionToken) {
        throw new Error("Session token not found in cookies");
      }

      await ctx.db.session.updateMany({
        where: {
          sessionToken,
          userId: ctx.session.user.id,
        },
        data: {
          sessionType: input.sessionType,
        },
      });

      return { success: true };
    }),
});
