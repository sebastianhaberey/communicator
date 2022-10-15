import { createClient, WebDAVClient } from "webdav";
import { FileStat, ResponseDataDetailed } from "webdav/dist/node/types";
import * as Stream from "stream";

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

export async function uploadFile(
  filename: string,
  fileContent: Stream,
): Promise<void> {
  return new Promise((resolve, reject) =>
    fileContent
      .pipe(client.createWriteStream(filename, { overwrite: true }))
      .on("finish", () => {
        resolve();
      })
      .on("error", () => {
        reject();
      }),
  );
}
