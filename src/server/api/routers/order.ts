import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { Prisma } from "@prisma/client";

const buildSearchWhere = (search?: string): Prisma.OrderWhereInput => {
  if (!search) return {};
  return {
    OR: [
      { car: { brand: { contains: search, mode: "insensitive" as const } } },
      { car: { model: { contains: search, mode: "insensitive" as const } } },
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

export const orderRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ carId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const car = await ctx.db.car.findFirst({
        where: { id: input.carId, availability: true },
      });
      if (!car)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Voiture non disponible",
        });

      return ctx.db.order.create({
        data: {
          carId: input.carId,
          usertId: ctx.session.user.id,
          status: "pending",
        },
        include: { car: true },
      });
    }),

  getMyOrders: protectedProcedure
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

      const where: Prisma.OrderWhereInput = {
        usertId: ctx.session.user.id,
        ...buildSearchWhere(search),
      };

      const [total, orders] = await Promise.all([
        ctx.db.order.count({ where }),
        ctx.db.order.findMany({
          where,
          skip,
          take: pageSize,
          include: { car: true },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return { data: orders, meta: buildPaginationMeta(total, page, pageSize) };
    }),
});
