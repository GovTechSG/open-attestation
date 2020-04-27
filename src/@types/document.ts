import { OpenAttestationDocument, Proof } from "../__generated__/schemaV3";

export type SignatureProofAlgorithm = "SHA3MerkleProof";

export enum SchemaId {
  v2 = "https://schema.openattestation.com/2.0/schema.json",
  v3 = "https://schema.openattestation.com/3.0/schema.json"
}

export interface Signature {
  type: SignatureProofAlgorithm;
  targetHash: string;
  proof: string[];
  merkleRoot: string;
}

export interface ObfuscationMetadata {
  obfuscatedData?: string[];
}

export interface SchematisedDocument<T = any> {
  version: SchemaId;
  data: DeepStringify<T>;
  schema?: string;
  privacy?: ObfuscationMetadata;
}

export interface WrappedDocument<T = any> {
  version: SchemaId;
  signature: Signature;
  data: DeepStringify<T>;
  schema?: string;
  privacy?: ObfuscationMetadata;
}

export interface SignatureV3 {
  type: SignatureProofAlgorithm;
  targetHash: string;
  proof: string[];
  merkleRoot: string;
  salts: Salt[];
  privacy: { obfuscatedData: string[] };
}
export interface Salt {
  type: string;
  value: string;
  path: string;
}
export interface VerifiableCredentialProof extends Proof {
  signature: SignatureV3;
}
export type VerifiableCredential<T extends OpenAttestationDocument> = T & {
  version: SchemaId.v3;
  schema?: string;
  proof: VerifiableCredentialProof;
};

// feel free to improve, as long as this project compile without changes :)
// once salted, every property is turned into a string
export type DeepStringify<T> = {
  [P in keyof T]: T[P] extends Array<number> // if it's a []number
    ? Array<string> // return []string
    : T[P] extends Array<string> // if it's []string
    ? Array<string> // return []string
    : T[P] extends Record<string, any> // if it's an object
    ? DeepStringify<T[P]> // apply stringify on the object
    : T[P] extends Array<Record<string, infer U>> // if it's an array of object
    ? DeepStringify<U> // apply stringify on the array
    : number extends T[P] // if it's a numberz
    ? number // make it a string
    : undefined extends T[P] // if it's an optional field
    ? DeepStringify<T[P]> // stringify the type
    : T[P] extends string // if it's a string
    ? string // make it a string
    : DeepStringify<T[P]>; // unknown case => apply stringify, known use case: union (Issuer | string)
};
