"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.diagnose = void 0;
var ethers_1 = require("ethers");
var __1 = require("../..");
var validate_1 = require("../validate");
var types_1 = require("../../3.0/types");
var types_2 = require("../../2.0/types");
var lodash_1 = require("lodash");
var ajv_1 = require("../ajv");
var handleError = function (debug) {
    var messages = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        messages[_i - 1] = arguments[_i];
    }
    if (debug) {
        for (var _a = 0, messages_1 = messages; _a < messages_1.length; _a++) {
            var message = messages_1[_a];
            ethers_1.logger.info(message);
        }
    }
    return messages.map(function (message) { return ({ message: message }); });
};
// remove enum and pattern from the schema
function transformSchema(schema) {
    var _a, _b, _c, _d, _e, _f;
    var excludeKeys = ["enum", "pattern"];
    function omit(value) {
        if (value && typeof value === "object") {
            var key = excludeKeys.find(function (key) { return value[key]; });
            if (key) {
                var node_1 = lodash_1.clone(value);
                excludeKeys.forEach(function (key) {
                    delete node_1[key];
                });
                return node_1;
            }
        }
    }
    var newSchema = lodash_1.cloneDeepWith(schema, omit);
    // because we remove check on enum (DNS-DID, DNS-TXT, etc.) the identity proof can match multiple sub schema in v2.
    // so here we change oneOf to anyOf, so that if more than one identityProof matches, it still passes
    if ((_b = (_a = newSchema === null || newSchema === void 0 ? void 0 : newSchema.definitions) === null || _a === void 0 ? void 0 : _a.identityProof) === null || _b === void 0 ? void 0 : _b.oneOf) {
        newSchema.definitions.identityProof.anyOf = (_d = (_c = newSchema === null || newSchema === void 0 ? void 0 : newSchema.definitions) === null || _c === void 0 ? void 0 : _c.identityProof) === null || _d === void 0 ? void 0 : _d.oneOf;
        (_f = (_e = newSchema === null || newSchema === void 0 ? void 0 : newSchema.definitions) === null || _e === void 0 ? void 0 : _e.identityProof) === null || _f === void 0 ? true : delete _f.oneOf;
    }
    return newSchema;
}
// custom ajv for loose schema validation
// it will allow invalid format, invalid pattern and invalid enum
var ajv = ajv_1.buildAjv({ transform: transformSchema, validateFormats: false });
/**
 * Tools to give information about the validity of a document. It will return and eventually output the errors found.
 * @param version 2.0 or 3.0
 * @param kind wrapped or signed
 * @param debug turn on to output in the console, the errors found
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 * @param document the document to validate
 */
var diagnose = function (_a) {
    var version = _a.version, kind = _a.kind, document = _a.document, _b = _a.debug, debug = _b === void 0 ? false : _b, mode = _a.mode;
    if (!document) {
        return handleError(debug, "The document must not be empty");
    }
    if (typeof document !== "object") {
        return handleError(debug, "The document must be an object");
    }
    var errors = validate_1.validateSchema(document, ajv_1.getSchema(version === "3.0" ? __1.SchemaId.v3 : __1.SchemaId.v2, mode === "non-strict" ? ajv : undefined));
    if (errors.length > 0) {
        // TODO this can be improved later
        return handleError.apply(void 0, __spreadArray([debug, "The document does not match OpenAttestation schema " + (version === "3.0" ? "3.0" : "2.0")], errors.map(function (error) { return (error.instancePath || "document") + " - " + error.message; })));
    }
    if (version === "3.0") {
        return diagnoseV3({ mode: mode, debug: debug, document: document, kind: kind });
    }
    else {
        return diagnoseV2({ mode: mode, debug: debug, document: document, kind: kind });
    }
};
exports.diagnose = diagnose;
var diagnoseV2 = function (_a) {
    var kind = _a.kind, document = _a.document, debug = _a.debug, mode = _a.mode;
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        mode === "strict" ? types_2.SignatureStrict.check(document.signature) : types_2.Signature.check(document.signature);
    }
    catch (e) {
        return handleError(debug, e.message);
    }
    if (kind === "signed") {
        if (!document.proof || !(document.proof.length > 0)) {
            return handleError(debug, "The document does not have a proof");
        }
        try {
            types_2.ArrayProof.check(document.proof);
        }
        catch (e) {
            return handleError(debug, e.message);
        }
    }
    return [];
};
var diagnoseV3 = function (_a) {
    var kind = _a.kind, document = _a.document, debug = _a.debug, mode = _a.mode;
    if (document.version !== __1.SchemaId.v3) {
        return handleError(debug, "The document schema version is wrong. Expected " + __1.SchemaId.v3 + ", received " + document.version);
    }
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        mode === "strict"
            ? types_1.VerifiableCredentialWrappedProofStrict.check(document.proof)
            : types_1.VerifiableCredentialWrappedProof.check(document.proof);
    }
    catch (e) {
        return handleError(debug, e.message);
    }
    if (kind === "signed") {
        if (!document.proof) {
            return handleError(debug, "The document does not have a proof");
        }
        try {
            types_1.VerifiableCredentialSignedProof.check(document.proof);
        }
        catch (e) {
            return handleError(debug, e.message);
        }
    }
    return [];
};
