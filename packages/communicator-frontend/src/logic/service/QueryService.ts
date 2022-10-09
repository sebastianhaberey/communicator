import log from "loglevel";
import axios, { AxiosError } from "axios";
import { v4 } from "uuid";
import { getReasonPhrase } from "http-status-codes";
import { shortenForLog } from "@/logic/function/PojoFunctions";
import { Query } from "@/logic/function/UrlFunctions";

export class QueryError extends Error {
  constructor(error: AxiosError) {
    const status = error.response.status;
    super([status, getReasonPhrase(status)].join(" - "));
  }
}

export async function get<T>(query: Query): Promise<T> {
  const paramsOut = JSON.stringify(query.params);
  const queryId = v4();

  let message = `${queryId} query ${query.url}`;
  if (paramsOut) {
    message += ` ${paramsOut}`;
  }

  log.debug(shortenForLog(message));

  return axios({
    method: "get",
    url: query.url,
    params: query.params,
  }).then(
    (response) => {
      const data = response.data;
      const status = response.status;
      const reason = getReasonPhrase(status);
      const message = Array.isArray(data)
        ? `${queryId} response ${reason} ${status} (${data.length} elements)`
        : `${queryId} response ${reason} ${status}`;
      log.debug(message);
      return data;
    },
    (error) => {
      return Promise.reject(
        error.response?.status ? new QueryError(error) : error,
      );
    },
  );
}
