import { carInputSchema } from "@/validation/car/carInputSchema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { editCarSchema } from "@/validation/car/editCarSchema";
import { TRPCError } from "@trpc/server";

// Helper function to build search conditions
const buildSearchWhere = (search?: string) => {
  if (!search) return {};

  return {
    OR: [
      { brand: { contains: search, mode: "insensitive" as const } },
      { model: { contains: search, mode: "insensitive" as const } },
      { price: { contains: search, mode: "insensitive" as const } },
      ...(isNaN(Number(search)) ? [] : [{ year: Number(search) }]),
    ],
  };
};

// Helper function to build pagination meta
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

export const carRouter = createTRPCRouter({
  /**
   * Get all cars with pagination and search
   * @access public
   * @returns paginated cars
   */
  getcars: publicProcedure
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

      const searchWhere = buildSearchWhere(search);
      const where = { ...searchWhere };

      const total = await ctx.db.car.count({ where });

      const cars = await ctx.db.car.findMany({
        where,
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
        data: cars,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),

  /**
   * Get cars by client orders with pagination and search
   * @access protected
   * @returns paginated cars
   */
  getcarsByOrder: protectedProcedure
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

      const client = await ctx.db.client.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });

      if (!client) {
        throw new Error("Client not found");
      }

      const searchWhere = buildSearchWhere(search);
      const where = {
        orders: {
          some: {
            clientId: client.id,
          },
        },
        ...searchWhere,
      };

      const total = await ctx.db.car.count({ where });

      const cars = await ctx.db.car.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          dealership: true,
          orders: {
            where: {
              clientId: client.id,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        data: cars,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),

  /**
   * Get car details with pagination
   * @access public
   * @returns paginated cars with details
   */
  getcarsDetails: publicProcedure
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

      const searchWhere = buildSearchWhere(search);
      const where = { ...searchWhere };

      const total = await ctx.db.car.count({ where });

      const cars = await ctx.db.car.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          dealership: {
            include: {
              user: true,
            },
          },
          orders: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        data: cars,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),

  /**
   * Create car post
   * @access protected
   * @schema carInputSchema
   * @returns created car
   */
  createcar: protectedProcedure
    .input(carInputSchema)
    .mutation(async ({ input, ctx }) => {
      const dealership = await ctx.db.dealership.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });

      if (!dealership) {
        throw new Error("Dealership not found");
      }

      const createcarPost = await ctx.db.car.create({
        data: {
          dealershipId: dealership.id,
          ...input,
        },
        include: {
          dealership: true,
        },
      });

      return createcarPost;
    }),

  /**
   * Edit car post
   * @access protected
   * @schema editCarSchema
   * @returns updated car
   */
  editcarPost: protectedProcedure
    .input(editCarSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, image, brand, model, year, price, availability } = input;

      // Verify ownership
      const car = await ctx.db.car.findFirst({
        where: {
          id,
          dealership: {
            userId: ctx.session.user.id,
          },
        },
      });

      if (!car) {
        throw new Error(
          "Car not found or you don't have permission to edit it",
        );
      }

      const editcarPost = await ctx.db.car.update({
        where: {
          id,
        },
        data: {
          image,
          brand,
          model,
          year,
          price,
          availability,
        },
        include: {
          dealership: true,
        },
      });

      return editcarPost;
    }),

  /**
   * Get cars by dealership with pagination and search
   * @access protected
   * @returns paginated cars
   */
  getMycars: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(5),
        search: z.string().optional(),
        availability: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { page, pageSize, search, availability } = input;
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
          ...(availability !== undefined && { availability }),
        };
        const total = await ctx.db.car.count({
          where: owner,
        });

        const cars = await ctx.db.car.findMany({
          where: owner,
          skip,
          take: pageSize,
          include: {
            dealership: true,
            orders: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return {
          data: cars,
          meta: buildPaginationMeta(total, page, pageSize),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching cars",
          cause: error,
        });
      }
    }),
  /**
   * Get cars by dealership ID (without dealership details) with pagination and search
   * @access protected
   * @returns paginated cars
   */
  getcarByDealershipId: protectedProcedure
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
        dealership: {
          userId: ctx.session.user.id,
        },
        ...searchWhere,
        ...(availability !== undefined && { availability }),
      };

      const total = await ctx.db.car.count({ where });

      const cars = await ctx.db.car.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        data: cars,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),

  /**
   * Get car by ID
   * @access public
   * @returns single car
   */
  getcarById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const carPost = await ctx.db.car.findFirst({
        where: {
          id: input.id,
        },
        include: {
          dealership: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          orders: {
            include: {
              client: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!carPost) {
        throw new Error("Car not found");
      }

      return carPost;
    }),

  /**
   * Delete car
   * @access protected
   * @returns deleted car
   */
  deletecar: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const car = await ctx.db.car.findFirst({
        where: {
          id: input.id,
          dealership: {
            userId: ctx.session.user.id,
          },
        },
      });

      if (!car) {
        throw new Error(
          "Car not found or you don't have permission to delete it",
        );
      }

      const deletecar = await ctx.db.car.delete({
        where: {
          id: input.id,
        },
      });

      return deletecar;
    }),

  /**
   * Get available cars only with pagination and search
   * @access public
   * @returns paginated available cars
   */
  getAvailableCars: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
        minYear: z.number().optional(),
        maxYear: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search, minYear, maxYear } = input;
      const skip = (page - 1) * pageSize;

      const searchWhere = buildSearchWhere(search);

      // Build year filter
      const yearFilter: any = {};
      if (minYear) yearFilter.gte = minYear;
      if (maxYear) yearFilter.lte = maxYear;

      const where: any = {
        availability: true,
        ...searchWhere,
        ...(Object.keys(yearFilter).length > 0 && { year: yearFilter }),
      };

      const total = await ctx.db.car.count({ where });

      const cars = await ctx.db.car.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          dealership: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        data: cars,
        meta: buildPaginationMeta(total, page, pageSize),
      };
    }),

  /**
   * Get cars statistics for dealership
   * @access protected
   * @returns car statistics
   */
  getCarStats: protectedProcedure.query(async ({ ctx }) => {
    const dealership = await ctx.db.dealership.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!dealership) {
      throw new Error("Dealership not found");
    }

    const [total, available, unavailable, orderedCars] = await Promise.all([
      ctx.db.car.count({
        where: {
          dealershipId: dealership.id,
        },
      }),
      ctx.db.car.count({
        where: {
          dealershipId: dealership.id,
          availability: true,
        },
      }),
      ctx.db.car.count({
        where: {
          dealershipId: dealership.id,
          availability: false,
        },
      }),
      ctx.db.car.count({
        where: {
          dealershipId: dealership.id,
          orders: {
            some: {},
          },
        },
      }),
    ]);

    return {
      total,
      available,
      unavailable,
      orderedCars,
    };
  }),
});
