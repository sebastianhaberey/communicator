import Koa from "koa";
import Router from "koa-router";
import { scan } from "../bean/scanner/Scanner";

const router = new Router({ prefix: "/api" });

router.get("/scan", async (ctx: Koa.Context) => {
  const code = await scan({ resolution: 75 });
  if (code === 0) {
    ctx.status = 200;
  } else {
    ctx.status = 500;
  }
});

export default router;
