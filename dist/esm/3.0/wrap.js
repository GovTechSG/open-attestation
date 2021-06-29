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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { hashToBuffer, SchemaValidationError } from "../shared/utils";
import { MerkleTree } from "../shared/merkle";
import { SchemaId } from "../shared/@types/document";
import { digestCredential } from "../3.0/digest";
import { validateSchema as validate } from "../shared/validate";
import { encodeSalt, salt } from "./salt";
import { validateW3C } from "./validate";
import { getSchema } from "../shared/ajv";
var getExternalSchema = function (schema) { return (schema ? { schema: schema } : {}); };
export var wrapDocument = function (credential, options) { return __awaiter(void 0, void 0, void 0, function () {
    var document, salts, digest, batchBuffers, merkleTree, merkleRoot, merkleProof, verifiableCredential, errors;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                document = __assign(__assign({ version: SchemaId.v3 }, getExternalSchema(options.externalSchemaId)), credential);
                // To ensure that base @context exists, but this also means some of our validateW3C errors may be unreachable
                if (!document["@context"]) {
                    document["@context"] = ["https://www.w3.org/2018/credentials/v1"];
                }
                // Since our wrapper adds in OA-specific properties, we should push our OA context. This is also to pass W3C VC test suite.
                if (Array.isArray(document["@context"]) &&
                    !document["@context"].includes("https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json")) {
                    document["@context"].push("https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json");
                }
                salts = salt(document);
                digest = digestCredential(document, salts, []);
                batchBuffers = [digest].map(hashToBuffer);
                merkleTree = new MerkleTree(batchBuffers);
                merkleRoot = merkleTree.getRoot().toString("hex");
                merkleProof = merkleTree.getProof(hashToBuffer(digest)).map(function (buffer) { return buffer.toString("hex"); });
                verifiableCredential = __assign(__assign({}, document), { proof: {
                        type: "OpenAttestationMerkleProofSignature2018",
                        proofPurpose: "assertionMethod",
                        targetHash: digest,
                        proofs: merkleProof,
                        merkleRoot: merkleRoot,
                        salts: encodeSalt(salts),
                        privacy: {
                            obfuscated: [],
                        },
                    } });
                errors = validate(verifiableCredential, getSchema(SchemaId.v3));
                if (errors.length > 0) {
                    throw new SchemaValidationError("Invalid document", errors, verifiableCredential);
                }
                return [4 /*yield*/, validateW3C(verifiableCredential)];
            case 1:
                _a.sent();
                return [2 /*return*/, verifiableCredential];
        }
    });
}); };
export var wrapDocuments = function (documents, options) { return __awaiter(void 0, void 0, void 0, function () {
    var verifiableCredentials, merkleTree, merkleRoot;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(documents.map(function (document) { return wrapDocument(document, options); }))];
            case 1:
                verifiableCredentials = _a.sent();
                merkleTree = new MerkleTree(verifiableCredentials.map(function (verifiableCredential) { return verifiableCredential.proof.targetHash; }).map(hashToBuffer));
                merkleRoot = merkleTree.getRoot().toString("hex");
                // for each document, update the merkle root and add the proofs needed
                return [2 /*return*/, verifiableCredentials.map(function (verifiableCredential) {
                        var digest = verifiableCredential.proof.targetHash;
                        var merkleProof = merkleTree.getProof(hashToBuffer(digest)).map(function (buffer) { return buffer.toString("hex"); });
                        return __assign(__assign({}, verifiableCredential), { proof: __assign(__assign({}, verifiableCredential.proof), { proofs: merkleProof, merkleRoot: merkleRoot }) });
                    })];
        }
    });
}); };
