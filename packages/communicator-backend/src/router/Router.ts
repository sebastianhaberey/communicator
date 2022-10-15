import Koa from "koa";
import Router from "koa-router";
import { shutdown } from "../bean/system/System";
import { configuration } from "../bean/configuration/Configuration";
import { query } from "../service/QueryService";
import { logger } from "../bean/logger/Logger";
import { ScanservFile } from "../entity/ScanservFile";
import * as Stream from "stream";
import { uploadFile } from "../bean/nextcloud/Nextcloud";

const SCANSERV_BASE_URL = configuration.scanservjs.baseUrl;
const SCANSERV_SCAN_URL = SCANSERV_BASE_URL + "/scanner/scan";
const SCANSERV_FILES_URL = SCANSERV_BASE_URL + "/files";

const router = new Router({ prefix: "/api" });

async function getAllFiles(): Promise<Array<ScanservFile>> {
  return query<Array<ScanservFile>>({
    method: "get",
    url: SCANSERV_FILES_URL,
  });
}

async function getFileContent(filename: string): Promise<Stream> {
  return query<Stream>({
    method: "get",
    url: SCANSERV_FILES_URL + "/" + encodeURI(filename),
    responseType: "stream",
  });
}

async function deleteFile(filename: string): Promise<void> {
  return query({
    method: "delete",
    url: SCANSERV_FILES_URL + "/" + encodeURI(filename),
  });
}

router.post("/shutdown", async (ctx: Koa.Context) => {
  const code = await shutdown();
  if (code === 0) {
    ctx.status = 200;
  } else {
    ctx.status = 500;
  }
});

async function scan(request: any): Promise<void> {
  return query<void>({
    url: SCANSERV_SCAN_URL,
    method: "post",
    data: request,
  });
}

router.post("/scan", async (ctx: Koa.Context) => {
  const index = Number(ctx.query["index"]);
  if (isNaN(index)) {
    logger.error("Index parameter must be present and a valid number");
    ctx.status = 500;
    return;
  }

  if (index > 0) {
    logger.info("Scanning page %s", index);
  } else {
    logger.info("Finalizing scan");
  }

  const request = configuration.scanservjs.request;
  request.index = index;

  try {
    await scan(request);
  } catch (e) {
    logger.error(e);
    ctx.status = 500;
    return;
  }

  ctx.status = 200;
});

router.post("/send", async (ctx: Koa.Context) => {
  const files = await getAllFiles();

  for (const file of files) {
    const filename = file.name;

    logger.info('Sending file to cloud: "%s" (%s)', filename, file.sizeString);

    const stream = await getFileContent(filename);
    await uploadFile(filename, stream);
    await deleteFile(filename);
  }

  ctx.status = 200;
});

export default router;
