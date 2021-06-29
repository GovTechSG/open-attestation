"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigningKey = exports.SUPPORTED_SIGNING_ALGORITHM = void 0;
var runtypes_1 = require("runtypes");
var SUPPORTED_SIGNING_ALGORITHM;
(function (SUPPORTED_SIGNING_ALGORITHM) {
    SUPPORTED_SIGNING_ALGORITHM["Secp256k1VerificationKey2018"] = "Secp256k1VerificationKey2018";
})(SUPPORTED_SIGNING_ALGORITHM = exports.SUPPORTED_SIGNING_ALGORITHM || (exports.SUPPORTED_SIGNING_ALGORITHM = {}));
exports.SigningKey = runtypes_1.Record({
    private: runtypes_1.String,
    public: runtypes_1.String,
});
