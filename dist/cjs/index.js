"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.v3 = exports.v2 = exports.getData = exports.utils = exports.obfuscateDocument = exports.MerkleTree = exports.checkProof = exports.digestCredential = exports.digestDocument = exports.signDocument = exports.isSchemaValidationError = exports.obfuscate = exports.verifySignature = exports.validateSchema = exports.wrapDocuments = exports.wrapDocument = exports.__unsafe__use__it__at__your__own__risks__wrapDocuments = exports.__unsafe__use__it__at__your__own__risks__wrapDocument = void 0;
var validate_1 = require("./shared/validate");
var verify_1 = require("./2.0/verify");
var verify_2 = require("./3.0/verify");
var wrap_1 = require("./2.0/wrap");
var sign_1 = require("./2.0/sign");
var wrap_2 = require("./3.0/wrap");
var sign_2 = require("./3.0/sign");
var document_1 = require("./shared/@types/document");
var utils = __importStar(require("./shared/utils"));
exports.utils = utils;
var v2 = __importStar(require("./2.0/types"));
exports.v2 = v2;
var v3 = __importStar(require("./3.0/types"));
exports.v3 = v3;
var obfuscate_1 = require("./2.0/obfuscate");
var obfuscate_2 = require("./3.0/obfuscate");
var sign_3 = require("./shared/@types/sign");
var ethers_1 = require("ethers");
var ajv_1 = require("./shared/ajv");
function __unsafe__use__it__at__your__own__risks__wrapDocument(data, options) {
    return wrap_2.wrapDocument(data, options !== null && options !== void 0 ? options : { version: document_1.SchemaId.v3 });
}
exports.__unsafe__use__it__at__your__own__risks__wrapDocument = __unsafe__use__it__at__your__own__risks__wrapDocument;
function __unsafe__use__it__at__your__own__risks__wrapDocuments(dataArray, options) {
    return wrap_2.wrapDocuments(dataArray, options !== null && options !== void 0 ? options : { version: document_1.SchemaId.v3 });
}
exports.__unsafe__use__it__at__your__own__risks__wrapDocuments = __unsafe__use__it__at__your__own__risks__wrapDocuments;
function wrapDocument(data, options) {
    return wrap_1.wrapDocument(data, { externalSchemaId: options === null || options === void 0 ? void 0 : options.externalSchemaId });
}
exports.wrapDocument = wrapDocument;
function wrapDocuments(dataArray, options) {
    return wrap_1.wrapDocuments(dataArray, { externalSchemaId: options === null || options === void 0 ? void 0 : options.externalSchemaId });
}
exports.wrapDocuments = wrapDocuments;
var validateSchema = function (document) {
    return validate_1.validateSchema(document, ajv_1.getSchema("" + ((document === null || document === void 0 ? void 0 : document.version) || document_1.SchemaId.v2))).length === 0;
};
exports.validateSchema = validateSchema;
function verifySignature(document) {
    return utils.isWrappedV3Document(document) ? verify_2.verify(document) : verify_1.verify(document);
}
exports.verifySignature = verifySignature;
function obfuscate(document, fields) {
    return document.version === document_1.SchemaId.v3
        ? obfuscate_2.obfuscateVerifiableCredential(document, fields)
        : obfuscate_1.obfuscateDocument(document, fields);
}
exports.obfuscate = obfuscate;
exports.obfuscateDocument = obfuscate;
var isSchemaValidationError = function (error) {
    return !!error.validationErrors;
};
exports.isSchemaValidationError = isSchemaValidationError;
function signDocument(document, algorithm, keyOrSigner) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // rj was worried it could happen deep in the code, so I moved it to the boundaries
            if (!sign_3.SigningKey.guard(keyOrSigner) && !ethers_1.Signer.isSigner(keyOrSigner)) {
                throw new Error("Either a keypair or ethers.js Signer must be provided");
            }
            switch (true) {
                case utils.isWrappedV2Document(document):
                    return [2 /*return*/, sign_1.signDocument(document, algorithm, keyOrSigner)];
                case utils.isWrappedV3Document(document):
                    return [2 /*return*/, sign_2.signDocument(document, algorithm, keyOrSigner)];
                default:
                    // Unreachable code atm until utils.isWrappedV2Document & utils.isWrappedV3Document becomes more strict
                    throw new Error("Unsupported document type: Only OpenAttestation v2 & v3 documents can be signed");
            }
            return [2 /*return*/];
        });
    });
}
exports.signDocument = signDocument;
var digest_1 = require("./2.0/digest");
Object.defineProperty(exports, "digestDocument", { enumerable: true, get: function () { return digest_1.digestDocument; } });
var digest_2 = require("./3.0/digest");
Object.defineProperty(exports, "digestCredential", { enumerable: true, get: function () { return digest_2.digestCredential; } });
var merkle_1 = require("./shared/merkle");
Object.defineProperty(exports, "checkProof", { enumerable: true, get: function () { return merkle_1.checkProof; } });
Object.defineProperty(exports, "MerkleTree", { enumerable: true, get: function () { return merkle_1.MerkleTree; } });
__exportStar(require("./shared/@types/document"), exports);
__exportStar(require("./shared/@types/sign"), exports);
__exportStar(require("./shared/signer"), exports);
var utils_1 = require("./shared/utils"); // keep it to avoid breaking change, moved from privacy to utils
Object.defineProperty(exports, "getData", { enumerable: true, get: function () { return utils_1.getData; } });
