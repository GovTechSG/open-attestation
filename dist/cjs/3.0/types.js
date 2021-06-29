"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifiableCredentialSignedProof = exports.VerifiableCredentialWrappedProofStrict = exports.VerifiableCredentialWrappedProof = exports.ObfuscationMetadata = void 0;
var document_1 = require("../shared/@types/document");
var runtypes_1 = require("runtypes");
exports.ObfuscationMetadata = runtypes_1.Record({
    obfuscated: runtypes_1.Array(document_1.OpenAttestationHexString),
});
exports.VerifiableCredentialWrappedProof = runtypes_1.Record({
    type: document_1.SignatureAlgorithm,
    targetHash: runtypes_1.String,
    merkleRoot: runtypes_1.String,
    proofs: runtypes_1.Array(runtypes_1.String),
    salts: runtypes_1.String,
    privacy: exports.ObfuscationMetadata,
    proofPurpose: document_1.ProofPurpose,
});
exports.VerifiableCredentialWrappedProofStrict = exports.VerifiableCredentialWrappedProof.And(runtypes_1.Record({
    targetHash: document_1.OpenAttestationHexString,
    merkleRoot: document_1.OpenAttestationHexString,
    proofs: runtypes_1.Array(document_1.OpenAttestationHexString),
}));
exports.VerifiableCredentialSignedProof = exports.VerifiableCredentialWrappedProof.And(runtypes_1.Record({
    key: runtypes_1.String,
    signature: runtypes_1.String,
}));
__exportStar(require("../__generated__/schema.3.0"), exports);
