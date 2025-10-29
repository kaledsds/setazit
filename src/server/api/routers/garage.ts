import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { garageInputSchema } from "@/validation/garage/garageInputSchema";
import { editGarageSchema } from "@/validation/garage/editGarageSchema";
import { TRPCError } from "@trpc/server";

const buildSearchWhere = (search?: string) => {
  if (!search) return {};
  return {
    OR: [
      { name: { contains: search, mode: "insensitive" as const } },
      { address: { contains: search, mode: "insensitive" as const } },
      { phone: { contains: search, mode: "insensitive" as const } },
    ],
  };
};

const buildPaginationMeta = (total: number, page: number, pageSize: number) => {
  const lastPage = Math.ceil(total / pageSize);
  const from = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(page * pageSize, total);

  return {
    total,
    lastPage,
    currentPage: page,
    perPage: pageSize,
    current_page: page,
    per_page: pageSize,
    last_page: lastPage,
    from,
    to,
  };
};

export const garageRouter = createTRPCRouter({
  create: protectedProcedure
    .input(garageInputSchema)
    .mutation(async ({ ctx, input }) => {
      const dealership = await ctx.db.dealership.findFirst({
        where: { userId: ctx.session.user.id },
      });
      if (!dealership)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dealership not found",
        });

      return ctx.db.garage.create({
        data: { ...input, dealershipId: dealership.id },
      });
    }),

  edit: protectedProcedure
    .input(editGarageSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const garage = await ctx.db.garage.findFirst({
        where: { id, dealership: { userId: ctx.session.user.id } },
      });
      if (!garage)
        throw new TRPCError({ code: "NOT_FOUND", message: "Garage not found" });

      return ctx.db.garage.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const garage = await ctx.db.garage.findFirst({
        where: { id: input.id, dealership: { userId: ctx.session.user.id } },
      });
      if (!garage)
        throw new TRPCError({ code: "NOT_FOUND", message: "Garage not found" });

      return ctx.db.garage.delete({ where: { id: input.id } });
    }),

  getMyGarages: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(5),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { page, pageSize, search } = input;
        const skip = (page - 1) * pageSize;

        const searchWhere = buildSearchWhere(search);
        if (!ctx.session?.user?.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to view your cars",
          });
        }

        const owner = {
          dealership: {
            userId: ctx.session.user.id,
          },
          ...searchWhere,
        };
        const total = await ctx.db.garage.count({
          where: owner,
        });

        const Garages = await ctx.db.garage.findMany({
          where: owner,
          skip,
          take: pageSize,
          include: {
            dealership: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return {
          data: Garages,
          meta: buildPaginationMeta(total, page, pageSize),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching garages",
          cause: error,
        });
      }
    }),
});
