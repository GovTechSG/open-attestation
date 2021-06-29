import { OpenAttestationDocument } from "../__generated__/schema.2.0";
import { SchematisedDocument } from "./types";
export declare const flattenHashArray: (data: any) => string[];
export declare const digestDocument: <T extends OpenAttestationDocument = OpenAttestationDocument>(document: SchematisedDocument<T>) => string;
