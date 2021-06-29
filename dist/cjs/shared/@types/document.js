"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProofPurpose = exports.ProofType = exports.SignatureAlgorithm = exports.OpenAttestationHexString = exports.SchemaId = void 0;
var runtypes_1 = require("runtypes");
var ethers_1 = require("ethers");
var SchemaId;
(function (SchemaId) {
    SchemaId["v2"] = "https://schema.openattestation.com/2.0/schema.json";
    SchemaId["v3"] = "https://schema.openattestation.com/3.0/schema.json";
})(SchemaId = exports.SchemaId || (exports.SchemaId = {}));
exports.OpenAttestationHexString = runtypes_1.String.withConstraint(function (value) { return ethers_1.ethers.utils.isHexString("0x" + value, 32) || value + " has not the expected length of 32 bytes"; });
exports.SignatureAlgorithm = runtypes_1.Literal("OpenAttestationMerkleProofSignature2018");
exports.ProofType = runtypes_1.Literal("OpenAttestationSignature2018");
exports.ProofPurpose = runtypes_1.Literal("assertionMethod");
