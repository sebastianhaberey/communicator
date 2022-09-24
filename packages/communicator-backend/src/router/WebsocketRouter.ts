import Koa from "koa";
import Router from "koa-router";
import { logger } from "../bean/logger/Logger";

const router = new Router({ prefix: "/api" });

router.all("/websocket", async (ctx: any) => {
  ctx.websocket.send("Hello World!!!");
  ctx.websocket.on("message", function (message: string) {
    logger.info("Message %s", message);
  });
});

export default router;
