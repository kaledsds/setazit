// src/server/api/routers/part.ts
import { partInputSchema } from "@/validation/part/partInputSchema";
import { editPartSchema } from "@/validation/part/editPartSchema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import type { Prisma } from "@prisma/client";

// Re-use the same helpers
const buildSearchWhere = (search?: string) => {
  if (!search) return {};

  return {
    OR: [
      { name: { contains: search, mode: "insensitive" as const } },
      { brand: { contains: search, mode: "insensitive" as const } },
      { model: { contains: search, mode: "insensitive" as const } },
      { price: { contains: search, mode: "insensitive" as const } },
      ...(isNaN(Number(search)) ? [] : [{ condition: Number(search) }]),
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

export const partRouter = createTRPCRouter({
  /**
   * Get all parts with pagination, search, and filters
   */
  getAll: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
        brand: z.string().optional(),
        model: z.string().optional(),
        conditionMin: z.number().optional(),
        conditionMax: z.number().optional(),
        priceMin: z.string().optional(),
        priceMax: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        page,
        pageSize,
        search,
        brand,
        model,
        conditionMin,
        conditionMax,
      } = input;
      const skip = (page - 1) * pageSize;

      const where: Prisma.PartWhereInput = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { brand: { contains: search, mode: "insensitive" } },
          { model: { contains: search, mode: "insensitive" } },
          { price: { contains: search, mode: "insensitive" } },
        ];
      }

      if (brand) where.brand = { contains: brand, mode: "insensitive" };
      if (model) where.model = { contains: model, mode: "insensitive" };

      if (conditionMin || conditionMax) {
        where.condition = {};
        if (conditionMin) where.condition.gte = conditionMin;
        if (conditionMax) where.condition.lte = conditionMax;
      }

      const total = await ctx.db.part.count({ where });
      const parts = await ctx.db.part.findMany({
        where,
        skip,
        take: pageSize,
        include: { dealership: true },
        orderBy: { createdAt: "desc" },
      });

      return {
        data: parts,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),

  /**
   * Get parts by dealership (owner)
   */
  getMyParts: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
        availability: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search, availability } = input;
      const skip = (page - 1) * pageSize;

      const searchWhere = buildSearchWhere(search);
      const where = {
        dealership: { userId: ctx.session.user.id },
        ...searchWhere,
        ...(availability !== undefined && { availability }),
      };

      const total = await ctx.db.part.count({ where });
      const parts = await ctx.db.part.findMany({
        where,
        skip,
        take: pageSize,
        include: { dealership: true, shop: true },
        orderBy: { createdAt: "desc" },
      });

      return {
        data: parts,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),

  /**
   * Create part
   */
  createPart: protectedProcedure
    .input(partInputSchema)
    .mutation(async ({ ctx, input }) => {
      const dealership = await ctx.db.dealership.findFirst({
        where: { userId: ctx.session.user.id },
        select: { id: true },
      });

      if (!dealership)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dealership not found",
        });

      return ctx.db.part.create({
        data: {
          dealershipId: dealership.id,
          ...input,
        },
        include: { dealership: true },
      });
    }),

  /**
   * Edit part
   */
  editPart: protectedProcedure
    .input(editPartSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const part = await ctx.db.part.findFirst({
        where: {
          id,
          dealership: { userId: ctx.session.user.id },
        },
      });

      if (!part)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Part not found or unauthorized",
        });

      return ctx.db.part.update({
        where: { id },
        data,
        include: { dealership: true },
      });
    }),

  /**
   * Delete part
   */
  deletePart: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const part = await ctx.db.part.findFirst({
        where: {
          id: input.id,
          dealership: { userId: ctx.session.user.id },
        },
      });

      if (!part)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Part not found or unauthorized",
        });

      return ctx.db.part.delete({ where: { id: input.id } });
    }),

  /**
   * Get part by ID
   */
  getPartById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const part = await ctx.db.part.findFirst({
        where: { id: input.id },
        include: {
          dealership: {
            include: {
              user: {
                select: { id: true, name: true, email: true, image: true },
              },
            },
          },
          shop: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      });

      if (!part)
        throw new TRPCError({ code: "NOT_FOUND", message: "Part not found" });

      return part;
    }),

  /**
   * Get part stats
   */
  getPartStats: protectedProcedure.query(async ({ ctx }) => {
    const dealership = await ctx.db.dealership.findFirst({
      where: { userId: ctx.session.user.id },
      select: { id: true },
    });

    if (!dealership)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Dealership not found",
      });

    const [total, available, unavailable, ordered] = await Promise.all([
      ctx.db.part.count({ where: { dealershipId: dealership.id } }),
      ctx.db.part.count({
        where: { dealershipId: dealership.id, availability: true },
      }),
      ctx.db.part.count({
        where: { dealershipId: dealership.id, availability: false },
      }),
      ctx.db.part.count({
        where: { dealershipId: dealership.id, shop: { some: {} } },
      }),
    ]);

    return { total, available, unavailable, ordered };
  }),
});
