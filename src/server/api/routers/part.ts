import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { partInputSchema } from "@/validation/part/partInputSchema";
import { editPartSchema } from "@/validation/part/editPartSchema";
import { TRPCError } from "@trpc/server";

const buildSearchWhere = (search?: string) => {
  if (!search) return {};
  return {
    OR: [
      { name: { contains: search, mode: "insensitive" as const } },
      { brand: { contains: search, mode: "insensitive" as const } },
      { model: { contains: search, mode: "insensitive" as const } },
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
  create: protectedProcedure
    .input(partInputSchema)
    .mutation(async ({ ctx, input }) => {
      const dealership = await ctx.db.dealership.findFirst({
        where: { userId: ctx.session.user.id },
      });
      if (!dealership)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dealership not found",
        });

      return ctx.db.part.create({
        data: { ...input, dealershipId: dealership.id },
      });
    }),

  edit: protectedProcedure
    .input(editPartSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const part = await ctx.db.part.findFirst({
        where: { id, dealership: { userId: ctx.session.user.id } },
      });
      if (!part)
        throw new TRPCError({ code: "NOT_FOUND", message: "Part not found" });

      return ctx.db.part.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const part = await ctx.db.part.findFirst({
        where: { id: input.id, dealership: { userId: ctx.session.user.id } },
      });
      if (!part)
        throw new TRPCError({ code: "NOT_FOUND", message: "Part not found" });

      return ctx.db.part.delete({ where: { id: input.id } });
    }),

  getMyParts: protectedProcedure
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

      const where = {
        dealership: { userId: ctx.session.user.id },
        ...buildSearchWhere(search),
      };

      const [total, parts] = await Promise.all([
        ctx.db.part.count({ where }),
        ctx.db.part.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return { data: parts, meta: buildPaginationMeta(total, page, pageSize) };
    }),
});
