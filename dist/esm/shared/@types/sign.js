import { Record, String } from "runtypes";
export var SUPPORTED_SIGNING_ALGORITHM;
(function (SUPPORTED_SIGNING_ALGORITHM) {
    SUPPORTED_SIGNING_ALGORITHM["Secp256k1VerificationKey2018"] = "Secp256k1VerificationKey2018";
})(SUPPORTED_SIGNING_ALGORITHM || (SUPPORTED_SIGNING_ALGORITHM = {}));
export var SigningKey = Record({
    private: String,
    public: String,
});
