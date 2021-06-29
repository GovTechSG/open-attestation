import { SchemaId } from "./document";
export interface WrapDocumentOption {
    externalSchemaId?: string;
    version?: SchemaId;
}
export interface WrapDocumentOptionV2 {
    externalSchemaId?: string;
    version?: SchemaId.v2;
}
export interface WrapDocumentOptionV3 {
    externalSchemaId?: string;
    version: SchemaId.v3;
}
export declare const isWrapDocumentOptionV3: (options: any) => options is WrapDocumentOptionV3;
