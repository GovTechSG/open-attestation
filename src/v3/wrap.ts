import { OpenAttestationDocument } from "../__generated__/schemaV3";
import { bufSortJoin, hashToBuffer, toBuffer } from "../shared/utils";
import { v4 as uuid } from "uuid";
import { MerkleTree } from "../shared/merkle";
import { Salt, VerifiableCredential } from "../shared/@types/document";
import { cloneDeep, get, sortBy, unset } from "lodash";
import { keccak256 } from "js-sha3";
import { compact } from "jsonld";
import { digestDocumentV3 } from "../shared/digest"

const deepMap = (value: any, path: string): Salt[] => {
  if (Array.isArray(value)) {
    return value.flatMap((v, index) => deepMap(v, `${path}[${index}]`));
  }
  if (typeof value === "object") {
    return Object.keys(value).flatMap(key => deepMap(value[key], path ? `${path}.${key}` : key));
  }
  if (typeof value === "string") {
    return [{ value: uuid(), path }];
  }
  throw new Error(`unexpected element  ${value} => ${path}`);
};

const salt = (data: any) => deepMap(data, "");

// Wrap a single OpenAttestation document in v3 format.
export const wrapV3 = <T extends OpenAttestationDocument>(document: any): VerifiableCredential<T> => {
  document["@context"].push(
    "https://gist.githubusercontent.com/Nebulis/18efab9f8801c886a7dd0f6230efd89d/raw/f9f3107cabd7768f84a36c65d756abd961d19bda/w3c.json.ld"
  );
  const salts = salt(document);
  const digest = digestDocumentV3(document, salts, []);

  const batchBuffers = [digest].map(hashToBuffer);

  const merkleTree = new MerkleTree(batchBuffers);
  const merkleRoot = merkleTree.getRoot().toString("hex");
  const merkleProof = merkleTree.getProof(hashToBuffer(digest)).map((buffer: Buffer) => buffer.toString("hex"));

  return {
    ...document,
    proof: {
      ...document.proof,
      signature: {
        type: "SHA3MerkleProof",
        targetHash: digest,
        proof: merkleProof,
        merkleRoot,
        salts,
        privacy: {
          obfuscatedData: []
        }
      }
    }
  };
};

// Wrap multiple OpenAttestation documents in v3 format.
export const wrapsV3 = <T extends OpenAttestationDocument>(documents: any[]): VerifiableCredential<T>[] => {
  const salts = documents.map(document => {
    return salt(document);
  });
  const digests = documents.map((document, index) => {
    return digestDocumentV3(document, salts[index], []);
  });

  const batchBuffers = digests.map(hashToBuffer);

  const merkleTree = new MerkleTree(batchBuffers);
  const merkleRoot = merkleTree.getRoot().toString("hex");

  return documents.map((document, index) => {
    const digest = digests[index];
    const merkleProof = merkleTree.getProof(hashToBuffer(digest)).map((buffer: Buffer) => buffer.toString("hex"));

    return {
      ...document,
      proof: {
        ...document.proof,
        signature: {
          type: "SHA3MerkleProof",
          targetHash: digest,
          proof: merkleProof,
          merkleRoot,
          salts: salts[index],
          privacy: {
            obfuscatedData: []
          }
        }
      }
    };
  });
};
