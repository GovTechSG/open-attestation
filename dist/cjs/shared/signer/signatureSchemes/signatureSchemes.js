"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSigners = void 0;
var Secp256k1VerificationKey2018_1 = require("./Secp256k1VerificationKey2018");
exports.defaultSigners = new Map();
exports.defaultSigners.set(Secp256k1VerificationKey2018_1.name, Secp256k1VerificationKey2018_1.sign);
