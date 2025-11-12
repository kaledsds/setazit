import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { dealershipRouter } from "./routers/dealership";
import { carRouter } from "./routers/car";
import { partRouter } from "./routers/part";
import { garageRouter } from "./routers/garage";
import { clientRouter } from "./routers/client";
import { orderRouter } from "./routers/order";
import { reviewRouter } from "./routers/review";
import { checkUserRouter } from "./routers/check-user";
import { sessionRouter } from "./routers/session";
import { shopRouter } from "./routers/shop";
import { profileRouter } from "./routers/profile";

export const appRouter = createTRPCRouter({
  dealership: dealershipRouter,
  car: carRouter,
  part: partRouter,
  garage: garageRouter,
  clients: clientRouter,
  order: orderRouter,
  shop: shopRouter,
  review: reviewRouter,
  checkUser: checkUserRouter,
  session: sessionRouter,
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
