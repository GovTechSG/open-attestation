/// <reference types="node" />
import { OpenAttestationDocument as OpenAttestationDocumentV2 } from "../../__generated__/schema.2.0";
import { OpenAttestationDocument as OpenAttestationDocumentV3 } from "../../__generated__/schema.3.0";
import { WrappedDocument as WrappedDocumentV2 } from "../../2.0/types";
import { WrappedDocument as WrappedDocumentV3 } from "../../3.0/types";
import { ErrorObject } from "ajv";
export declare type Hash = string | Buffer;
declare type Extract<P> = P extends WrappedDocumentV2<infer T> ? T : never;
export declare const getData: <T extends WrappedDocumentV2<OpenAttestationDocumentV2>>(document: T) => Extract<T>;
/**
 * Sorts the given Buffers lexicographically and then concatenates them to form one continuous Buffer
 */
export declare function bufSortJoin(...args: Buffer[]): Buffer;
export declare function hashToBuffer(hash: Hash): Buffer;
export declare function toBuffer(element: any): Buffer;
/**
 * Turns array of data into sorted array of hashes
 */
export declare function hashArray(arr: any[]): Buffer[];
/**
 * Returns the keccak hash of two buffers after concatenating them and sorting them
 * If either hash is not given, the input is returned
 */
export declare function combineHashBuffers(first?: Buffer, second?: Buffer): Buffer;
/**
 * Returns the keccak hash of two string after concatenating them and sorting them
 * If either hash is not given, the input is returned
 * @param first A string to be hashed (without 0x)
 * @param second A string to be hashed (without 0x)
 * @returns Resulting string after the hash is combined (without 0x)
 */
export declare function combineHashString(first?: string, second?: string): string;
export declare function getIssuerAddress(document: any): any;
export declare const getMerkleRoot: (document: any) => string;
export declare const getTargetHash: (document: any) => string;
export declare const isTransferableAsset: (document: any) => boolean;
export declare const getAssetId: (document: any) => string;
export declare class SchemaValidationError extends Error {
    validationErrors: ErrorObject[];
    document: any;
    constructor(message: string, validationErrors: ErrorObject[], document: any);
}
export declare const isSchemaValidationError: (error: any) => error is SchemaValidationError;
export { keccak256 } from "js-sha3";
export declare const isObfuscated: (document: WrappedDocumentV3<OpenAttestationDocumentV3> | WrappedDocumentV2<OpenAttestationDocumentV2>) => boolean;
export declare const getObfuscatedData: (document: WrappedDocumentV3<OpenAttestationDocumentV3> | WrappedDocumentV2<OpenAttestationDocumentV2>) => string[];
