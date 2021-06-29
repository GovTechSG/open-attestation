import { OpenAttestationDocument } from "../__generated__/schema.2.0";
import { WrappedDocument } from "./types";
export declare const obfuscateData: (_data: any, fields: string[] | string) => {
    data: any;
    obfuscatedData: string[];
};
export declare const obfuscateDocument: <T extends OpenAttestationDocument = OpenAttestationDocument>(document: WrappedDocument<T>, fields: string[] | string) => WrappedDocument<T>;
