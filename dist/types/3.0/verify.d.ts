import { WrappedDocument } from "./types";
export declare const verify: <T extends WrappedDocument<import("./types").OpenAttestationDocument>>(document: T) => document is WrappedDocument<T>;
