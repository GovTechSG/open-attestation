import { OpenAttestationDocument } from "../__generated__/schema.2.0";
import { WrappedDocument } from "./types";
export declare const verify: <T extends OpenAttestationDocument = OpenAttestationDocument>(document: any) => document is WrappedDocument<T>;
