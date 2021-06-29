/// <reference types="node" />
import { Hash } from "../utils";
export declare class MerkleTree {
    elements: Buffer[];
    layers: Buffer[][];
    constructor(_elements: any[]);
    getRoot(): Buffer;
    getProof(_element: any): Buffer[];
}
/**
 * Function that runs through the supplied hashes to arrive at the supplied merkle root hash
 * @param _proof The list of uncle hashes required to arrive at the supplied merkle root
 * @param _root The merkle root
 * @param _element The leaf node that is being verified
 */
export declare const checkProof: (_proof: Hash[], _root: Hash, _element: Hash) => boolean;
