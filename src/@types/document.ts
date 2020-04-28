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

export interface ProofSigningOptions {
  privateKey: string;
  verificationMethod: string;
  type: string;
  proofPurpose?: string;
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

export interface Proof {
  type: string;
  created: string;
  proofPurpose: string;
  verificationMethod: string;
  signature: string;
}

export interface WrappedDocument<T = any> {
  version: SchemaId;
  signature: Signature;
  data: DeepStringify<T>;
  schema?: string;
  privacy?: ObfuscationMetadata;
  proof?: Proof;
}

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
    : number extends T[P] // if it's a number
    ? string // make it a string
    : undefined extends T[P] // if it's an optional field
    ? DeepStringify<T[P]> // stringify the type
    : string; // default to string
};
