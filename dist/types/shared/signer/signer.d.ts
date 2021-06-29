import { SigningFunction, SigningOptions, SigningKey } from "../../shared/@types/sign";
import { defaultSigners } from "./signatureSchemes";
import { ethers } from "ethers";
export declare const signerBuilder: (signers: Map<string, SigningFunction>) => (alg: string, message: string, keyOrSigner: SigningKey | ethers.Signer, options?: SigningOptions | undefined) => Promise<string>;
export declare const sign: (alg: string, message: string, keyOrSigner: SigningKey | ethers.Signer, options?: SigningOptions | undefined) => Promise<string>;
export { defaultSigners };
