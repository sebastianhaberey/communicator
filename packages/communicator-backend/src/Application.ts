import { destroyLogger, initLogger, logger } from "./bean/logger/Logger";
import Koa from "koa";
import { Server as HttpServer } from "http";
import { promisify } from "util";
import router from "./router/Router";
import websocketRouter from "./router/WebsocketRouter";
import yargs from "yargs";
import { getArguments, renderArgs } from "./function/MiscFunctions";
import {
  getConfigurationPath,
  getWorkingDirectory,
  resolvePath,
} from "./function/SystemFunctions";
import { getDirectoryContents, initClient } from "./bean/nextcloud/Nextcloud";

const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const serve = require("koa-static");
const { historyApiFallback } = require("koa2-connect-history-api-fallback");
const websockify = require("koa-websocket");

enum ExitCode {
  SUCCESS = 0,
  ERROR,
}

async function forever(): Promise<void> {
  return new Promise(() => {
    // best function ever
  });
}

async function errorHandler(error: Error): Promise<void> {
  logger.error(error.stack);
}

async function createKoa(configuration: any): Promise<HttpServer> {
  logger.info("Starting server");

  const port = configuration.port;
  if (!port) {
    throw new Error("No server port specified");
  }

  const serverAddress = `http://localhost:${port}`;

  const koa = websockify(new Koa());
  koa.use(cors());
  koa.use(bodyParser());
  koa.silent = true;
  koa.on("error", errorHandler);
  koa.use(router.routes());
  koa.ws.use(websocketRouter.routes());

  const directory = configuration.staticDirectory;
  if (directory) {
    koa.use(historyApiFallback({ index: "index.html" })); // see https://www.programmersought.com/article/61056399830/

    const resolvedDirectory = resolvePath(directory);
    koa.use(serve(resolvedDirectory));

    logger.info("Serving frontend at %s %s", serverAddress, resolvedDirectory);
  }

  logger.info("Serving backend at %s/api", serverAddress);

  return koa.listen(port);
}

class Application {
  private server: HttpServer | null = null;

  constructor(private readonly args: any) {}

  public async run(): Promise<number> {
    try {
      initLogger("server", this.args["loglevel"]);
      logger.info("Started with arguments: %s", renderArgs(process.argv));

      logger.info("Working diretory: %s", getWorkingDirectory());

      const configurationPath = getConfigurationPath();
      logger.info("Configuration file: %s", configurationPath);
      const configuration = require(configurationPath);

      logger.info("Initializing WebDAV client");
      initClient(
        configuration.webdav.files.url,
        configuration.webdav.username,
        configuration.webdav.password,
      );

      const contents = await getDirectoryContents();
      logger.info(`Directory contents: ${JSON.stringify(contents)}`);

      this.server = await createKoa(configuration.server);

      await forever();
    } catch (error) {
      logger.error(error.stack);
      return ExitCode.ERROR;
    } finally {
      logger.info("Stopping server");
      if (this.server) {
        await promisify(this.server.close).bind(this.server)();
      }

      await logger.info("Cleanup successful");

      await destroyLogger();
    }
    return ExitCode.SUCCESS;
  }
}

const application = new Application(getArguments(yargs));

application.run().then((value) => (process.exitCode = value));
