import { Literal, String } from "runtypes";
import { ethers } from "ethers";
export var SchemaId;
(function (SchemaId) {
    SchemaId["v2"] = "https://schema.openattestation.com/2.0/schema.json";
    SchemaId["v3"] = "https://schema.openattestation.com/3.0/schema.json";
})(SchemaId || (SchemaId = {}));
export var OpenAttestationHexString = String.withConstraint(function (value) { return ethers.utils.isHexString("0x" + value, 32) || value + " has not the expected length of 32 bytes"; });
export var SignatureAlgorithm = Literal("OpenAttestationMerkleProofSignature2018");
export var ProofType = Literal("OpenAttestationSignature2018");
export var ProofPurpose = Literal("assertionMethod");
