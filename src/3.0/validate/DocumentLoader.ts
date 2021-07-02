import { JsonLd, RemoteDocument } from "jsonld/jsonld-spec";
import fetch, { Response } from "node-fetch";

const preloadedContextUrls: string[] = [
  "https://www.w3.org/2018/credentials/v1",
  "https://www.w3.org/2018/credentials/examples/v1",
  "https://schemata.openattestation.com/com/openattestation/1.0/DrivingLicenceCredential.json",
  "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
  "https://schemata.openattestation.com/com/openattestation/1.0/CustomContext.json",
];

// Module scoped - subsequent imports and calls to ContextLoader.loadContext will receive the latest updated value of contextMap and isCached
// https://stackoverflow.com/a/48173881/6514532
const contextMap: Map<string, RemoteDocument> = new Map();

let isCached: Promise<true>;

export class ContextLoader {
  constructor() {
    if (isCached == null) {
      isCached = this.preLoad();
    }
  }

  private async fetchContext(url: string): Promise<any> {
    const repsonse: Response = await fetch(url, { headers: { accept: "application/json" } });
    return repsonse.json();
  }

  // There is ambiguity between the objects fetched from the url
  // they can be of type RemoteDocument or JsonLd
  private isRemoteDocument(obj: RemoteDocument | JsonLd): obj is RemoteDocument {
    return (obj as RemoteDocument).document !== undefined && (obj as RemoteDocument).documentUrl !== undefined;
  }

  private async preLoad(): Promise<true> {
    const promises: Promise<null>[] = preloadedContextUrls.map(async (url) => {
      const jsonLdObj: JsonLd = await this.fetchContext(url);
      const remoteDocument: RemoteDocument = {
        contextUrl: undefined,
        document: jsonLdObj,
        documentUrl: url,
      };
      contextMap.set(url, remoteDocument);
      return null;
    });
    // let all promises resolve or reject concurrently
    // return true when all promises have completed, regardless of outcome
    await Promise.allSettled(promises);
    return true;
  }

  async loadContext(url: string): Promise<RemoteDocument> {
    // wait for caching to complete
    await isCached;

    // if cache has the url, and the value is not null
    if (contextMap.get(url) != null) {
      console.trace(`preloaded key found: ${url}`);
      return contextMap.get(url) as RemoteDocument;
    }

    const jsonLdObj = await this.fetchContext(url);
    if (this.isRemoteDocument(jsonLdObj)) {
      contextMap.set(url, jsonLdObj);
    } else {
      const remoteDocument: RemoteDocument = {
        contextUrl: undefined,
        document: jsonLdObj,
        documentUrl: url,
      };
      contextMap.set(url, remoteDocument);
    }

    return contextMap.get(url) as RemoteDocument;
  }
}
