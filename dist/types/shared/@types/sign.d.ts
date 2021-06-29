import { ethers } from "ethers";
import { Record, Static, String } from "runtypes";
export declare enum SUPPORTED_SIGNING_ALGORITHM {
    Secp256k1VerificationKey2018 = "Secp256k1VerificationKey2018"
}
export interface SigningOptions {
    signAsString?: boolean;
    signer?: ethers.Signer;
}
export declare const SigningKey: Record<{
    private: String;
    public: String;
}, false>;
export declare type SigningKey = Static<typeof SigningKey>;
export declare type SigningFunction = (message: string, key: SigningKey | ethers.Signer, options?: SigningOptions) => Promise<string>;
