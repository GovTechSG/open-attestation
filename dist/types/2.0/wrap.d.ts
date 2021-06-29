import { WrappedDocument } from "./types";
import { OpenAttestationDocument } from "../__generated__/schema.2.0";
import { WrapDocumentOptionV2 } from "../shared/@types/wrap";
export declare const wrapDocument: <T extends OpenAttestationDocument = OpenAttestationDocument>(data: T, options?: WrapDocumentOptionV2 | undefined) => WrappedDocument<T>;
export declare const wrapDocuments: <T extends OpenAttestationDocument = OpenAttestationDocument>(data: T[], options?: WrapDocumentOptionV2 | undefined) => WrappedDocument<T>[];
