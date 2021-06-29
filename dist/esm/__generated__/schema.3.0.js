export var IdentityProofType;
(function (IdentityProofType) {
    IdentityProofType["DNSDid"] = "DNS-DID";
    IdentityProofType["DNSTxt"] = "DNS-TXT";
    IdentityProofType["Did"] = "DID";
})(IdentityProofType || (IdentityProofType = {}));
/**
 * Proof Open Attestation method
 */
export var Method;
(function (Method) {
    Method["Did"] = "DID";
    Method["DocumentStore"] = "DOCUMENT_STORE";
    Method["TokenRegistry"] = "TOKEN_REGISTRY";
})(Method || (Method = {}));
/**
 * Revocation method (if required by proof method)
 */
export var RevocationType;
(function (RevocationType) {
    RevocationType["None"] = "NONE";
    RevocationType["RevocationStore"] = "REVOCATION_STORE";
})(RevocationType || (RevocationType = {}));
/**
 * Proof method name as explained by https://www.w3.org/TR/vc-data-model/#types
 */
export var ProofType;
(function (ProofType) {
    ProofType["OpenAttestationProofMethod"] = "OpenAttestationProofMethod";
})(ProofType || (ProofType = {}));
/**
 * Type of renderer template
 */
export var TemplateType;
(function (TemplateType) {
    TemplateType["EmbeddedRenderer"] = "EMBEDDED_RENDERER";
})(TemplateType || (TemplateType = {}));
