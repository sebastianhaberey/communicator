const COMMUNICATOR_BACKEND_URL = "/api";
const SCANNER_BACKEND_URL = "/foo";

export type QueryParameters = globalThis.Record<string, string | string[]>;

export interface Query {
  url: string;

  params?: QueryParameters;
}
