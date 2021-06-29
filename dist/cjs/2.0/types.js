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
exports.SignatureStrict = exports.Signature = exports.ArrayProof = exports.Proof = exports.ObfuscationMetadata = void 0;
var document_1 = require("../shared/@types/document");
var runtypes_1 = require("runtypes");
exports.ObfuscationMetadata = runtypes_1.Partial({
    obfuscatedData: runtypes_1.Array(document_1.OpenAttestationHexString),
});
exports.Proof = runtypes_1.Record({
    type: document_1.ProofType,
    created: runtypes_1.String,
    proofPurpose: document_1.ProofPurpose,
    verificationMethod: runtypes_1.String,
    signature: runtypes_1.String,
});
exports.ArrayProof = runtypes_1.Array(exports.Proof);
exports.Signature = runtypes_1.Record({
    type: runtypes_1.Literal("SHA3MerkleProof"),
    targetHash: runtypes_1.String,
    merkleRoot: runtypes_1.String,
    proof: runtypes_1.Array(runtypes_1.String),
});
exports.SignatureStrict = exports.Signature.And(runtypes_1.Record({
    targetHash: document_1.OpenAttestationHexString,
    merkleRoot: document_1.OpenAttestationHexString,
    proof: runtypes_1.Array(document_1.OpenAttestationHexString),
}));
__exportStar(require("../__generated__/schema.2.0"), exports);
