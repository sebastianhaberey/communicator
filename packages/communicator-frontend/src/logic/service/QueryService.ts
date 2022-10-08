import log from "loglevel";
import axios, { AxiosError } from "axios";
import { v4 } from "uuid";
import { getReasonPhrase } from "http-status-codes";
import { shortenForLog } from "@/logic/function/PojoFunctions";
import { Query } from "@/logic/function/UrlFunctions";

export enum QueryErrorType {
  MISSING_ELEMENT_ON_TARGET_SITE = "MISSING_ELEMENT_ON_TARGET_SITE",
  CONTENT_NOT_AVAILABLE_ON_TARGET_SITE = "CONTENT_NOT_AVAILABLE_ON_TARGET_SITE",
  TARGET_SITE_DETECTED_BOT = "TARGET_SITE_DETECTED_BOT",
}

export function getMessageForQueryErrorType(errorType: QueryErrorType): string {
  switch (errorType) {
    case QueryErrorType.MISSING_ELEMENT_ON_TARGET_SITE:
      return "Ein erwartetes Element wurde auf der Zielseite nicht gefunden.";
    case QueryErrorType.CONTENT_NOT_AVAILABLE_ON_TARGET_SITE:
      return "Inhalt wurde auf der Zielseite nicht gefunden.";
    case QueryErrorType.TARGET_SITE_DETECTED_BOT:
      return "Die Zielseite hat einen Bot erkannt.";
  }
}

export class QueryError extends Error {
  errorType: QueryErrorType;

  constructor(error: AxiosError) {
    const status = error.response.status;
    const errorType = error.response.headers["error-type"];
    super([status, getReasonPhrase(status), errorType].join(" - "));
    // this.errorType = errorType;
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
