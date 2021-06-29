import { OpenAttestationDocument as OpenAttestationDocumentV2 } from "../__generated__/schema.2.0";
import { SchemaId } from "../shared/@types/document";
import { Array as RunTypesArray, Literal, Partial, Record as RunTypesRecord, Static, String } from "runtypes";
export declare const ObfuscationMetadata: Partial<{
    obfuscatedData: RunTypesArray<import("runtypes").Constraint<String, string, unknown>, false>;
}, false>;
export declare type ObfuscationMetadata = Static<typeof ObfuscationMetadata>;
export declare const Proof: RunTypesRecord<{
    type: Literal<"OpenAttestationSignature2018">;
    created: String;
    proofPurpose: Literal<"assertionMethod">;
    verificationMethod: String;
    signature: String;
}, false>;
export declare type Proof = Static<typeof Proof>;
export declare const ArrayProof: RunTypesArray<RunTypesRecord<{
    type: Literal<"OpenAttestationSignature2018">;
    created: String;
    proofPurpose: Literal<"assertionMethod">;
    verificationMethod: String;
    signature: String;
}, false>, false>;
export declare type ArrayProof = Static<typeof ArrayProof>;
export declare const Signature: RunTypesRecord<{
    type: Literal<"SHA3MerkleProof">;
    targetHash: String;
    merkleRoot: String;
    proof: RunTypesArray<String, false>;
}, false>;
export declare type Signature = Static<typeof Signature>;
export declare const SignatureStrict: import("runtypes").Intersect<[RunTypesRecord<{
    type: Literal<"SHA3MerkleProof">;
    targetHash: String;
    merkleRoot: String;
    proof: RunTypesArray<String, false>;
}, false>, RunTypesRecord<{
    targetHash: import("runtypes").Constraint<String, string, unknown>;
    merkleRoot: import("runtypes").Constraint<String, string, unknown>;
    proof: RunTypesArray<import("runtypes").Constraint<String, string, unknown>, false>;
}, false>]>;
export declare type SignatureStrict = Static<typeof SignatureStrict>;
export interface SchematisedDocument<T extends OpenAttestationDocumentV2 = OpenAttestationDocumentV2> {
    version: SchemaId;
    data: DeepStringify<T>;
    schema?: string;
    privacy?: ObfuscationMetadata;
}
export interface WrappedDocument<T extends OpenAttestationDocumentV2 = OpenAttestationDocumentV2> extends SchematisedDocument<T> {
    signature: Signature;
}
export interface SignedWrappedDocument<T extends OpenAttestationDocumentV2 = OpenAttestationDocumentV2> extends WrappedDocument<T> {
    proof: Proof[];
}
export declare type DeepStringify<T> = {
    [P in keyof T]: T[P] extends Array<number> ? Array<string> : T[P] extends Array<string> ? Array<string> : T[P] extends Record<string, any> ? DeepStringify<T[P]> : T[P] extends Array<Record<string, infer U>> ? DeepStringify<U> : number extends T[P] ? string : undefined extends T[P] ? DeepStringify<T[P]> : T[P] extends string ? string : DeepStringify<T[P]>;
};
export * from "../__generated__/schema.2.0";
