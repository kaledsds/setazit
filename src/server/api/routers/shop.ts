import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { Prisma } from "@prisma/client";

const buildSearchWhere = (search?: string): Prisma.ShopWhereInput => {
  if (!search) return {};
  return {
    OR: [
      { part: { name: { contains: search, mode: "insensitive" as const } } },
      { part: { brand: { contains: search, mode: "insensitive" as const } } },
      { part: { model: { contains: search, mode: "insensitive" as const } } },
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

export const shopRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "admin")
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });

      const { page, pageSize, search } = input;
      const skip = (page - 1) * pageSize;

      const where: Prisma.ShopWhereInput = buildSearchWhere(search);

      const [total, shops] = await Promise.all([
        ctx.db.shop.count({ where }),
        ctx.db.shop.findMany({
          where,
          skip,
          take: pageSize,
          include: {
            part: { include: { dealership: true } },
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return { data: shops, meta: buildPaginationMeta(total, page, pageSize) };
    }),

  getDealerShops: protectedProcedure
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

      const dealership = await ctx.db.dealership.findUnique({
        where: { userId: ctx.session.user.id },
      });
      if (!dealership)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dealership not found",
        });

      const where: Prisma.ShopWhereInput = {
        part: { dealershipId: dealership.id },
        ...(search && {
          OR: [
            { part: { name: { contains: search, mode: "insensitive" } } },
            { part: { brand: { contains: search, mode: "insensitive" } } },
          ],
        }),
      };

      const [total, shops] = await Promise.all([
        ctx.db.shop.count({ where }),
        ctx.db.shop.findMany({
          where,
          skip,
          take: pageSize,
          include: {
            part: true,
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return { data: shops, meta: buildPaginationMeta(total, page, pageSize) };
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["pending", "confirmed", "cancelled"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const shop = await ctx.db.shop.findFirst({
        where: { id: input.id },
        include: { part: { include: { dealership: true } } },
      });

      const isOwner = shop?.part.dealership.userId === ctx.session.user.id;
      const isAdmin = ctx.session.user.role === "admin";

      if (!shop || (!isOwner && !isAdmin))
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });

      return ctx.db.shop.update({
        where: { id: input.id },
        data: { status: input.status },
        include: { part: true, user: true },
      });
    }),
  /**
   * Create a new shop (order part)
   */
  create: protectedProcedure
    .input(z.object({ partId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const part = await ctx.db.part.findFirst({
        where: { id: input.partId, availability: true },
      });

      if (!part) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pièce non disponible",
        });
      }

      return ctx.db.shop.create({
        data: {
          partId: input.partId,
          userId: ctx.session.user.id,
          status: "pending",
        },
        include: { part: true },
      });
    }),

  /**
   * Get user's shop orders (with pagination + search)
   */
  getMyShops: protectedProcedure
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

      const where: Prisma.ShopWhereInput = {
        userId: ctx.session.user.id,
        ...buildSearchWhere(search),
      };

      const [total, shops] = await Promise.all([
        ctx.db.shop.count({ where }),
        ctx.db.shop.findMany({
          where,
          skip,
          take: pageSize,
          include: { part: true },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return {
        data: shops,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),

  /**
   * Cancel shop (user)
   */
  cancel: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const shop = await ctx.db.shop.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
          status: "pending",
        },
      });

      if (!shop) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Commande non trouvée ou déjà traitée",
        });
      }

      return ctx.db.shop.update({
        where: { id: input.id },
        data: { status: "cancelled" },
      });
    }),

  /**
   * Get shop stats for dealership
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const dealership = await ctx.db.dealership.findFirst({
      where: { userId: ctx.session.user.id },
      select: { id: true },
    });

    if (!dealership)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Dealership not found",
      });

    const [total, pending, confirmed, cancelled] = await Promise.all([
      ctx.db.shop.count({ where: { part: { dealershipId: dealership.id } } }),
      ctx.db.shop.count({
        where: { part: { dealershipId: dealership.id }, status: "pending" },
      }),
      ctx.db.shop.count({
        where: { part: { dealershipId: dealership.id }, status: "confirmed" },
      }),
      ctx.db.shop.count({
        where: { part: { dealershipId: dealership.id }, status: "cancelled" },
      }),
    ]);

    return { total, pending, confirmed, cancelled };
  }),
});
