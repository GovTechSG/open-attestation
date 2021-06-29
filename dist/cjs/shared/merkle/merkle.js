"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkProof = exports.MerkleTree = void 0;
var utils_1 = require("../utils");
function getNextLayer(elements) {
    return elements.reduce(function (layer, element, index, arr) {
        if (index % 2 === 0) {
            // only calculate hash for even indexes
            layer.push(utils_1.combineHashBuffers(element, arr[index + 1]));
        }
        return layer;
    }, []);
}
/**
 * This function produces the hashes and the merkle tree
 * If there are no elements, return empty array of array
 */
function getLayers(elements) {
    if (elements.length === 0) {
        return [[]];
    }
    var layers = [];
    layers.push(elements);
    while (layers[layers.length - 1].length > 1) {
        layers.push(getNextLayer(layers[layers.length - 1]));
    }
    return layers;
}
/**
 * This function takes a given index and determines if it is the first or second element in a pair, then returns the first element of the pair
 * If the given index is the last element in a layer with an odd number of elements, then null is returned
 * E.g 1:
 *
 * layer = [ A, B, C, D ],
 * if index = 2, then return A
 * if index = 3, then return C
 *
 * E.g 2:
 *
 * layer = [ A, B, C, D, E]
 * if index = 5, then return null
 * if index = 4, then return C
 */
function getPair(index, layer) {
    var pairIndex = index % 2 ? index - 1 : index + 1; // if odd return the index before it, else if even return the index after it
    if (pairIndex < layer.length) {
        return layer[pairIndex];
    }
    return null; // this happens when the given index is the last element in a layer with odd number of elements
}
/**
 * Finds all the "uncle" nodes required to prove a given element in the merkle tree
 */
function getProof(index, layers) {
    var i = index;
    var proof = layers.reduce(function (current, layer) {
        var pair = getPair(i, layer);
        if (pair) {
            current.push(pair);
        }
        i = Math.floor(i / 2); // finds the index of the parent of the current node
        return current;
    }, []);
    return proof;
}
var MerkleTree = /** @class */ (function () {
    function MerkleTree(_elements) {
        this.elements = utils_1.hashArray(_elements);
        // check buffers
        if (this.elements.some(function (e) { return !(e.length === 32 && Buffer.isBuffer(e)); })) {
            throw new Error("elements must be 32 byte buffers");
        }
        this.layers = getLayers(this.elements);
    }
    MerkleTree.prototype.getRoot = function () {
        return this.layers[this.layers.length - 1][0];
    };
    MerkleTree.prototype.getProof = function (_element) {
        var element = utils_1.toBuffer(_element);
        var index = this.elements.findIndex(function (e) { return e.equals(element); }); // searches for given element in the merkle tree and returns the index
        if (index === -1) {
            throw new Error("Element not found");
        }
        return getProof(index, this.layers);
    };
    return MerkleTree;
}());
exports.MerkleTree = MerkleTree;
/**
 * Function that runs through the supplied hashes to arrive at the supplied merkle root hash
 * @param _proof The list of uncle hashes required to arrive at the supplied merkle root
 * @param _root The merkle root
 * @param _element The leaf node that is being verified
 */
var checkProof = function (_proof, _root, _element) {
    var proof = _proof.map(function (step) { return utils_1.hashToBuffer(step); });
    var root = utils_1.hashToBuffer(_root);
    var element = utils_1.hashToBuffer(_element);
    var proofRoot = proof.reduce(function (hash, pair) { return utils_1.combineHashBuffers(hash, pair); }, element);
    return root.equals(proofRoot);
};
exports.checkProof = checkProof;
