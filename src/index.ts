import type { Next, ParameterizedContext } from "koa"
import type { CarItem } from "./lib/data"

import Koa from "koa"
import koaCors from "@koa/cors"
import KoaRouter from "@koa/router"

import countBy from "./lib/countBy"
import getCarData from "./lib/data"

interface AppState {}

interface AppContext {
  carData: CarItem[]
}

const app = new Koa<AppState, AppContext>()

app.use(koaCors())

const router = new KoaRouter<AppState, AppContext>()

router.get("/years", assureCarData, async (ctx, next) => {
  const results = countBy(ctx.carData, ctx.query, "year")
  ctx.body = {
    count: results.length,
    results,
  }
})

router.get("/makes", assureCarData, async (ctx, next) => {
  const results = countBy(ctx.carData, ctx.query, "make")
  ctx.body = {
    count: results.length,
    results,
  }
})

router.get("/models", assureCarData, async (ctx, next) => {
  const results = countBy(ctx.carData, ctx.query, "model")
  ctx.body = {
    count: results.length,
    results,
  }
})

router.get("/categories", assureCarData, async (ctx, next) => {
  const results = countBy(ctx.carData, ctx.query, "category")
  ctx.body = {
    count: results.length,
    results,
  }
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(process.env.PORT || 3001)

async function assureCarData(
  ctx: ParameterizedContext<AppState, AppContext>,
  next: Next,
) {
  ctx.carData = await getCarData()

  next()
}
