import { logger } from "../logger/Logger";

const { spawn } = require("child_process");

export async function shutdown(): Promise<number> {
  logger.info("Shutting down");

  const runner = spawn("./shutdown-wrapper.sh");

  runner.stdout.on("data", (data: string) => {
    console.log(`stdout: ${data}`);
  });

  runner.stderr.on("data", (data: string) => {
    console.log(`stderr: ${data}`);
  });

  return new Promise((resolve) => {
    runner.on("close", (code: number) => {
      resolve(code);
    });
  });
}
