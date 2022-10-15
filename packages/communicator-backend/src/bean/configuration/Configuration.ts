import { resolvePath } from "../../function/SystemFunctions";

const CONFIGURATION_PATH = `communicator.config`;

export const configurationPath = resolvePath(CONFIGURATION_PATH);
export const configuration = require(configurationPath);
