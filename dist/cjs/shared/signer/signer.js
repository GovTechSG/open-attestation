"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSigners = exports.sign = exports.signerBuilder = void 0;
var signatureSchemes_1 = require("./signatureSchemes");
Object.defineProperty(exports, "defaultSigners", { enumerable: true, get: function () { return signatureSchemes_1.defaultSigners; } });
var signerBuilder = function (signers) { return function (alg, message, keyOrSigner, options) {
    var signer = signers.get(alg);
    if (!signer)
        throw new Error(alg + " is not supported as a signing algorithm");
    return signer(message, keyOrSigner, options);
}; };
exports.signerBuilder = signerBuilder;
exports.sign = exports.signerBuilder(signatureSchemes_1.defaultSigners);
