import { OpenAttestationHexString, ProofPurpose, SignatureAlgorithm } from "../shared/@types/document";
import { Array as RunTypesArray, Record as RunTypesRecord, String } from "runtypes";
export var ObfuscationMetadata = RunTypesRecord({
    obfuscated: RunTypesArray(OpenAttestationHexString),
});
export var VerifiableCredentialWrappedProof = RunTypesRecord({
    type: SignatureAlgorithm,
    targetHash: String,
    merkleRoot: String,
    proofs: RunTypesArray(String),
    salts: String,
    privacy: ObfuscationMetadata,
    proofPurpose: ProofPurpose,
});
export var VerifiableCredentialWrappedProofStrict = VerifiableCredentialWrappedProof.And(RunTypesRecord({
    targetHash: OpenAttestationHexString,
    merkleRoot: OpenAttestationHexString,
    proofs: RunTypesArray(OpenAttestationHexString),
}));
export var VerifiableCredentialSignedProof = VerifiableCredentialWrappedProof.And(RunTypesRecord({
    key: String,
    signature: String,
}));
export * from "../__generated__/schema.3.0";
