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
import { digestDocument } from "./digest";
import { MerkleTree } from "../shared/merkle";
import { hashToBuffer, SchemaValidationError } from "../shared/utils";
import { SchemaId } from "../shared/@types/document";
import { validateSchema as validate } from "../shared/validate";
import { saltData } from "./salt";
import { getSchema } from "../shared/ajv";
var createDocument = function (data, option) {
    var documentSchema = {
        version: SchemaId.v2,
        data: saltData(data),
    };
    if (option === null || option === void 0 ? void 0 : option.externalSchemaId) {
        documentSchema.schema = option.externalSchemaId;
    }
    return documentSchema;
};
export var wrapDocument = function (data, options) {
    var _a;
    var document = createDocument(data, options);
    var errors = validate(document, getSchema((_a = options === null || options === void 0 ? void 0 : options.version) !== null && _a !== void 0 ? _a : SchemaId.v2));
    if (errors.length > 0) {
        throw new SchemaValidationError("Invalid document", errors, document);
    }
    var digest = digestDocument(document);
    var signature = {
        type: "SHA3MerkleProof",
        targetHash: digest,
        proof: [],
        merkleRoot: digest,
    };
    return __assign(__assign({}, document), { signature: signature });
};
export var wrapDocuments = function (data, options) {
    // wrap documents individually
    var documents = data.map(function (d) { return wrapDocument(d, options); });
    // get all the target hashes to compute the merkle tree and the merkle root
    var merkleTree = new MerkleTree(documents.map(function (document) { return document.signature.targetHash; }).map(hashToBuffer));
    var merkleRoot = merkleTree.getRoot().toString("hex");
    // for each document, update the merkle root and add the proofs needed
    return documents.map(function (document) {
        var merkleProof = merkleTree
            .getProof(hashToBuffer(document.signature.targetHash))
            .map(function (buffer) { return buffer.toString("hex"); });
        return __assign(__assign({}, document), { signature: __assign(__assign({}, document.signature), { proof: merkleProof, merkleRoot: merkleRoot }) });
    });
};
