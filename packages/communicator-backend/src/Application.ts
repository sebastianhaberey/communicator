import { destroyLogger, initLogger, logger } from "./bean/Logger";
import Koa from "koa";
import { Server as HttpServer } from "http";
import { promisify } from "util";
import router from "./router/Router";
import { configuration, configurationPath } from "./bean/Configuration";
import yargs from "yargs";
import {
  getArguments,
  getWorkingDirectory,
  renderArgs,
  resolvePath,
} from "./function/MiscFunctions";
import { initClient } from "./bean/Nextcloud";

const cors = require("@koa/cors");
const serve = require("koa-static");
const { historyApiFallback } = require("koa2-connect-history-api-fallback");

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

  const koa = new Koa();
  koa.use(cors());
  koa.silent = true;
  koa.on("error", errorHandler);
  koa.use(router.routes());

  const directory = configuration.staticDirectory;
  if (directory) {
    koa.use(historyApiFallback({ index: "index.html" })); // see https://www.programmersought.com/article/61056399830/

    const resolvedDirectory = resolvePath(directory);
    koa.use(serve(resolvedDirectory));

    logger.info(
      "Serving frontend (%s) at %s",
      resolvedDirectory,
      serverAddress,
    );
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
      logger.info("Working directory: %s", getWorkingDirectory());
      logger.info("Configuration file: %s", configurationPath);

      logger.info(
        "scanservjs base URL: %s",
        configuration?.scanservjs?.baseUrl,
      );

      logger.info("Initializing WebDAV client");
      initClient(
        configuration.webdav.files.url,
        configuration.webdav.username,
        configuration.webdav.password,
      );

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
