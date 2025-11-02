// src/server/api/routers/garage.ts
import { garageInputSchema } from "@/validation/garage/garageInputSchema";
import { editGarageSchema } from "@/validation/garage/editGarageSchema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import type { Prisma } from "@prisma/client";

const buildSearchWhere = (search?: string) => {
  if (!search) return {};

  return {
    OR: [
      { name: { contains: search, mode: "insensitive" as const } },
      { address: { contains: search, mode: "insensitive" as const } },
      { services: { contains: search, mode: "insensitive" as const } },
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
  /**
   * Get all garages with pagination, search, and filters
   */
  getAll: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
        name: z.string().optional(),
        address: z.string().optional(),
        services: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search, name, address, services } = input;
      const skip = (page - 1) * pageSize;

      const where: Prisma.GarageWhereInput = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
          { services: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ];
      }

      if (name) where.name = { contains: name, mode: "insensitive" };
      if (address) where.address = { contains: address, mode: "insensitive" };
      if (services) where.services = { contains: services, mode: "insensitive" };

      const total = await ctx.db.garage.count({ where });
      const garages = await ctx.db.garage.findMany({
        where,
        skip,
        take: pageSize,
        include: { dealership: true, reviews: true },
        orderBy: { createdAt: "desc" },
      });

      return {
        data: garages,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),

  /**
   * Get garages by dealership (owner)
   */
  getMyGarages: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
        availability: z.boolean().optional(),
      })
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

      const total = await ctx.db.garage.count({ where });
      const garages = await ctx.db.garage.findMany({
        where,
        skip,
        take: pageSize,
        include: { dealership: true, reviews: true },
        orderBy: { createdAt: "desc" },
      });

      return {
        data: garages,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),

  /**
   * Create garage
   */
  createGarage: protectedProcedure
    .input(garageInputSchema)
    .mutation(async ({ ctx, input }) => {
      const dealership = await ctx.db.dealership.findFirst({
        where: { userId: ctx.session.user.id },
        select: { id: true },
      });

      if (!dealership) throw new TRPCError({ code: "NOT_FOUND", message: "Dealership not found" });

      return ctx.db.garage.create({
        data: {
          dealershipId: dealership.id,
          ...input,
        },
        include: { dealership: true },
      });
    }),

  /**
   * Edit garage
   */
  editGarage: protectedProcedure
    .input(editGarageSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const garage = await ctx.db.garage.findFirst({
        where: {
          id,
          dealership: { userId: ctx.session.user.id },
        },
      });

      if (!garage) throw new TRPCError({ code: "NOT_FOUND", message: "Garage not found or unauthorized" });

      return ctx.db.garage.update({
        where: { id },
        data,
        include: { dealership: true },
      });
    }),

  /**
   * Delete garage
   */
  deleteGarage: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const garage = await ctx.db.garage.findFirst({
        where: {
          id: input.id,
          dealership: { userId: ctx.session.user.id },
        },
      });

      if (!garage) throw new TRPCError({ code: "NOT_FOUND", message: "Garage not found or unauthorized" });

      return ctx.db.garage.delete({ where: { id: input.id } });
    }),

  /**
   * Get garage by ID
   */
  getGarageById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const garage = await ctx.db.garage.findFirst({
        where: { id: input.id },
        include: {
          dealership: {
            include: {
              user: { select: { id: true, name: true, email: true, image: true } },
            },
          },
          reviews: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      });

      if (!garage) throw new TRPCError({ code: "NOT_FOUND", message: "Garage not found" });

      return garage;
    }),

  /**
   * Get garage stats
   */
  getGarageStats: protectedProcedure.query(async ({ ctx }) => {
      const dealership = await ctx.db.dealership.findFirst({
        where: { userId: ctx.session.user.id },
        select: { id: true },
      });

      if (!dealership) throw new TRPCError({ code: "NOT_FOUND", message: "Dealership not found" });

      const [total, open, closed, reviewed] = await Promise.all([
        ctx.db.garage.count({ where: { dealershipId: dealership.id } }),
        ctx.db.garage.count({ where: { dealershipId: dealership.id, availability: true } }),
        ctx.db.garage.count({ where: { dealershipId: dealership.id, availability: false } }),
        ctx.db.garage.count({ where: { dealershipId: dealership.id, reviews: { some: {} } } }),
      ]);

      return { total, open, closed, reviewed };
    }),
});