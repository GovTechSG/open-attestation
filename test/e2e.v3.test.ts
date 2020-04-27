import { obfuscate, validateSchema, verifySignature, wrapDocument, wrapDocuments } from "../src";
import { IdentityType, Method, OpenAttestationDocument, ProofType, TemplateType } from "../src/__generated__/schemaV3";
import { SchemaId } from "../src/@types/document";

// TODO sth might be wrong with the verify signature => if I add data, it will still be valid

const openAttestationData: OpenAttestationDocument = {
  reference: "document identifier",
  validFrom: "2010-01-01T19:23:24Z",
  name: "document owner name",
  template: {
    name: "any",
    type: TemplateType.EmbeddedRenderer,
    url: "http://some.example.com"
  },
  issuer: {
    id: "http://some.example.com",
    name: "DEMO STORE"
  },
  proof: {
    type: ProofType.OpenAttestationSignature2018,
    value: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
    method: Method.TokenRegistry,
    identity: {
      type: IdentityType.DNSTxt,
      location: "tradetrust.io"
    }
  }
};

const openAttestationDataWithW3CDID: OpenAttestationDocument = {
  ...openAttestationData,
  proof: {
    ...openAttestationData.proof,
    identity: {
      ...openAttestationData.proof.identity,
      type: IdentityType.W3CDid,
      location: "did:ethr:0x0xE6Fe788d8ca214A080b0f6aC7F48480b2AEfa9a6"
    }
  }
};

const datum = [
  {
    key1: "test",
    ...openAttestationData
  },
  {
    key1: "hello",
    key2: "item2",
    ...openAttestationData
  },
  {
    key1: "item1",
    key2: "true",
    key3: "3.14159",
    // key3: 3.14159, // TODO FIX ME
    // key4: false, // TODO FIX ME
    ...openAttestationData
  },
  {
    key1: "item2",
    ...openAttestationData
  }
];

