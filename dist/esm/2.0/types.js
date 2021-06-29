import { OpenAttestationHexString, ProofPurpose, ProofType } from "../shared/@types/document";
import { Array as RunTypesArray, Literal, Partial, Record as RunTypesRecord, String } from "runtypes";
export var ObfuscationMetadata = Partial({
    obfuscatedData: RunTypesArray(OpenAttestationHexString),
});
export var Proof = RunTypesRecord({
    type: ProofType,
    created: String,
    proofPurpose: ProofPurpose,
    verificationMethod: String,
    signature: String,
});
export var ArrayProof = RunTypesArray(Proof);
export var Signature = RunTypesRecord({
    type: Literal("SHA3MerkleProof"),
    targetHash: String,
    merkleRoot: String,
    proof: RunTypesArray(String),
});
export var SignatureStrict = Signature.And(RunTypesRecord({
    targetHash: OpenAttestationHexString,
    merkleRoot: OpenAttestationHexString,
    proof: RunTypesArray(OpenAttestationHexString),
}));
export * from "../__generated__/schema.2.0";
