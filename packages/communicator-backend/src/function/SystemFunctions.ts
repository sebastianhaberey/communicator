const fs = require("fs");
const path = require("path");

export function resolvePath(filePath: string): string {
  return path.resolve(process.cwd(), filePath);
}

export function getWorkingDirectory(): string {
  return resolvePath(".");
}

export function getConfigurationPath(): string {
  return resolvePath(`communicator.config`);
}
