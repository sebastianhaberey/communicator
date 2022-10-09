import Koa from "koa";
import Router from "koa-router";
import { shutdown } from "../bean/system/System";

const router = new Router({ prefix: "/api" });

router.get("/shutdown", async (ctx: Koa.Context) => {
  const code = await shutdown();
  if (code === 0) {
    ctx.status = 200;
  } else {
    ctx.status = 500;
  }
});

export default router;
