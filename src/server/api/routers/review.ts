import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { Prisma } from "@prisma/client";

const buildSearchWhere = (search?: string): Prisma.ReviewWhereInput => {
  if (!search) return {};
  return {
    OR: [
      { user: { name: { contains: search, mode: "insensitive" as const } } },
      { garage: { name: { contains: search, mode: "insensitive" as const } } },
      { comment: { contains: search, mode: "insensitive" as const } },
    ],
  };
};

const buildPaginationMeta = (total: number, page: number, pageSize: number) => {
  const lastPage = Math.ceil(total / pageSize);
  const from = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(page * pageSize, total);
  return { total, lastPage, currentPage: page, perPage: pageSize, from, to };
};

export const reviewRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        garageId: z.string(),
        rating: z.string().transform(Number),
        comment: z.string().min(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const garage = await ctx.db.garage.findUnique({
        where: { id: input.garageId },
      });
      if (!garage)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Garage non trouvé",
        });

      return ctx.db.review.create({
        data: {
          ...input,
          rating: input.rating.toString(),
          userId: ctx.session.user.id,
        },
      });
    }),

  getByGarage: publicProcedure
    .input(z.object({ garageId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.review.findMany({
        where: { garageId: input.garageId },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      });
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const skip = (page - 1) * pageSize;

      const where = buildSearchWhere(search);

      const [total, reviews] = await Promise.all([
        ctx.db.review.count({ where }),
        ctx.db.review.findMany({
          where,
          skip,
          take: pageSize,
          include: {
            user: { select: { name: true } },
            garage: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return {
        data: reviews,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.review.findFirst({
        where: { id: input.id },
      });

      if (!review)
        throw new TRPCError({ code: "NOT_FOUND", message: "Avis non trouvé" });

      return ctx.db.review.delete({ where: { id: input.id } });
    }),
});
