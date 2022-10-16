import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { v4 } from "uuid";
import { getReasonPhrase } from "http-status-codes";
import log from "loglevel";

function shortenUuid(id: string): string {
  return id.substr(0, 4);
}

export class QueryError extends Error {
  constructor(error: AxiosError) {
    const status = error.response.status;
    super([status, getReasonPhrase(status)].join(" - "));
  }
}

export async function query<T>(config: AxiosRequestConfig): Promise<T> {
  const queryId = shortenUuid(v4());

  log.debug(`[${queryId}] ${config.method} ${config.url}`);

  return axios(config).then(
    (response) => handleResponse(response, queryId),
    (error) => handleError(error),
  );
}

function handleResponse<T>(response: AxiosResponse<T>, queryId: string): T {
  const status = response.status;
  const reason = getReasonPhrase(status);
  log.debug(`[${queryId}] ${reason} ${status}`);
  return response.data;
}

function handleError(error: AxiosError): Promise<void> {
  return Promise.reject(error.response?.status ? new QueryError(error) : error);
}