describe("v3 E2E Test Scenarios", () => {
  describe("Issuing a single documents", () => {
    const document = datum[0];

    test("fails for malformed data", () => {
      const malformedData = {
        ...document,
        issuer: undefined
      };
      const action = () => wrapDocument(malformedData);
      expect(action).toThrow("Invalid document");
    });

    test("creates a wrapped document", () => {
      const wrappedDocument = wrapDocument(document, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      expect(wrappedDocument.schema).toBe("http://example.com/schema.json");
      expect(wrappedDocument.key1).toEqual(expect.stringContaining("test"));
      expect(wrappedDocument.proof.signature.type).toBe("SHA3MerkleProof");
      expect(wrappedDocument.proof.signature.targetHash).toBeDefined();
      expect(wrappedDocument.proof.signature.merkleRoot).toBeDefined();
      expect(wrappedDocument.proof.signature.proof).toEqual([]);
      expect(wrappedDocument.proof.signature.merkleRoot).toBe(wrappedDocument.proof.signature.targetHash);
    });
    test("creates a wrapped document with W3C-DID IdentityProof", () => {
      const wrappedDocumentWithW3CDID = wrapDocument(openAttestationDataWithW3CDID, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      expect(wrappedDocumentWithW3CDID.schema).toBe("http://example.com/schema.json");
      expect(wrappedDocumentWithW3CDID.proof.signature.type).toBe("SHA3MerkleProof");
      expect(wrappedDocumentWithW3CDID.proof.signature.targetHash).toBeDefined();
      expect(wrappedDocumentWithW3CDID.proof.signature.merkleRoot).toBeDefined();
      expect(wrappedDocumentWithW3CDID.proof.signature.proof).toEqual([]);
      expect(wrappedDocumentWithW3CDID.proof.signature.merkleRoot).toBe(
        wrappedDocumentWithW3CDID.proof.signature.targetHash
      );
      expect(wrappedDocumentWithW3CDID.proof.identity.type).toContain(IdentityType.W3CDid);
      expect(wrappedDocumentWithW3CDID.proof.identity.location).toContain(
        openAttestationDataWithW3CDID.proof.identity.location
      );
    });
    test("checks that document is wrapped correctly", () => {
      const wrappedDocument = wrapDocument(document, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      const verified = verifySignature(wrappedDocument);
      expect(verified).toBe(true);
    });
    test("checks that document conforms to the schema", () => {
      const wrappedDocument = wrapDocument(document, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      expect(validateSchema(wrappedDocument)).toBe(true);
    });

    test("does not allow for the same merkle root to be generated", () => {
      const wrappedDocument = wrapDocument(document, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      const newDocument = wrapDocument(document, { version: SchemaId.v3 });
      expect(wrappedDocument.proof.signature.merkleRoot).not.toBe(newDocument.proof.signature.merkleRoot);
    });

    test("obfuscate data correctly", async () => {
      const newDocument = wrapDocument(datum[2], { version: SchemaId.v3 });
      const obfuscatedDocument = obfuscate(newDocument, ["key2"]);

      const verified = verifySignature(obfuscatedDocument);
      expect(verified).toBe(true);
      expect(validateSchema(obfuscatedDocument)).toBe(true);
    });

    test("obfuscate data transistively", () => {
      const newDocument = wrapDocument(datum[2], { version: SchemaId.v3 });
      const intermediateDocument = obfuscate(newDocument, ["key2"]);
      const obfuscatedDocument = obfuscate(intermediateDocument, ["key3"]);

      const comparison = obfuscate(intermediateDocument, ["key2", "key3"]);

      expect(comparison).toEqual(obfuscatedDocument);
    });
  });
  describe("Issuing a batch of documents", () => {
    test("fails if there is a malformed document", () => {
      const malformedDatum = [
        ...datum,
        {
          cow: "moo"
        }
      ];
      const action = () => wrapDocuments(malformedDatum);
      expect(action).toThrow("Invalid document");
    });

    test("creates a batch of documents if all are in the right format", () => {
      const signedDocuments = wrapDocuments(datum, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      signedDocuments.forEach((doc, i: number) => {
        expect(doc.schema).toBe("http://example.com/schema.json");
        expect(doc.proof.signature.type).toBe("SHA3MerkleProof");
        expect(doc.key1).toEqual(expect.stringContaining(datum[i].key1));
        expect(doc.proof.signature.targetHash).toBeDefined();
        expect(doc.proof.signature.merkleRoot).toBeDefined();
        expect(doc.proof.signature.proof.length).toEqual(2);
      });
    });

    test("checks that documents are wrapped correctly", () => {
      const signedDocuments = wrapDocuments(datum, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      const verified = signedDocuments.reduce((prev, curr) => verifySignature(curr) && prev, true);
      expect(verified).toBe(true);
    });
    test("checks that documents conforms to the schema", () => {
      const signedDocuments = wrapDocuments(datum, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      const validatedSchema = signedDocuments.reduce((prev: boolean, curr: any) => validateSchema(curr) && prev, true);
      expect(validatedSchema).toBe(true);
    });

    test("does not allow for same merkle root to be generated", () => {
      const signedDocuments = wrapDocuments(datum, {
        externalSchemaId: "http://example.com/schema.json",
        version: SchemaId.v3
      });
      const newSignedDocuments = wrapDocuments(datum, {
        version: SchemaId.v3
      });
      expect(signedDocuments[0].proof.signature.merkleRoot).not.toBe(newSignedDocuments[0].proof.signature.merkleRoot);
    });
  });
  describe("validate", () => {
    test("should throw an error if document id is not a valid open attestation schema version", () => {
      const action = () =>
        validateSchema({
          version: "abababa" as SchemaId,
          schema: "http://example.com/schemaV3.json",
          data: {
            key: 2
          },
          signature: {
            merkleRoot: "0xabc",
            proof: [],
            targetHash: "0xabc",
            type: "SHA3MerkleProof"
          }
        });
      expect(action).toThrow("No schema validator provided");
    });
    test("should return false if document is not valid", () => {
      expect(
        validateSchema({
          version: SchemaId.v3,
          schema: "http://example.com/schemaV3.json",
          data: {
            key: 2
          },
          signature: {
            merkleRoot: "0xabc",
            proof: [],
            targetHash: "0xabc",
            type: "SHA3MerkleProof"
          }
        })
      ).toStrictEqual(false);
    });
    test("should return true when document is valid and version is 3.0", () => {
      expect(
        validateSchema({
          version: SchemaId.v3,
          schema: "http://example.com/schemaV3.json",
          reference: "reference",
          name: "name",
          validFrom: "2010-01-01T19:23:24Z",
          issuer: {
            id: "https://example.com",
            name: "issuer.name"
          },
          template: {
            name: "template.name",
            type: "EMBEDDED_RENDERER",
            url: "https://example.com"
          },
          proof: {
            type: "OpenAttestationSignature2018",
            method: "TOKEN_REGISTRY",
            value: "proof.value",
            identity: {
              type: "DNS-TXT",
              location: "issuer.identityProof.location"
            },
            signature: {
              merkleRoot: "0xabc",
              proof: [],
              targetHash: "0xabc",
              type: "SHA3MerkleProof"
            }
          }
        })
      ).toStrictEqual(true);
    });
    test("should return true when document is valid and version is 3.0 and identityProof is W3C-DID", () => {
      expect(
        validateSchema({
          version: SchemaId.v3,
          schema: "http://example.com/schemaV3.json",
          reference: "reference",
          name: "name",
          validFrom: "2010-01-01T19:23:24Z",
          issuer: {
            id: "https://example.com",
            name: "issuer.name"
          },
          template: {
            name: "template.name",
            type: "EMBEDDED_RENDERER",
            url: "https://example.com"
          },
          proof: {
            type: "OpenAttestationSignature2018",
            method: "TOKEN_REGISTRY",
            value: "proof.value",
            identity: {
              type: IdentityType.W3CDid,
              location: openAttestationDataWithW3CDID.proof.identity.location
            },
            signature: {
              merkleRoot: "0xabc",
              proof: [],
              targetHash: "0xabc",
              type: "SHA3MerkleProof"
            }
          }
        })
      ).toStrictEqual(true);
    });
    test("should return false when document is invalid due to no W3D-DID location", () => {
      expect(
        validateSchema({
          version: SchemaId.v3,
          schema: "http://example.com/schemaV3.json",
          data: {
            reference: "reference",
            name: "name",
            validFrom: "2010-01-01T19:23:24Z",
            issuer: {
              id: "https://example.com",
              name: "issuer.name",
              identityProof: {
                type: IdentityType.W3CDid
              }
            },
            template: {
              name: "template.name",
              type: "EMBEDDED_RENDERER",
              url: "https://example.com"
            },
            proof: {
              type: "OpenAttestationSignature2018",
              method: "TOKEN_REGISTRY",
              value: "proof.value"
            }
          },
          signature: {
            merkleRoot: "0xabc",
            proof: [],
            targetHash: "0xabc",
            type: "SHA3MerkleProof"
          }
        })
      ).toStrictEqual(false);
    });
    test("should return true when document is valid and version is not provided", () => {
      expect(
        validateSchema({
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore run test with version being undefined to only ignore that part
          version: undefined,
          data: {
            issuers: [
              {
                name: "issuer.name",
                certificateStore: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d"
              }
            ]
          },
          signature: {
            merkleRoot: "0xabc",
            proof: [],
            targetHash: "0xabc",
            type: "SHA3MerkleProof"
          }
        })
      ).toStrictEqual(true);
    });
  });
});
