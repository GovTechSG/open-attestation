"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = void 0;
var logger_1 = require("../logger");
var document_1 = require("../@types/document");
var utils_1 = require("../utils");
var logger = logger_1.getLogger("validate");
var validateSchema = function (document, validator) {
    var _a;
    if (!validator) {
        throw new Error("No schema validator provided");
    }
    var valid = validator(document.version === document_1.SchemaId.v3 ? document : utils_1.getData(document));
    if (!valid) {
        logger.debug("There are errors in the document: " + JSON.stringify(validator.errors));
        return (_a = validator.errors) !== null && _a !== void 0 ? _a : [];
    }
    logger.debug("Document is a valid open attestation document v" + document.version);
    return [];
};
exports.validateSchema = validateSchema;
