import { WrappedDocument } from "./types";
import { WrapDocumentOptionV3 } from "../shared/@types/wrap";
import { OpenAttestationDocument } from "../__generated__/schema.3.0";
export declare const wrapDocument: <T extends OpenAttestationDocument>(credential: T, options: WrapDocumentOptionV3) => Promise<WrappedDocument<T>>;
export declare const wrapDocuments: <T extends OpenAttestationDocument>(documents: T[], options: WrapDocumentOptionV3) => Promise<WrappedDocument<T>[]>;
