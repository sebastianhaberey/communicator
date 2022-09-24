import { Argv } from "yargs";

// Functions that fit nowhere else - find a better place if possible

export function getArguments(argv: Argv): any {
  return argv
    .parserConfiguration({
      "camel-case-expansion": false,
    })
    .help()
    .options({
      "show-browser": {
        type: "boolean",
        description: "Show browser",
        default: false,
      },
      "loglevel": {
        type: "string",
        description: "Log level",
        choices: ["info", "warning", "debug"],
        default: "info",
      },
      "devtools": {
        type: "boolean",
        implies: "show-browser",
        description: "Show dev tools in browser",
        default: false,
      },
      "browser-size": {
        type: "string",
        description: "Set browser size",
        default: "1024,576",
      },
      "browser-position": {
        type: "string",
        description: "Set browser position",
        default: "50,50",
      },
    })
    .wrap(120)
    .alias("h", "help").argv;
}

export function renderArgs(args: string[]): string {
  const argsCopy = Array.from(args);
  argsCopy.splice(0, 2);
  return argsCopy.join(" ");
}
