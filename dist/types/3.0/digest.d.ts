import { Salt } from "./types";
import { OpenAttestationDocument } from "../__generated__/schema.3.0";
export declare const digestCredential: (document: OpenAttestationDocument, salts: Salt[], obfuscatedData: string[]) => string;
