"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = void 0;
var debug_1 = __importDefault(require("debug"));
var logger = debug_1.default("open-attestation");
var getLogger = function (namespace) { return ({
    trace: logger.extend("trace:" + namespace),
    debug: logger.extend("debug:" + namespace),
    info: logger.extend("info:" + namespace),
    warn: logger.extend("warn:" + namespace),
    error: logger.extend("error:" + namespace),
}); };
exports.getLogger = getLogger;
