"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateType = exports.ProofType = exports.RevocationType = exports.Method = exports.IdentityProofType = void 0;
var IdentityProofType;
(function (IdentityProofType) {
    IdentityProofType["DNSDid"] = "DNS-DID";
    IdentityProofType["DNSTxt"] = "DNS-TXT";
    IdentityProofType["Did"] = "DID";
})(IdentityProofType = exports.IdentityProofType || (exports.IdentityProofType = {}));
/**
 * Proof Open Attestation method
 */
var Method;
(function (Method) {
    Method["Did"] = "DID";
    Method["DocumentStore"] = "DOCUMENT_STORE";
    Method["TokenRegistry"] = "TOKEN_REGISTRY";
})(Method = exports.Method || (exports.Method = {}));
/**
 * Revocation method (if required by proof method)
 */
var RevocationType;
(function (RevocationType) {
    RevocationType["None"] = "NONE";
    RevocationType["RevocationStore"] = "REVOCATION_STORE";
})(RevocationType = exports.RevocationType || (exports.RevocationType = {}));
/**
 * Proof method name as explained by https://www.w3.org/TR/vc-data-model/#types
 */
var ProofType;
(function (ProofType) {
    ProofType["OpenAttestationProofMethod"] = "OpenAttestationProofMethod";
})(ProofType = exports.ProofType || (exports.ProofType = {}));
/**
 * Type of renderer template
 */
var TemplateType;
(function (TemplateType) {
    TemplateType["EmbeddedRenderer"] = "EMBEDDED_RENDERER";
})(TemplateType = exports.TemplateType || (exports.TemplateType = {}));
