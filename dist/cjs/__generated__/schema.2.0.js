"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevocationType = exports.IdentityProofType = exports.TemplateType = void 0;
/**
 * Type of renderer template
 */
var TemplateType;
(function (TemplateType) {
    TemplateType["EmbeddedRenderer"] = "EMBEDDED_RENDERER";
})(TemplateType = exports.TemplateType || (exports.TemplateType = {}));
var IdentityProofType;
(function (IdentityProofType) {
    IdentityProofType["DNSDid"] = "DNS-DID";
    IdentityProofType["DNSTxt"] = "DNS-TXT";
    IdentityProofType["Did"] = "DID";
})(IdentityProofType = exports.IdentityProofType || (exports.IdentityProofType = {}));
var RevocationType;
(function (RevocationType) {
    RevocationType["None"] = "NONE";
    RevocationType["RevocationStore"] = "REVOCATION_STORE";
})(RevocationType = exports.RevocationType || (exports.RevocationType = {}));
