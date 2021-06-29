/**
 * Type of renderer template
 */
export var TemplateType;
(function (TemplateType) {
    TemplateType["EmbeddedRenderer"] = "EMBEDDED_RENDERER";
})(TemplateType || (TemplateType = {}));
export var IdentityProofType;
(function (IdentityProofType) {
    IdentityProofType["DNSDid"] = "DNS-DID";
    IdentityProofType["DNSTxt"] = "DNS-TXT";
    IdentityProofType["Did"] = "DID";
})(IdentityProofType || (IdentityProofType = {}));
export var RevocationType;
(function (RevocationType) {
    RevocationType["None"] = "NONE";
    RevocationType["RevocationStore"] = "REVOCATION_STORE";
})(RevocationType || (RevocationType = {}));
