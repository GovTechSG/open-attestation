import { OpenAttestationDocument as OpenAttestationDocumentV3 } from "../__generated__/schema.3.0";
import { SchemaId } from "../shared/@types/document";
import { Array as RunTypesArray, Record as RunTypesRecord, Static, String } from "runtypes";
export interface Salt {
    value: string;
    path: string;
}
export declare const ObfuscationMetadata: RunTypesRecord<{
    obfuscated: RunTypesArray<import("runtypes").Constraint<String, string, unknown>, false>;
}, false>;
export declare type ObfuscationMetadata = Static<typeof ObfuscationMetadata>;
export declare const VerifiableCredentialWrappedProof: RunTypesRecord<{
    type: import("runtypes").Literal<"OpenAttestationMerkleProofSignature2018">;
    targetHash: String;
    merkleRoot: String;
    proofs: RunTypesArray<String, false>;
    salts: String;
    privacy: RunTypesRecord<{
        obfuscated: RunTypesArray<import("runtypes").Constraint<String, string, unknown>, false>;
    }, false>;
    proofPurpose: import("runtypes").Literal<"assertionMethod">;
}, false>;
export declare type VerifiableCredentialWrappedProof = Static<typeof VerifiableCredentialWrappedProof>;
export declare const VerifiableCredentialWrappedProofStrict: import("runtypes").Intersect<[RunTypesRecord<{
    type: import("runtypes").Literal<"OpenAttestationMerkleProofSignature2018">;
    targetHash: String;
    merkleRoot: String;
    proofs: RunTypesArray<String, false>;
    salts: String;
    privacy: RunTypesRecord<{
        obfuscated: RunTypesArray<import("runtypes").Constraint<String, string, unknown>, false>;
    }, false>;
    proofPurpose: import("runtypes").Literal<"assertionMethod">;
}, false>, RunTypesRecord<{
    targetHash: import("runtypes").Constraint<String, string, unknown>;
    merkleRoot: import("runtypes").Constraint<String, string, unknown>;
    proofs: RunTypesArray<import("runtypes").Constraint<String, string, unknown>, false>;
}, false>]>;
export declare type VerifiableCredentialWrappedProofStrict = Static<typeof VerifiableCredentialWrappedProofStrict>;
export declare const VerifiableCredentialSignedProof: import("runtypes").Intersect<[RunTypesRecord<{
    type: import("runtypes").Literal<"OpenAttestationMerkleProofSignature2018">;
    targetHash: String;
    merkleRoot: String;
    proofs: RunTypesArray<String, false>;
    salts: String;
    privacy: RunTypesRecord<{
        obfuscated: RunTypesArray<import("runtypes").Constraint<String, string, unknown>, false>;
    }, false>;
    proofPurpose: import("runtypes").Literal<"assertionMethod">;
}, false>, RunTypesRecord<{
    key: String;
    signature: String;
}, false>]>;
export declare type VerifiableCredentialSignedProof = Static<typeof VerifiableCredentialSignedProof>;
export declare type WrappedDocument<T extends OpenAttestationDocumentV3 = OpenAttestationDocumentV3> = T & {
    version: SchemaId.v3;
    schema?: string;
    proof: VerifiableCredentialWrappedProof;
};
export declare type SignedWrappedDocument<T extends OpenAttestationDocumentV3 = OpenAttestationDocumentV3> = WrappedDocument<T> & {
    proof: VerifiableCredentialSignedProof;
};
export * from "../__generated__/schema.3.0";
