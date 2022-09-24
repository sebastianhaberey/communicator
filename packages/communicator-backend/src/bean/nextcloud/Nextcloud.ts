import { createClient, WebDAVClient } from "webdav";
import { FileStat, ResponseDataDetailed } from "webdav/dist/node/types";

let client: WebDAVClient;

export function initClient(
  url: string,
  username: string,
  password: string,
): void {
  client = createClient(url, { username, password });
}

export async function getDirectoryContents(): Promise<
  Array<FileStat> | ResponseDataDetailed<Array<FileStat>>
> {
  return client.getDirectoryContents("/");
}
