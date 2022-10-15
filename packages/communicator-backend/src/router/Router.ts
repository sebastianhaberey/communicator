import Koa from "koa";
import Router from "koa-router";
import { shutdown } from "../bean/system/System";
import { configuration } from "../bean/configuration/Configuration";
import { post } from "../service/QueryService";
import { logger } from "../bean/logger/Logger";

const router = new Router({ prefix: "/api" });

router.post("/shutdown", async (ctx: Koa.Context) => {
  const code = await shutdown();
  if (code === 0) {
    ctx.status = 200;
  } else {
    ctx.status = 500;
  }
});

router.post("/scan", async (ctx: Koa.Context) => {
  const index = Number(ctx.query["index"]);
  if (isNaN(index)) {
    logger.error("Index parameter must be present and a valid number");
    ctx.status = 500;
    return;
  }

  const baseUrl = configuration?.scanservjs?.baseUrl;
  if (!baseUrl) {
    logger.error("scanservjs base URL not configured");
    ctx.status = 500;
    return;
  }
  const url = baseUrl + "/scanner/scan";

  const request = configuration?.scanservjs?.request;
  if (!request) {
    logger.error("scanservjs request not configured");
    ctx.status = 500;
    return;
  }
  request.index = index;

  try {
    await post<void>(url, request);
    ctx.status = 200;
  } catch (e) {
    logger.error(e);
    ctx.status = 500;
  }
});

export default router;
