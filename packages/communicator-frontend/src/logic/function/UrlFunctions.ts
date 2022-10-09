export const COMMUNICATOR_BACKEND_URL = "/api";
export const COMMUNICATOR_BACKEND_SHUTDOWN_URL =
  COMMUNICATOR_BACKEND_URL + "/shutdown";

const SCANNER_BACKEND_URL = "/foo";

export type QueryParameters = globalThis.Record<string, string | string[]>;

export interface Query {
  url: string;

  params?: QueryParameters;
}
