import { createClient, WebDAVClient } from "webdav";
import * as Stream from "stream";

let client: WebDAVClient;

export function initClient(
  url: string,
  username: string,
  password: string,
): void {
  client = createClient(url, { username, password });
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
