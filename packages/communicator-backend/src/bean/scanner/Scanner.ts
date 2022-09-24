import { logger } from "../logger/Logger";

const { spawn } = require("child_process");

const FILES_DIRECTORY = "files";

export interface ScanOptions {
  format?: string; // pnm|tiff|png|jpeg|pdf
  mode?: string; // color|cray
  resolution?: number; // 4800|2400|1200|600|300|150|100|75
  x?: number; // 0 - 216.7
  y?: number; // 0 - 300
}

const defaultScanOptions: ScanOptions = {
  format: "jpeg",
  mode: "color",
  resolution: 300,
  x: 210,
  y: 297,
};

export async function scan(scanOptions: ScanOptions = {}): Promise<number> {
  const options = { ...defaultScanOptions, ...scanOptions };

  const runner = spawn("scanimage", [
    `--format=${options.format}`,
    `--mode=${options.mode}`,
    "--progress",
    `--resolution=${options.resolution}`,
    `-x ${options.x}`,
    `-y ${options.y}`,
    `--output-file=${FILES_DIRECTORY}/image.jpg`,
  ]);
  // const runner = spawn("pwd");

  logger.info("Starting scan");

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

// scanimage --format=jpeg --mode=color --progress --resolution=300 -x 210 -y 297 > image.jpg
