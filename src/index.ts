import Ajv from "ajv";
import { digestDocument as digestDocumentV2 } from "./v2/digest";
import { getSchema, validateSchema as validate, validateW3C } from "./shared/validate";
import { verify } from "./v2/verify";
import { verifyV3 } from "./v3/verify";
import { wrap } from "./v2/wrap";
import { wrap as wrapV3, wraps as wrapsV3 } from "./v3/wrap";
import { SchemaId, SchematisedDocument, VerifiableCredential, WrappedDocument } from "./shared/@types/document";
import { saltData } from "./v2/salt";
import * as utils from "./shared/utils";
import * as v2 from "./__generated__/schemaV2";
import * as v3 from "./__generated__/schemaV3";
import { OpenAttestationDocument } from "./__generated__/schemaV3";
import { obfuscateDocument as obfuscateDocumentV2 } from "./v2/obfuscate";
import { obfuscateDocument as obfuscateDocumentV3 } from "./v3/obfuscate";

interface WrapDocumentOption {
  externalSchemaId?: string;
  version?: SchemaId;
}
interface WrapDocumentOptionV2 {
  externalSchemaId?: string;
  version?: SchemaId.v2;
}
interface WrapDocumentOptionV3 {
  externalSchemaId?: string;
  version?: SchemaId.v3;
}
const defaultVersion = SchemaId.v2;

const createDocument = (data: any, option?: WrapDocumentOption) => {
  const documentSchema: SchematisedDocument = {
    version: option?.version ?? defaultVersion,
    data: saltData(data)
  };
  if (option?.externalSchemaId) {
    documentSchema.schema = option.externalSchemaId;
  }
  return documentSchema;
};

class SchemaValidationError extends Error {
  constructor(message: string, public validationErrors: Ajv.ErrorObject[], public document: any) {
    super(message);
  }
}
const isSchemaValidationError = (error: any): error is SchemaValidationError => {
  return !!error.validationErrors;
};

export async function wrapDocument<T = unknown>(data: T, options?: WrapDocumentOptionV2): Promise<WrappedDocument<T>>;
export async function wrapDocument<T extends OpenAttestationDocument>(
  data: T,
  options?: WrapDocumentOptionV3
): Promise<VerifiableCredential<T>>;
export async function wrapDocument<T = unknown>(data: T, options?: WrapDocumentOption): Promise<any> {
  if (options?.version === SchemaId.v3) {
    const wrappedDocument = options.externalSchemaId
      ? wrapV3({ schema: options.externalSchemaId, version: SchemaId.v3, ...data })
      : wrapV3({ version: SchemaId.v3, ...data });
    const errors = validate(wrappedDocument, getSchema(SchemaId.v3));
    if (errors.length > 0) {
      throw new SchemaValidationError("Invalid document", errors, wrappedDocument);
    }
    await validateW3C(wrappedDocument);
    return wrappedDocument;
  }

  const document: SchematisedDocument = createDocument(data, options);
  const errors = validate(document, getSchema(options?.version ?? defaultVersion));
  if (errors.length > 0) {
    throw new SchemaValidationError("Invalid document", errors, document);
  }
  return wrap(document, [digestDocumentV2(document)]);
}

export function wrapDocuments<T = unknown>(dataArray: T[], options?: WrapDocumentOptionV2): WrappedDocument<T>[];
export function wrapDocuments<T extends OpenAttestationDocument>(
  dataArray: T[],
  options?: WrapDocumentOptionV3
): VerifiableCredential<T>[];
export function wrapDocuments<T>(dataArray: T[], options?: WrapDocumentOption): any {
  if (options?.version === SchemaId.v3) {
    const documents = dataArray.map(data => {
      return options.externalSchemaId
        ? { schema: options.externalSchemaId, version: SchemaId.v3, ...data }
        : { version: SchemaId.v3, ...data };
    });
    const wrappedDocument = wrapsV3(documents);
    wrappedDocument.forEach(document => {
      const errors = validate(document, getSchema(options?.version ?? defaultVersion));
      if (errors.length > 0) {
        throw new SchemaValidationError("Invalid document", errors, document);
      }
    });
    return wrappedDocument;
  }

  const documents = dataArray.map(data => createDocument(data, options));
  documents.forEach(document => {
    const errors = validate(document, getSchema(options?.version ?? defaultVersion));
    if (errors.length > 0) {
      throw new SchemaValidationError("Invalid document", errors, document);
    }
  });

  const batchHashes = documents.map(digestDocumentV2);
  return documents.map(doc => wrap(doc, batchHashes));
}

export const validateSchema = (document: WrappedDocument | VerifiableCredential<any>): boolean => {
  return validate(document, getSchema(`${document?.version || SchemaId.v2}`)).length === 0;
};

export function verifySignature<T = any>(document: any): document is WrappedDocument<T>;
export function verifySignature<T extends VerifiableCredential<OpenAttestationDocument>>(
  document: T
): document is VerifiableCredential<T>;
export function verifySignature(document: any) {
  return document.version === SchemaId.v3 ? verifyV3(document) : verify(document);
}

export function obfuscate<T = any>(document: WrappedDocument<T>, fields: string[] | string): WrappedDocument<T>;
export function obfuscate<T extends VerifiableCredential<OpenAttestationDocument>>(
  document: T,
  fields: string[] | string
): T;
export function obfuscate(document: any, fields: string[] | string) {
  return document.version === SchemaId.v3
    ? obfuscateDocumentV3(document, fields)
    : obfuscateDocumentV2(document, fields);
}

export { digestDocument as digestDocumentV2 } from "./v2/digest";
export { digestDocument as digestDocumentV3 } from "./v3/digest";
export { checkProof, MerkleTree } from "./shared/merkle";
// export { obfuscateDocument as obfuscateDocumentV2 } from "./v2/obfuscate";
// export { obfuscateDocument as obfuscateDocumentV3, validate as validateV3 } from "./v3/obfuscate";
export { obfuscate as obfuscateDocument };
export { sign } from "./shared/sign";
export { utils, isSchemaValidationError };
export * from "./shared/@types/document";
export * from "./v3/schema/w3c";
export { getData } from "./shared/utils"; // keep it to avoid breaking change, moved from privacy to utils
export { v2 };
export { v3 };
