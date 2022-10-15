import axios, { AxiosError, AxiosResponse } from "axios";
import { v4 } from "uuid";
import { getReasonPhrase } from "http-status-codes";
import { logger } from "../bean/logger/Logger";

export class QueryError extends Error {
  constructor(error: AxiosError) {
    const status = error.response.status;
    super([status, getReasonPhrase(status)].join(" - "));
  }
}

export async function get<T>(url: string, params?: any): Promise<T> {
  const queryId = v4();

  logger.debug(`${queryId} query: GET ${url}`);

  return axios({
    method: "get",
    url,
    params,
  }).then(
    (response) => handleResponse(response, queryId),
    (error) => handleError(error),
  );
}

export async function post<T>(
  url: string,
  data?: any,
  params?: any,
): Promise<T> {
  const queryId = v4();

  logger.debug(`${queryId} query: POST ${url}`);

  return axios({
    method: "post",
    url,
    data,
    params,
  }).then(
    (response) => handleResponse(response, queryId),
    (error) => handleError(error),
  );
}

function handleResponse<T>(response: AxiosResponse<T>, queryId: string): T {
  const data = response.data;
  const status = response.status;
  const reason = getReasonPhrase(status);
  const message = Array.isArray(data)
    ? `${queryId} response: ${reason} ${status} (${data.length} elements)`
    : `${queryId} response: ${reason} ${status}`;
  logger.debug(message);
  return response.data;
}

function handleError(error: AxiosError): Promise<void> {
  return Promise.reject(error.response?.status ? new QueryError(error) : error);
}
