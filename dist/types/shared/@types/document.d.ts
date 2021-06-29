import { OpenAttestationDocument as OpenAttestationDocumentV2 } from "../../__generated__/schema.2.0";
import { OpenAttestationDocument as OpenAttestationDocumentV3 } from "../../__generated__/schema.3.0";
import { SignedWrappedDocument as SignedWrappedDocumentV2, WrappedDocument as WrappedDocumentV2 } from "../../2.0/types";
import { SignedWrappedDocument as SignedWrappedDocumentV3, WrappedDocument as WrappedDocumentV3 } from "../../3.0/types";
import { Literal, Static, String } from "runtypes";
export declare type OpenAttestationDocument = OpenAttestationDocumentV2 | OpenAttestationDocumentV3;
export declare type WrappedDocument<T extends OpenAttestationDocument> = T extends OpenAttestationDocumentV2 ? WrappedDocumentV2<T> : T extends OpenAttestationDocumentV3 ? WrappedDocumentV3<T> : unknown;
export declare type SignedWrappedDocument<T extends OpenAttestationDocument> = T extends OpenAttestationDocumentV2 ? SignedWrappedDocumentV2<T> : T extends OpenAttestationDocumentV3 ? SignedWrappedDocumentV3<T> : unknown;
export declare enum SchemaId {
    v2 = "https://schema.openattestation.com/2.0/schema.json",
    v3 = "https://schema.openattestation.com/3.0/schema.json"
}
export declare const OpenAttestationHexString: import("runtypes").Constraint<String, string, unknown>;
export declare const SignatureAlgorithm: Literal<"OpenAttestationMerkleProofSignature2018">;
export declare type SignatureAlgorithm = Static<typeof SignatureAlgorithm>;
export declare const ProofType: Literal<"OpenAttestationSignature2018">;
export declare type ProofType = Static<typeof ProofType>;
export declare const ProofPurpose: Literal<"assertionMethod">;
export declare type ProofPurpose = Static<typeof ProofPurpose>;
