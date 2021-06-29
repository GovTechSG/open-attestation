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
import { validateSchema as validate } from "./shared/validate";
import { verify } from "./2.0/verify";
import { verify as verifyV3 } from "./3.0/verify";
import { wrapDocument as wrapV2Document, wrapDocuments as wrapV2Documents } from "./2.0/wrap";
import { signDocument as signV2Document } from "./2.0/sign";
import { wrapDocument as wrapV3Document, wrapDocuments as wrapV3Documents } from "./3.0/wrap";
import { signDocument as signV3Document } from "./3.0/sign";
import { SchemaId } from "./shared/@types/document";
import * as utils from "./shared/utils";
import * as v2 from "./2.0/types";
import * as v3 from "./3.0/types";
import { obfuscateDocument as obfuscateDocumentV2 } from "./2.0/obfuscate";
import { obfuscateVerifiableCredential } from "./3.0/obfuscate";
import { SigningKey } from "./shared/@types/sign";
import { Signer } from "ethers";
import { getSchema } from "./shared/ajv";
export function __unsafe__use__it__at__your__own__risks__wrapDocument(data, options) {
    return wrapV3Document(data, options !== null && options !== void 0 ? options : { version: SchemaId.v3 });
}
export function __unsafe__use__it__at__your__own__risks__wrapDocuments(dataArray, options) {
    return wrapV3Documents(dataArray, options !== null && options !== void 0 ? options : { version: SchemaId.v3 });
}
export function wrapDocument(data, options) {
    return wrapV2Document(data, { externalSchemaId: options === null || options === void 0 ? void 0 : options.externalSchemaId });
}
export function wrapDocuments(dataArray, options) {
    return wrapV2Documents(dataArray, { externalSchemaId: options === null || options === void 0 ? void 0 : options.externalSchemaId });
}
export var validateSchema = function (document) {
    return validate(document, getSchema("" + ((document === null || document === void 0 ? void 0 : document.version) || SchemaId.v2))).length === 0;
};
export function verifySignature(document) {
    return utils.isWrappedV3Document(document) ? verifyV3(document) : verify(document);
}
export function obfuscate(document, fields) {
    return document.version === SchemaId.v3
        ? obfuscateVerifiableCredential(document, fields)
        : obfuscateDocumentV2(document, fields);
}
export var isSchemaValidationError = function (error) {
    return !!error.validationErrors;
};
export function signDocument(document, algorithm, keyOrSigner) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // rj was worried it could happen deep in the code, so I moved it to the boundaries
            if (!SigningKey.guard(keyOrSigner) && !Signer.isSigner(keyOrSigner)) {
                throw new Error("Either a keypair or ethers.js Signer must be provided");
            }
            switch (true) {
                case utils.isWrappedV2Document(document):
                    return [2 /*return*/, signV2Document(document, algorithm, keyOrSigner)];
                case utils.isWrappedV3Document(document):
                    return [2 /*return*/, signV3Document(document, algorithm, keyOrSigner)];
                default:
                    // Unreachable code atm until utils.isWrappedV2Document & utils.isWrappedV3Document becomes more strict
                    throw new Error("Unsupported document type: Only OpenAttestation v2 & v3 documents can be signed");
            }
            return [2 /*return*/];
        });
    });
}
export { digestDocument } from "./2.0/digest";
export { digestCredential } from "./3.0/digest";
export { checkProof, MerkleTree } from "./shared/merkle";
export { obfuscate as obfuscateDocument };
export { utils };
export * from "./shared/@types/document";
export * from "./shared/@types/sign";
export * from "./shared/signer";
export { getData } from "./shared/utils"; // keep it to avoid breaking change, moved from privacy to utils
export { v2 };
export { v3 };
