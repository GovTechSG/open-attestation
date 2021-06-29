"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = exports.name = void 0;
var ethers_1 = require("ethers");
var sign_1 = require("../../../@types/sign");
exports.name = "Secp256k1VerificationKey2018";
var sign = function (message, keyOrSigner, options) {
    if (options === void 0) { options = {}; }
    var signer;
    if (sign_1.SigningKey.guard(keyOrSigner)) {
        var wallet = new ethers_1.Wallet(keyOrSigner.private);
        if (!keyOrSigner.public.toLowerCase().includes(wallet.address.toLowerCase())) {
            throw new Error("Private key is wrong for " + keyOrSigner.public);
        }
        signer = wallet;
    }
    else {
        signer = keyOrSigner;
    }
    return signer.signMessage(options.signAsString ? message : ethers_1.utils.arrayify(message));
};
exports.sign = sign;
