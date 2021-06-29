import { get } from "lodash";
import { digestDocument } from "./digest";
import { checkProof } from "../shared/merkle";
export var verify = function (document) {
    var _a, _b, _c, _d;
    var signature = get(document, "signature");
    if (!signature) {
        return false;
    }
    // Checks target hash
    var digest = digestDocument(document);
    var targetHash = get(document, "signature.targetHash");
    if (digest !== targetHash)
        return false;
    // Calculates merkle root from target hash and proof, then compare to merkle root in document
    return checkProof((_b = (_a = document === null || document === void 0 ? void 0 : document.signature) === null || _a === void 0 ? void 0 : _a.proof) !== null && _b !== void 0 ? _b : [], (_c = document === null || document === void 0 ? void 0 : document.signature) === null || _c === void 0 ? void 0 : _c.merkleRoot, (_d = document === null || document === void 0 ? void 0 : document.signature) === null || _d === void 0 ? void 0 : _d.targetHash);
};
