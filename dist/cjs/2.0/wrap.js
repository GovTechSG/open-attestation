"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapDocuments = exports.wrapDocument = void 0;
var digest_1 = require("./digest");
var merkle_1 = require("../shared/merkle");
var utils_1 = require("../shared/utils");
var document_1 = require("../shared/@types/document");
var validate_1 = require("../shared/validate");
var salt_1 = require("./salt");
var ajv_1 = require("../shared/ajv");
var createDocument = function (data, option) {
    var documentSchema = {
        version: document_1.SchemaId.v2,
        data: salt_1.saltData(data),
    };
    if (option === null || option === void 0 ? void 0 : option.externalSchemaId) {
        documentSchema.schema = option.externalSchemaId;
    }
    return documentSchema;
};
var wrapDocument = function (data, options) {
    var _a;
    var document = createDocument(data, options);
    var errors = validate_1.validateSchema(document, ajv_1.getSchema((_a = options === null || options === void 0 ? void 0 : options.version) !== null && _a !== void 0 ? _a : document_1.SchemaId.v2));
    if (errors.length > 0) {
        throw new utils_1.SchemaValidationError("Invalid document", errors, document);
    }
    var digest = digest_1.digestDocument(document);
    var signature = {
        type: "SHA3MerkleProof",
        targetHash: digest,
        proof: [],
        merkleRoot: digest,
    };
    return __assign(__assign({}, document), { signature: signature });
};
exports.wrapDocument = wrapDocument;
var wrapDocuments = function (data, options) {
    // wrap documents individually
    var documents = data.map(function (d) { return exports.wrapDocument(d, options); });
    // get all the target hashes to compute the merkle tree and the merkle root
    var merkleTree = new merkle_1.MerkleTree(documents.map(function (document) { return document.signature.targetHash; }).map(utils_1.hashToBuffer));
    var merkleRoot = merkleTree.getRoot().toString("hex");
    // for each document, update the merkle root and add the proofs needed
    return documents.map(function (document) {
        var merkleProof = merkleTree
            .getProof(utils_1.hashToBuffer(document.signature.targetHash))
            .map(function (buffer) { return buffer.toString("hex"); });
        return __assign(__assign({}, document), { signature: __assign(__assign({}, document.signature), { proof: merkleProof, merkleRoot: merkleRoot }) });
    });
};
exports.wrapDocuments = wrapDocuments;
