(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('debug'), require('runtypes'), require('ethers'), require('js-sha3'), require('lodash'), require('validator/lib/isUUID'), require('uuid'), require('flatley'), require('crypto'), require('js-base64'), require('ajv'), require('ajv-formats'), require('jsonld'), require('node-fetch')) :
    typeof define === 'function' && define.amd ? define(['exports', 'debug', 'runtypes', 'ethers', 'js-sha3', 'lodash', 'validator/lib/isUUID', 'uuid', 'flatley', 'crypto', 'js-base64', 'ajv', 'ajv-formats', 'jsonld', 'node-fetch'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.openAttestation = {}, global.debug, global.runtypes, global.ethers, global.jsSha3, global.lodash, global.isUUID, global.uuid, global.flatley, global.crypto, global.jsBase64, global.Ajv, global.addFormats, global.jsonld, global.fetch));
}(this, (function (exports, debug, runtypes, ethers, jsSha3, lodash, isUUID, uuid, flatley, crypto, jsBase64, Ajv, addFormats, jsonld, fetch) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var debug__default = /*#__PURE__*/_interopDefaultLegacy(debug);
    var isUUID__default = /*#__PURE__*/_interopDefaultLegacy(isUUID);
    var Ajv__default = /*#__PURE__*/_interopDefaultLegacy(Ajv);
    var addFormats__default = /*#__PURE__*/_interopDefaultLegacy(addFormats);
    var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);

    var logger$1 = debug__default['default']("open-attestation");
    var getLogger = function (namespace) { return ({
        trace: logger$1.extend("trace:" + namespace),
        debug: logger$1.extend("debug:" + namespace),
        info: logger$1.extend("info:" + namespace),
        warn: logger$1.extend("warn:" + namespace),
        error: logger$1.extend("error:" + namespace),
    }); };

    exports.SchemaId = void 0;
    (function (SchemaId) {
        SchemaId["v2"] = "https://schema.openattestation.com/2.0/schema.json";
        SchemaId["v3"] = "https://schema.openattestation.com/3.0/schema.json";
    })(exports.SchemaId || (exports.SchemaId = {}));
    var OpenAttestationHexString = runtypes.String.withConstraint(function (value) { return ethers.ethers.utils.isHexString("0x" + value, 32) || value + " has not the expected length of 32 bytes"; });
    var SignatureAlgorithm = runtypes.Literal("OpenAttestationMerkleProofSignature2018");
    var ProofType$1 = runtypes.Literal("OpenAttestationSignature2018");
    var ProofPurpose = runtypes.Literal("assertionMethod");

    var UUIDV4_LENGTH = 37;
    var PRIMITIVE_TYPES = ["string", "number", "boolean", "undefined"];
    /* eslint-disable no-use-before-define */
    /**
     * Curried function that takes (iteratee)(value),
     * if value is a collection then recurse into it
     * otherwise apply `iteratee` on the primitive value
     */
    var recursivelyApply = function (iteratee) { return function (value) {
        if (lodash.includes(PRIMITIVE_TYPES, typeof value) || value === null) {
            return iteratee(value);
        }
        return deepMap(value, iteratee); // eslint-disable-line @typescript-eslint/no-use-before-define
    }; };
    /**
     * Applies `iteratee` to all fields in objects, goes into arrays as well.
     * Refer to test for example
     */
    var deepMap = function (collection, iteratee) {
        if (iteratee === void 0) { iteratee = lodash.identity; }
        if (collection instanceof Array) {
            return lodash.map(collection, recursivelyApply(iteratee));
        }
        if (typeof collection === "object") {
            return lodash.mapValues(collection, recursivelyApply(iteratee));
        }
        return collection;
    };
    /* eslint-enable no-use-before-define */
    // disabling this because of mutual recursion
    var startsWithUuidV4 = function (input) {
        if (input && typeof input === "string") {
            var elements = input.split(":");
            return isUUID__default['default'](elements[0], 4);
        }
        return false;
    };
    /**
     * Detects the type of a value and returns a string with type annotation
     */
    function primitiveToTypedString(value) {
        switch (typeof value) {
            case "number":
            case "string":
            case "boolean":
            case "undefined":
                return typeof value + ":" + String(value);
            default:
                if (value === null) {
                    // typeof null is 'object' so we have to check for it
                    return "null:null";
                }
                throw new Error("Parsing error, value is not of primitive type: " + value);
        }
    }
    /**
     * Returns an appropriately typed value given a string with type annotations, e.g: "number:5"
     */
    function typedStringToPrimitive(input) {
        var _a = input.split(":"), type = _a[0], valueArray = _a.slice(1);
        var value = valueArray.join(":"); // just in case there are colons in the value
        switch (type) {
            case "number":
                return Number(value);
            case "string":
                return String(value);
            case "boolean":
                return value === "true";
            case "null":
                return null;
            case "undefined":
                return undefined;
            default:
                throw new Error("Parsing error, type annotation not found in string: " + input);
        }
    }
    /**
     * Returns a salted value using a randomly generated uuidv4 string for salt
     */
    function uuidSalt(value) {
        var salt = uuid.v4();
        return salt + ":" + primitiveToTypedString(value);
    }
    /**
     * Value salted string in the format "salt:type:value", example: "ee7f3323-1634-4dea-8c12-f0bb83aff874:number:5"
     * Returns an appropriately typed value when given a salted string with type annotation
     */
    function unsalt(value) {
        if (startsWithUuidV4(value)) {
            var untypedValue = value.substring(UUIDV4_LENGTH).trim();
            return typedStringToPrimitive(untypedValue);
        }
        return value;
    }
    // Use uuid salting method to recursively salt data
    var saltData = function (data) { return deepMap(data, uuidSalt); };
    var unsaltData = function (data) { return deepMap(data, unsalt); };

    var IdentityProofType$1;
    (function (IdentityProofType) {
        IdentityProofType["DNSDid"] = "DNS-DID";
        IdentityProofType["DNSTxt"] = "DNS-TXT";
        IdentityProofType["Did"] = "DID";
    })(IdentityProofType$1 || (IdentityProofType$1 = {}));
    /**
     * Proof Open Attestation method
     */
    var Method;
    (function (Method) {
        Method["Did"] = "DID";
        Method["DocumentStore"] = "DOCUMENT_STORE";
        Method["TokenRegistry"] = "TOKEN_REGISTRY";
    })(Method || (Method = {}));
    /**
     * Revocation method (if required by proof method)
     */
    var RevocationType$1;
    (function (RevocationType) {
        RevocationType["None"] = "NONE";
        RevocationType["RevocationStore"] = "REVOCATION_STORE";
    })(RevocationType$1 || (RevocationType$1 = {}));
    /**
     * Proof method name as explained by https://www.w3.org/TR/vc-data-model/#types
     */
    var ProofType;
    (function (ProofType) {
        ProofType["OpenAttestationProofMethod"] = "OpenAttestationProofMethod";
    })(ProofType || (ProofType = {}));
    /**
     * Type of renderer template
     */
    var TemplateType$1;
    (function (TemplateType) {
        TemplateType["EmbeddedRenderer"] = "EMBEDDED_RENDERER";
    })(TemplateType$1 || (TemplateType$1 = {}));

    var ObfuscationMetadata$1 = runtypes.Record({
        obfuscated: runtypes.Array(OpenAttestationHexString),
    });
    var VerifiableCredentialWrappedProof = runtypes.Record({
        type: SignatureAlgorithm,
        targetHash: runtypes.String,
        merkleRoot: runtypes.String,
        proofs: runtypes.Array(runtypes.String),
        salts: runtypes.String,
        privacy: ObfuscationMetadata$1,
        proofPurpose: ProofPurpose,
    });
    var VerifiableCredentialWrappedProofStrict = VerifiableCredentialWrappedProof.And(runtypes.Record({
        targetHash: OpenAttestationHexString,
        merkleRoot: OpenAttestationHexString,
        proofs: runtypes.Array(OpenAttestationHexString),
    }));
    var VerifiableCredentialSignedProof = VerifiableCredentialWrappedProof.And(runtypes.Record({
        key: runtypes.String,
        signature: runtypes.String,
    }));

    var types$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ObfuscationMetadata: ObfuscationMetadata$1,
        VerifiableCredentialWrappedProof: VerifiableCredentialWrappedProof,
        VerifiableCredentialWrappedProofStrict: VerifiableCredentialWrappedProofStrict,
        VerifiableCredentialSignedProof: VerifiableCredentialSignedProof,
        get IdentityProofType () { return IdentityProofType$1; },
        get Method () { return Method; },
        get RevocationType () { return RevocationType$1; },
        get ProofType () { return ProofType; },
        get TemplateType () { return TemplateType$1; }
    });

    /**
     * Type of renderer template
     */
    var TemplateType;
    (function (TemplateType) {
        TemplateType["EmbeddedRenderer"] = "EMBEDDED_RENDERER";
    })(TemplateType || (TemplateType = {}));
    var IdentityProofType;
    (function (IdentityProofType) {
        IdentityProofType["DNSDid"] = "DNS-DID";
        IdentityProofType["DNSTxt"] = "DNS-TXT";
        IdentityProofType["Did"] = "DID";
    })(IdentityProofType || (IdentityProofType = {}));
    var RevocationType;
    (function (RevocationType) {
        RevocationType["None"] = "NONE";
        RevocationType["RevocationStore"] = "REVOCATION_STORE";
    })(RevocationType || (RevocationType = {}));

    var ObfuscationMetadata = runtypes.Partial({
        obfuscatedData: runtypes.Array(OpenAttestationHexString),
    });
    var Proof = runtypes.Record({
        type: ProofType$1,
        created: runtypes.String,
        proofPurpose: ProofPurpose,
        verificationMethod: runtypes.String,
        signature: runtypes.String,
    });
    var ArrayProof = runtypes.Array(Proof);
    var Signature = runtypes.Record({
        type: runtypes.Literal("SHA3MerkleProof"),
        targetHash: runtypes.String,
        merkleRoot: runtypes.String,
        proof: runtypes.Array(runtypes.String),
    });
    var SignatureStrict = Signature.And(runtypes.Record({
        targetHash: OpenAttestationHexString,
        merkleRoot: OpenAttestationHexString,
        proof: runtypes.Array(OpenAttestationHexString),
    }));

    var types = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ObfuscationMetadata: ObfuscationMetadata,
        Proof: Proof,
        ArrayProof: ArrayProof,
        Signature: Signature,
        SignatureStrict: SignatureStrict,
        get TemplateType () { return TemplateType; },
        get IdentityProofType () { return IdentityProofType; },
        get RevocationType () { return RevocationType; }
    });

    var title$1 = "Open Attestation Schema 2.0";
    var $id$1 = "https://schema.openattestation.com/2.0/schema.json";
    var $schema$1 = "http://json-schema.org/draft-07/schema#";
    var definitions$1 = {
    	identityProofDns: {
    		type: "object",
    		properties: {
    			type: {
    				type: "string",
    				"enum": [
    					"DNS-TXT"
    				]
    			},
    			location: {
    				type: "string",
    				description: "Url of the website referencing to document store"
    			}
    		},
    		required: [
    			"type",
    			"location"
    		]
    	},
    	identityProofDid: {
    		type: "object",
    		properties: {
    			type: {
    				type: "string",
    				"enum": [
    					"DID"
    				]
    			},
    			key: {
    				type: "string",
    				description: "Public key associated"
    			}
    		},
    		required: [
    			"type",
    			"key"
    		]
    	},
    	identityProofDnsDid: {
    		type: "object",
    		properties: {
    			type: {
    				type: "string",
    				"enum": [
    					"DNS-DID"
    				]
    			},
    			key: {
    				type: "string",
    				description: "Public key associated"
    			},
    			location: {
    				type: "string",
    				description: "Url of the website referencing to document store"
    			}
    		},
    		required: [
    			"type",
    			"key",
    			"location"
    		]
    	},
    	identityProof: {
    		type: "object",
    		oneOf: [
    			{
    				$ref: "#/definitions/identityProofDns"
    			},
    			{
    				$ref: "#/definitions/identityProofDnsDid"
    			},
    			{
    				$ref: "#/definitions/identityProofDid"
    			}
    		]
    	},
    	issuer: {
    		type: "object",
    		properties: {
    			id: {
    				type: "string",
    				description: "Issuer's id, DID can be used"
    			},
    			name: {
    				type: "string",
    				description: "Issuer's name"
    			},
    			revocation: {
    				type: "object",
    				properties: {
    					type: {
    						type: "string",
    						"enum": [
    							"NONE",
    							"REVOCATION_STORE"
    						]
    					},
    					location: {
    						type: "string",
    						description: "Smart contract address or url of certificate revocation list for Revocation Store type revocation"
    					}
    				}
    			},
    			identityProof: {
    				$ref: "#/definitions/identityProof"
    			}
    		},
    		required: [
    			"name",
    			"identityProof"
    		],
    		additionalProperties: true
    	},
    	documentStore: {
    		allOf: [
    			{
    				$ref: "#/definitions/issuer"
    			},
    			{
    				type: "object",
    				properties: {
    					documentStore: {
    						type: "string",
    						pattern: "^0x[a-fA-F0-9]{40}$",
    						description: "Smart contract address of document store"
    					}
    				},
    				required: [
    					"documentStore"
    				]
    			}
    		]
    	},
    	certificateStore: {
    		type: "object",
    		properties: {
    			name: {
    				type: "string",
    				description: "Issuer's name"
    			},
    			certificateStore: {
    				type: "string",
    				pattern: "^0x[a-fA-F0-9]{40}$",
    				deprecationMessage: "Use documentStore and identityProof instead of this",
    				description: "Smart contract address of certificate store. Same as documentStore"
    			}
    		},
    		required: [
    			"name",
    			"certificateStore"
    		],
    		additionalProperties: true
    	},
    	tokenRegistry: {
    		allOf: [
    			{
    				$ref: "#/definitions/issuer"
    			},
    			{
    				type: "object",
    				properties: {
    					tokenRegistry: {
    						type: "string",
    						pattern: "^0x[a-fA-F0-9]{40}$",
    						description: "Smart contract address of token registry"
    					}
    				},
    				required: [
    					"tokenRegistry"
    				]
    			}
    		]
    	}
    };
    var type$1 = "object";
    var properties$1 = {
    	id: {
    		type: "string",
    		description: "Internal reference, usually serial number, of this document"
    	},
    	$template: {
    		oneOf: [
    			{
    				type: "string"
    			},
    			{
    				type: "object",
    				properties: {
    					name: {
    						type: "string",
    						description: "Template name to be use by template renderer to determine the template to use"
    					},
    					type: {
    						type: "string",
    						description: "Type of renderer template",
    						"enum": [
    							"EMBEDDED_RENDERER"
    						]
    					},
    					url: {
    						type: "string",
    						description: "URL of a decentralised renderer to render this document"
    					}
    				},
    				required: [
    					"name",
    					"type"
    				]
    			}
    		]
    	},
    	documentUrl: {
    		type: "string",
    		description: "URL of the stored document"
    	},
    	issuers: {
    		type: "array",
    		items: {
    			type: "object",
    			title: "issuer",
    			oneOf: [
    				{
    					$ref: "#/definitions/tokenRegistry"
    				},
    				{
    					$ref: "#/definitions/documentStore"
    				},
    				{
    					$ref: "#/definitions/certificateStore"
    				},
    				{
    					allOf: [
    						{
    							$ref: "#/definitions/issuer"
    						},
    						{
    							not: {
    								anyOf: [
    									{
    										required: [
    											"certificateStore"
    										]
    									},
    									{
    										required: [
    											"tokenRegistry"
    										]
    									},
    									{
    										required: [
    											"documentStore"
    										]
    									}
    								]
    							}
    						}
    					]
    				}
    			]
    		},
    		minItems: 1
    	},
    	recipient: {
    		type: "object",
    		properties: {
    			name: {
    				type: "string",
    				description: "Recipient's name"
    			}
    		},
    		additionalProperties: true
    	},
    	attachments: {
    		type: "array",
    		items: {
    			type: "object",
    			properties: {
    				filename: {
    					type: "string",
    					description: "Name of attachment, with appropriate extensions"
    				},
    				type: {
    					type: "string",
    					description: "Type of attachment"
    				},
    				data: {
    					type: "string",
    					description: "Base64 encoding of attachment"
    				}
    			},
    			required: [
    				"filename",
    				"type",
    				"data"
    			],
    			additionalProperties: false
    		}
    	}
    };
    var required$1 = [
    	"issuers"
    ];
    var additionalProperties$1 = true;
    var openAttestationSchemav2 = {
    	title: title$1,
    	$id: $id$1,
    	$schema: $schema$1,
    	definitions: definitions$1,
    	type: type$1,
    	properties: properties$1,
    	required: required$1,
    	additionalProperties: additionalProperties$1
    };

    var title = "Open Attestation Schema 3.0";
    var $id = "https://schema.openattestation.com/3.0/schema.json";
    var $schema = "http://json-schema.org/draft-07/schema#";
    var type = "object";
    var definitions = {
    	type: {
    		oneOf: [
    			{
    				type: "array",
    				items: {
    					type: "string"
    				}
    			},
    			{
    				type: "string"
    			}
    		]
    	},
    	issuer: {
    		type: "object",
    		properties: {
    			id: {
    				type: "string",
    				format: "uri",
    				description: "URI when dereferenced, results in a document containing machine-readable information about the issuer that can be used to verify the information expressed in the credential. More information in https://www.w3.org/TR/vc-data-model/#issuer"
    			},
    			name: {
    				type: "string",
    				description: "Issuer's name"
    			}
    		},
    		required: [
    			"id",
    			"name"
    		],
    		additionalProperties: true
    	}
    };
    var properties = {
    	"@context": {
    		type: "array",
    		items: {
    			type: [
    				"string",
    				"object"
    			],
    			format: "uri"
    		},
    		description: "List of URI to determine the terminology used in the verifiable credential as explained by https://www.w3.org/TR/vc-data-model/#contexts"
    	},
    	id: {
    		type: "string",
    		format: "uri",
    		description: "URI to the subject of the credential as explained by https://www.w3.org/TR/vc-data-model/#credential-subject"
    	},
    	type: {
    		$ref: "#/definitions/type",
    		description: "Specific verifiable credential type as explained by https://www.w3.org/TR/vc-data-model/#types"
    	},
    	reference: {
    		type: "string",
    		description: "Internal reference, usually a serial number, of this document"
    	},
    	name: {
    		type: "string",
    		description: "Human readable name of this credential"
    	},
    	issuanceDate: {
    		type: "string",
    		format: "date-time",
    		description: "The date and time when this credential becomes valid (may be deprecated in favor of issued/validFrom a future version of W3C's VC Data Model)"
    	},
    	expirationDate: {
    		type: "string",
    		format: "date-time",
    		description: "The date and time when this credential expires"
    	},
    	issued: {
    		type: "string",
    		format: "date-time",
    		description: "The date and time when this credential becomes valid"
    	},
    	validFrom: {
    		type: "string",
    		format: "date-time",
    		description: "The date and time when this credential becomes valid"
    	},
    	validUntil: {
    		type: "string",
    		format: "date-time",
    		description: "The date and time when this credential expires"
    	},
    	credentialSubject: {
    		oneOf: [
    			{
    				type: "object"
    			},
    			{
    				type: "array",
    				items: {
    					type: "object"
    				}
    			}
    		]
    	},
    	credentialStatus: {
    		type: "object",
    		properties: {
    			id: {
    				type: "string",
    				format: "uri",
    				examples: [
    					"https://example.edu/status/24"
    				]
    			},
    			type: {
    				type: "string",
    				examples: [
    					"CredentialStatusList2017"
    				],
    				description: "Express the credential status type (also referred to as the credential status method). It is expected that the value will provide enough information to determine the current status of the credential. For example, the object could contain a link to an external document noting whether or not the credential is suspended or revoked."
    			}
    		},
    		required: [
    			"id",
    			"type"
    		]
    	},
    	issuer: {
    		oneOf: [
    			{
    				$ref: "#/definitions/issuer"
    			},
    			{
    				type: "string"
    			}
    		]
    	},
    	openAttestationMetadata: {
    		type: "object",
    		properties: {
    			template: {
    				type: "object",
    				properties: {
    					name: {
    						type: "string",
    						description: "Template name to be use by template renderer to determine the template to use"
    					},
    					type: {
    						type: "string",
    						description: "Type of renderer template",
    						"enum": [
    							"EMBEDDED_RENDERER"
    						]
    					},
    					url: {
    						type: "string",
    						description: "URL of a decentralised renderer to render this document",
    						pattern: "^(https?)://"
    					}
    				},
    				required: [
    					"name",
    					"type",
    					"url"
    				],
    				additionalProperties: false
    			},
    			proof: {
    				type: "object",
    				properties: {
    					type: {
    						type: "string",
    						description: "Proof method name as explained by https://www.w3.org/TR/vc-data-model/#types",
    						"enum": [
    							"OpenAttestationProofMethod"
    						]
    					},
    					method: {
    						type: "string",
    						description: "Proof Open Attestation method",
    						"enum": [
    							"TOKEN_REGISTRY",
    							"DOCUMENT_STORE",
    							"DID"
    						]
    					},
    					value: {
    						description: "Proof value of issuer(s). Smart contract address for TOKEN_REGISTRY & DOCUMENT_STORE, did for DID method",
    						type: "string"
    					},
    					revocation: {
    						type: "object",
    						properties: {
    							type: {
    								type: "string",
    								description: "Revocation method (if required by proof method)",
    								"enum": [
    									"NONE",
    									"REVOCATION_STORE"
    								]
    							},
    							location: {
    								type: "string",
    								description: "Smart contract address or url of certificate revocation list for Revocation Store type revocation"
    							}
    						},
    						required: [
    							"type"
    						]
    					}
    				},
    				required: [
    					"type",
    					"method",
    					"value"
    				],
    				additionalProperties: true
    			},
    			identityProof: {
    				type: "object",
    				properties: {
    					type: {
    						type: "string",
    						"enum": [
    							"DNS-TXT",
    							"DNS-DID",
    							"DID"
    						]
    					},
    					identifier: {
    						type: "string",
    						description: "Identifier to be shown to end user upon verifying the identity"
    					}
    				},
    				additionalProperties: false,
    				required: [
    					"type",
    					"identifier"
    				]
    			}
    		},
    		required: [
    			"proof",
    			"identityProof"
    		]
    	},
    	attachments: {
    		type: "array",
    		items: {
    			type: "object",
    			properties: {
    				fileName: {
    					type: "string",
    					description: "Name of this attachment, with appropriate extensions"
    				},
    				mimeType: {
    					type: "string",
    					description: "Media type (or MIME type) of this attachment"
    				},
    				data: {
    					type: "string",
    					description: "Base64 encoding of this attachment"
    				}
    			},
    			required: [
    				"fileName",
    				"mimeType",
    				"data"
    			],
    			additionalProperties: false
    		}
    	}
    };
    var required = [
    	"@context",
    	"type",
    	"credentialSubject",
    	"issuer",
    	"issuanceDate",
    	"openAttestationMetadata"
    ];
    var additionalProperties = true;
    var openAttestationSchemav3 = {
    	title: title,
    	$id: $id,
    	$schema: $schema,
    	type: type,
    	definitions: definitions,
    	properties: properties,
    	required: required,
    	additionalProperties: additionalProperties
    };

    var __assign$6 = (undefined && undefined.__assign) || function () {
        __assign$6 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$6.apply(this, arguments);
    };
    var __rest$1 = (undefined && undefined.__rest) || function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };
    var defaultTransform = function (schema) { return schema; };
    var buildAjv = function (options) {
        if (options === void 0) { options = {
            transform: defaultTransform,
        }; }
        var transform = options.transform, ajvOptions = __rest$1(options, ["transform"]);
        var ajv = new Ajv__default['default'](__assign$6({ allErrors: true, allowUnionTypes: true }, ajvOptions));
        addFormats__default['default'](ajv);
        ajv.addKeyword("deprecationMessage");
        ajv.compile(transform(openAttestationSchemav2));
        ajv.compile(transform(openAttestationSchemav3));
        return ajv;
    };
    var localAjv = buildAjv();
    var getSchema = function (key, ajv) {
        if (ajv === void 0) { ajv = localAjv; }
        var schema = ajv.getSchema(key);
        if (!schema)
            throw new Error("Could not find " + key + " schema");
        return schema;
    };

    var __spreadArray$2 = (undefined && undefined.__spreadArray) || function (to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    };
    var handleError = function (debug) {
        var messages = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            messages[_i - 1] = arguments[_i];
        }
        if (debug) {
            for (var _a = 0, messages_1 = messages; _a < messages_1.length; _a++) {
                var message = messages_1[_a];
                ethers.logger.info(message);
            }
        }
        return messages.map(function (message) { return ({ message: message }); });
    };
    // remove enum and pattern from the schema
    function transformSchema(schema) {
        var _a, _b, _c, _d, _e, _f;
        var excludeKeys = ["enum", "pattern"];
        function omit(value) {
            if (value && typeof value === "object") {
                var key = excludeKeys.find(function (key) { return value[key]; });
                if (key) {
                    var node_1 = lodash.clone(value);
                    excludeKeys.forEach(function (key) {
                        delete node_1[key];
                    });
                    return node_1;
                }
            }
        }
        var newSchema = lodash.cloneDeepWith(schema, omit);
        // because we remove check on enum (DNS-DID, DNS-TXT, etc.) the identity proof can match multiple sub schema in v2.
        // so here we change oneOf to anyOf, so that if more than one identityProof matches, it still passes
        if ((_b = (_a = newSchema === null || newSchema === void 0 ? void 0 : newSchema.definitions) === null || _a === void 0 ? void 0 : _a.identityProof) === null || _b === void 0 ? void 0 : _b.oneOf) {
            newSchema.definitions.identityProof.anyOf = (_d = (_c = newSchema === null || newSchema === void 0 ? void 0 : newSchema.definitions) === null || _c === void 0 ? void 0 : _c.identityProof) === null || _d === void 0 ? void 0 : _d.oneOf;
            (_f = (_e = newSchema === null || newSchema === void 0 ? void 0 : newSchema.definitions) === null || _e === void 0 ? void 0 : _e.identityProof) === null || _f === void 0 ? true : delete _f.oneOf;
        }
        return newSchema;
    }
    // custom ajv for loose schema validation
    // it will allow invalid format, invalid pattern and invalid enum
    var ajv = buildAjv({ transform: transformSchema, validateFormats: false });
    /**
     * Tools to give information about the validity of a document. It will return and eventually output the errors found.
     * @param version 2.0 or 3.0
     * @param kind wrapped or signed
     * @param debug turn on to output in the console, the errors found
     * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
     * @param document the document to validate
     */
    var diagnose = function (_a) {
        var version = _a.version, kind = _a.kind, document = _a.document, _b = _a.debug, debug = _b === void 0 ? false : _b, mode = _a.mode;
        if (!document) {
            return handleError(debug, "The document must not be empty");
        }
        if (typeof document !== "object") {
            return handleError(debug, "The document must be an object");
        }
        var errors = validateSchema$1(document, getSchema(version === "3.0" ? exports.SchemaId.v3 : exports.SchemaId.v2, mode === "non-strict" ? ajv : undefined));
        if (errors.length > 0) {
            // TODO this can be improved later
            return handleError.apply(void 0, __spreadArray$2([debug, "The document does not match OpenAttestation schema " + (version === "3.0" ? "3.0" : "2.0")], errors.map(function (error) { return (error.instancePath || "document") + " - " + error.message; })));
        }
        if (version === "3.0") {
            return diagnoseV3({ mode: mode, debug: debug, document: document, kind: kind });
        }
        else {
            return diagnoseV2({ mode: mode, debug: debug, document: document, kind: kind });
        }
    };
    var diagnoseV2 = function (_a) {
        var kind = _a.kind, document = _a.document, debug = _a.debug, mode = _a.mode;
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            mode === "strict" ? SignatureStrict.check(document.signature) : Signature.check(document.signature);
        }
        catch (e) {
            return handleError(debug, e.message);
        }
        if (kind === "signed") {
            if (!document.proof || !(document.proof.length > 0)) {
                return handleError(debug, "The document does not have a proof");
            }
            try {
                ArrayProof.check(document.proof);
            }
            catch (e) {
                return handleError(debug, e.message);
            }
        }
        return [];
    };
    var diagnoseV3 = function (_a) {
        var kind = _a.kind, document = _a.document, debug = _a.debug, mode = _a.mode;
        if (document.version !== exports.SchemaId.v3) {
            return handleError(debug, "The document schema version is wrong. Expected " + exports.SchemaId.v3 + ", received " + document.version);
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            mode === "strict"
                ? VerifiableCredentialWrappedProofStrict.check(document.proof)
                : VerifiableCredentialWrappedProof.check(document.proof);
        }
        catch (e) {
            return handleError(debug, e.message);
        }
        if (kind === "signed") {
            if (!document.proof) {
                return handleError(debug, "The document does not have a proof");
            }
            try {
                VerifiableCredentialSignedProof.check(document.proof);
            }
            catch (e) {
                return handleError(debug, e.message);
            }
        }
        return [];
    };

    /**
     *
     * @param document
     * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
     */
    var isWrappedV3Document = function (document, _a) {
        var _b = _a === void 0 ? { mode: "non-strict" } : _a, mode = _b.mode;
        return diagnose({ version: "3.0", kind: "wrapped", document: document, debug: false, mode: mode }).length === 0;
    };
    /**
     *
     * @param document
     * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
     */
    var isWrappedV2Document = function (document, _a) {
        var _b = _a === void 0 ? { mode: "non-strict" } : _a, mode = _b.mode;
        return diagnose({ version: "2.0", kind: "wrapped", document: document, debug: false, mode: mode }).length === 0;
    };
    /**
     *
     * @param document
     * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
     */
    var isSignedWrappedV2Document = function (document, _a) {
        var _b = _a === void 0 ? { mode: "non-strict" } : _a, mode = _b.mode;
        return diagnose({ version: "2.0", kind: "signed", document: document, debug: false, mode: mode }).length === 0;
    };
    /**
     *
     * @param document
     * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
     */
    var isSignedWrappedV3Document = function (document, _a) {
        var _b = _a === void 0 ? { mode: "non-strict" } : _a, mode = _b.mode;
        return diagnose({ version: "3.0", kind: "signed", document: document, debug: false, mode: mode }).length === 0;
    };

    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __spreadArray$1 = (undefined && undefined.__spreadArray) || function (to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    };
    var getData = function (document) {
        return unsaltData(document.data);
    };
    /**
     * Sorts the given Buffers lexicographically and then concatenates them to form one continuous Buffer
     */
    function bufSortJoin() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return Buffer.concat(__spreadArray$1([], args).sort(Buffer.compare));
    }
    // If hash is not a buffer, convert it to buffer (without hashing it)
    function hashToBuffer(hash) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore https://github.com/Microsoft/TypeScript/issues/23155
        return Buffer.isBuffer(hash) && hash.length === 32 ? hash : Buffer.from(hash, "hex");
    }
    // If element is not a buffer, stringify it and then hash it to be a buffer
    function toBuffer(element) {
        return Buffer.isBuffer(element) && element.length === 32 ? element : hashToBuffer(jsSha3.keccak256(JSON.stringify(element)));
    }
    /**
     * Turns array of data into sorted array of hashes
     */
    function hashArray(arr) {
        return arr.map(function (i) { return toBuffer(i); }).sort(Buffer.compare);
    }
    /**
     * Returns the keccak hash of two buffers after concatenating them and sorting them
     * If either hash is not given, the input is returned
     */
    function combineHashBuffers(first, second) {
        if (!second) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return first; // it should always be valued if second is not
        }
        if (!first) {
            return second;
        }
        return hashToBuffer(jsSha3.keccak256(bufSortJoin(first, second)));
    }
    /**
     * Returns the keccak hash of two string after concatenating them and sorting them
     * If either hash is not given, the input is returned
     * @param first A string to be hashed (without 0x)
     * @param second A string to be hashed (without 0x)
     * @returns Resulting string after the hash is combined (without 0x)
     */
    function combineHashString(first, second) {
        return first && second
            ? combineHashBuffers(hashToBuffer(first), hashToBuffer(second)).toString("hex")
            : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                (first || second); // this should always return a value right ? :)
    }
    function getIssuerAddress(document) {
        if (isWrappedV2Document(document)) {
            var data = getData(document);
            return data.issuers.map(function (issuer) { return issuer.certificateStore || issuer.documentStore || issuer.tokenRegistry; });
        }
        else if (isWrappedV3Document(document)) {
            return document.openAttestationMetadata.proof.value;
        }
        throw new Error("Unsupported document type: Only can retrieve issuer address from wrapped OpenAttestation v2 & v3 documents.");
    }
    var getMerkleRoot = function (document) {
        switch (true) {
            case isWrappedV2Document(document):
                return document.signature.merkleRoot;
            case isWrappedV3Document(document):
                return document.proof.merkleRoot;
            default:
                throw new Error("Unsupported document type: Only can retrieve merkle root from wrapped OpenAttestation v2 & v3 documents.");
        }
    };
    var getTargetHash = function (document) {
        switch (true) {
            case isWrappedV2Document(document):
                return document.signature.targetHash;
            case isWrappedV3Document(document):
                return document.proof.targetHash;
            default:
                throw new Error("Unsupported document type: Only can retrieve target hash from wrapped OpenAttestation v2 & v3 documents.");
        }
    };
    var isTransferableAsset = function (document) {
        var _a, _b, _c, _d;
        return (!!((_b = (_a = getData(document)) === null || _a === void 0 ? void 0 : _a.issuers[0]) === null || _b === void 0 ? void 0 : _b.tokenRegistry) ||
            ((_d = (_c = document === null || document === void 0 ? void 0 : document.openAttestationMetadata) === null || _c === void 0 ? void 0 : _c.proof) === null || _d === void 0 ? void 0 : _d.method) === "TOKEN_REGISTRY");
    };
    var getAssetId = function (document) {
        if (isTransferableAsset(document)) {
            return getTargetHash(document);
        }
        throw new Error("Unsupported document type: Only can retrieve asset id from wrapped OpenAttestation v2 & v3 transferable documents.");
    };
    var SchemaValidationError = /** @class */ (function (_super) {
        __extends(SchemaValidationError, _super);
        function SchemaValidationError(message, validationErrors, document) {
            var _this = _super.call(this, message) || this;
            _this.validationErrors = validationErrors;
            _this.document = document;
            return _this;
        }
        return SchemaValidationError;
    }(Error));
    var isSchemaValidationError$1 = function (error) {
        return !!error.validationErrors;
    };
    var isObfuscated = function (document) {
        var _a, _b, _c, _d;
        if (isWrappedV3Document(document)) {
            return !!((_b = (_a = document.proof.privacy) === null || _a === void 0 ? void 0 : _a.obfuscated) === null || _b === void 0 ? void 0 : _b.length);
        }
        if (isWrappedV2Document(document)) {
            return !!((_d = (_c = document.privacy) === null || _c === void 0 ? void 0 : _c.obfuscatedData) === null || _d === void 0 ? void 0 : _d.length);
        }
        throw new Error("Unsupported document type: Can only check if there are obfuscated data from wrapped OpenAttestation v2 & v3 documents.");
    };
    var getObfuscatedData = function (document) {
        var _a, _b;
        if (isWrappedV3Document(document)) {
            return (_a = document.proof.privacy) === null || _a === void 0 ? void 0 : _a.obfuscated;
        }
        if (isWrappedV2Document(document)) {
            return ((_b = document.privacy) === null || _b === void 0 ? void 0 : _b.obfuscatedData) || [];
        }
        throw new Error("Unsupported document type: Can only retrieve obfuscated data from wrapped OpenAttestation v2 & v3 documents.");
    };

    var index = /*#__PURE__*/Object.freeze({
        __proto__: null,
        keccak256: jsSha3.keccak256,
        getData: getData,
        bufSortJoin: bufSortJoin,
        hashToBuffer: hashToBuffer,
        toBuffer: toBuffer,
        hashArray: hashArray,
        combineHashBuffers: combineHashBuffers,
        combineHashString: combineHashString,
        getIssuerAddress: getIssuerAddress,
        getMerkleRoot: getMerkleRoot,
        getTargetHash: getTargetHash,
        isTransferableAsset: isTransferableAsset,
        getAssetId: getAssetId,
        SchemaValidationError: SchemaValidationError,
        isSchemaValidationError: isSchemaValidationError$1,
        isObfuscated: isObfuscated,
        getObfuscatedData: getObfuscatedData,
        isWrappedV3Document: isWrappedV3Document,
        isWrappedV2Document: isWrappedV2Document,
        isSignedWrappedV2Document: isSignedWrappedV2Document,
        isSignedWrappedV3Document: isSignedWrappedV3Document,
        diagnose: diagnose
    });

    var logger = getLogger("validate");
    var validateSchema$1 = function (document, validator) {
        var _a;
        if (!validator) {
            throw new Error("No schema validator provided");
        }
        var valid = validator(document.version === exports.SchemaId.v3 ? document : getData(document));
        if (!valid) {
            logger.debug("There are errors in the document: " + JSON.stringify(validator.errors));
            return (_a = validator.errors) !== null && _a !== void 0 ? _a : [];
        }
        logger.debug("Document is a valid open attestation document v" + document.version);
        return [];
    };

    var hasPeriodInKey = function (key) {
        if (key.indexOf(".") >= 0) {
            throw new Error("Key names must not have . in them");
        }
        return false;
    };
    var filters = [{ test: hasPeriodInKey }];
    /**
     * Calls external flatten library but ensures that global filters are always applied
     * @param data
     * @param options
     */
    var flatten = function (data, options) {
        var _a;
        var newOptions = options ? lodash.cloneDeep(options) : {};
        if (newOptions.coercion) {
            (_a = newOptions.coercion).push.apply(_a, filters);
        }
        else {
            newOptions.coercion = filters;
        }
        return flatley.flatten(data, newOptions);
    };

    var isKeyOrValueUndefined = function (value, key) { return value === undefined || key === undefined; };
    var flattenHashArray = function (data) {
        var flattenedData = lodash.omitBy(flatten(data), isKeyOrValueUndefined);
        return Object.keys(flattenedData).map(function (k) {
            var obj = {};
            obj[k] = flattenedData[k];
            return jsSha3.keccak256(JSON.stringify(obj));
        });
    };
    var digestDocument = function (document) {
        // Prepare array of hashes from filtered data
        var hashedDataArray = lodash.get(document, "privacy.obfuscatedData", []);
        // Prepare array of hashes from visible data
        var unhashedData = lodash.get(document, "data");
        var hashedUnhashedDataArray = flattenHashArray(unhashedData);
        // Combine both array and sort them to ensure determinism
        var combinedHashes = hashedDataArray.concat(hashedUnhashedDataArray);
        var sortedHashes = lodash.sortBy(combinedHashes);
        // Finally, return the digest of the entire set of data
        return jsSha3.keccak256(JSON.stringify(sortedHashes));
    };

    function getNextLayer(elements) {
        return elements.reduce(function (layer, element, index, arr) {
            if (index % 2 === 0) {
                // only calculate hash for even indexes
                layer.push(combineHashBuffers(element, arr[index + 1]));
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
            this.elements = hashArray(_elements);
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
            var element = toBuffer(_element);
            var index = this.elements.findIndex(function (e) { return e.equals(element); }); // searches for given element in the merkle tree and returns the index
            if (index === -1) {
                throw new Error("Element not found");
            }
            return getProof(index, this.layers);
        };
        return MerkleTree;
    }());
    /**
     * Function that runs through the supplied hashes to arrive at the supplied merkle root hash
     * @param _proof The list of uncle hashes required to arrive at the supplied merkle root
     * @param _root The merkle root
     * @param _element The leaf node that is being verified
     */
    var checkProof = function (_proof, _root, _element) {
        var proof = _proof.map(function (step) { return hashToBuffer(step); });
        var root = hashToBuffer(_root);
        var element = hashToBuffer(_element);
        var proofRoot = proof.reduce(function (hash, pair) { return combineHashBuffers(hash, pair); }, element);
        return root.equals(proofRoot);
    };

    var verify$1 = function (document) {
        var _a, _b, _c, _d;
        var signature = lodash.get(document, "signature");
        if (!signature) {
            return false;
        }
        // Checks target hash
        var digest = digestDocument(document);
        var targetHash = lodash.get(document, "signature.targetHash");
        if (digest !== targetHash)
            return false;
        // Calculates merkle root from target hash and proof, then compare to merkle root in document
        return checkProof((_b = (_a = document === null || document === void 0 ? void 0 : document.signature) === null || _a === void 0 ? void 0 : _a.proof) !== null && _b !== void 0 ? _b : [], (_c = document === null || document === void 0 ? void 0 : document.signature) === null || _c === void 0 ? void 0 : _c.merkleRoot, (_d = document === null || document === void 0 ? void 0 : document.signature) === null || _d === void 0 ? void 0 : _d.targetHash);
    };

    var digestCredential = function (document, salts, obfuscatedData) {
        // Prepare array of hashes from visible data
        var hashedUnhashedDataArray = salts
            .filter(function (salt) { return lodash.get(document, salt.path); })
            .map(function (salt) {
            var _a;
            return jsSha3.keccak256(JSON.stringify((_a = {}, _a[salt.path] = salt.value + ":" + lodash.get(document, salt.path), _a)));
        });
        // Combine both array and sort them to ensure determinism
        var combinedHashes = obfuscatedData.concat(hashedUnhashedDataArray);
        var sortedHashes = lodash.sortBy(combinedHashes);
        // Finally, return the digest of the entire set of data
        return jsSha3.keccak256(JSON.stringify(sortedHashes));
    };

    function traverseAndFlatten(data, _a) {
        var iteratee = _a.iteratee, _b = _a.path, path = _b === void 0 ? "" : _b;
        if (Array.isArray(data)) {
            return data.flatMap(function (v, index) { return traverseAndFlatten(v, { iteratee: iteratee, path: path + "[" + index + "]" }); });
        }
        // Since null datas are allowed but typeof null === "object", the "&& data" is used to skip this
        if (typeof data === "object" && data) {
            return Object.keys(data).flatMap(function (key) {
                return traverseAndFlatten(data[key], { iteratee: iteratee, path: path ? path + "." + key : key });
            });
        }
        if (typeof data === "string" || typeof data === "number" || typeof data === "boolean" || data === null) {
            return iteratee({ value: data, path: path });
        }
        throw new Error("Unexpected data '" + data + "' in '" + path + "'");
    }

    var ENTROPY_IN_BYTES = 32;
    var illegalCharactersCheck = function (data) {
        Object.entries(data).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (key.includes(".")) {
                throw new Error("Key names must not have . in them");
            }
            if (key.includes("[") || key.includes("]")) {
                throw new Error("Key names must not have '[' or ']' in them");
            }
            if (value && typeof value === "object") {
                return illegalCharactersCheck(value); // Recursively search if property contains sub-properties
            }
        });
    };
    // Using 32 bytes of entropy as compared to 16 bytes in uuid
    // Using hex encoding as compared to base64 for constant string length
    var secureRandomString = function () { return crypto.randomBytes(ENTROPY_IN_BYTES).toString("hex"); };
    var salt = function (data) {
        // Check for illegal characters e.g. '.', '[' or ']'
        illegalCharactersCheck(data);
        return traverseAndFlatten(data, { iteratee: function (_a) {
                var path = _a.path;
                return ({ value: secureRandomString(), path: path });
            } });
    };
    var encodeSalt = function (salts) { return jsBase64.Base64.encode(JSON.stringify(salts)); };
    var decodeSalt = function (salts) {
        var decoded = JSON.parse(jsBase64.Base64.decode(salts));
        decoded.forEach(function (salt) {
            if (salt.value.length !== ENTROPY_IN_BYTES * 2)
                throw new Error("Salt must be " + ENTROPY_IN_BYTES + " bytes");
        });
        return decoded;
    };

    var __rest = (undefined && undefined.__rest) || function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };
    var verify = function (document) {
        if (!document.proof) {
            return false;
        }
        // Remove proof from document
        // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
        document.proof; var documentWithoutProof = __rest(document, ["proof"]);
        var decodedSalts = decodeSalt(document.proof.salts);
        // Checks to ensure there are no added/removed values, so visibleSalts.length must match decodedSalts.length
        var visibleSalts = salt(documentWithoutProof);
        if (visibleSalts.length !== decodedSalts.length)
            return false;
        // Checks target hash
        var digest = digestCredential(documentWithoutProof, decodedSalts, document.proof.privacy.obfuscated);
        var targetHash = document.proof.targetHash;
        if (digest !== targetHash)
            return false;
        // Calculates merkle root from target hash and proof, then compare to merkle root in document
        return checkProof(document.proof.proofs, document.proof.merkleRoot, document.proof.targetHash);
    };

    var __assign$5 = (undefined && undefined.__assign) || function () {
        __assign$5 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$5.apply(this, arguments);
    };
    var createDocument = function (data, option) {
        var documentSchema = {
            version: exports.SchemaId.v2,
            data: saltData(data),
        };
        if (option === null || option === void 0 ? void 0 : option.externalSchemaId) {
            documentSchema.schema = option.externalSchemaId;
        }
        return documentSchema;
    };
    var wrapDocument$2 = function (data, options) {
        var _a;
        var document = createDocument(data, options);
        var errors = validateSchema$1(document, getSchema((_a = options === null || options === void 0 ? void 0 : options.version) !== null && _a !== void 0 ? _a : exports.SchemaId.v2));
        if (errors.length > 0) {
            throw new SchemaValidationError("Invalid document", errors, document);
        }
        var digest = digestDocument(document);
        var signature = {
            type: "SHA3MerkleProof",
            targetHash: digest,
            proof: [],
            merkleRoot: digest,
        };
        return __assign$5(__assign$5({}, document), { signature: signature });
    };
    var wrapDocuments$2 = function (data, options) {
        // wrap documents individually
        var documents = data.map(function (d) { return wrapDocument$2(d, options); });
        // get all the target hashes to compute the merkle tree and the merkle root
        var merkleTree = new MerkleTree(documents.map(function (document) { return document.signature.targetHash; }).map(hashToBuffer));
        var merkleRoot = merkleTree.getRoot().toString("hex");
        // for each document, update the merkle root and add the proofs needed
        return documents.map(function (document) {
            var merkleProof = merkleTree
                .getProof(hashToBuffer(document.signature.targetHash))
                .map(function (buffer) { return buffer.toString("hex"); });
            return __assign$5(__assign$5({}, document), { signature: __assign$5(__assign$5({}, document.signature), { proof: merkleProof, merkleRoot: merkleRoot }) });
        });
    };

    exports.SUPPORTED_SIGNING_ALGORITHM = void 0;
    (function (SUPPORTED_SIGNING_ALGORITHM) {
        SUPPORTED_SIGNING_ALGORITHM["Secp256k1VerificationKey2018"] = "Secp256k1VerificationKey2018";
    })(exports.SUPPORTED_SIGNING_ALGORITHM || (exports.SUPPORTED_SIGNING_ALGORITHM = {}));
    var SigningKey = runtypes.Record({
        private: runtypes.String,
        public: runtypes.String,
    });

    var name = "Secp256k1VerificationKey2018";
    var sign$1 = function (message, keyOrSigner, options) {
        if (options === void 0) { options = {}; }
        var signer;
        if (SigningKey.guard(keyOrSigner)) {
            var wallet = new ethers.Wallet(keyOrSigner.private);
            if (!keyOrSigner.public.toLowerCase().includes(wallet.address.toLowerCase())) {
                throw new Error("Private key is wrong for " + keyOrSigner.public);
            }
            signer = wallet;
        }
        else {
            signer = keyOrSigner;
        }
        return signer.signMessage(options.signAsString ? message : ethers.utils.arrayify(message));
    };

    var defaultSigners = new Map();
    defaultSigners.set(name, sign$1);

    var signerBuilder = function (signers) { return function (alg, message, keyOrSigner, options) {
        var signer = signers.get(alg);
        if (!signer)
            throw new Error(alg + " is not supported as a signing algorithm");
        return signer(message, keyOrSigner, options);
    }; };
    var sign = signerBuilder(defaultSigners);

    var __assign$4 = (undefined && undefined.__assign) || function () {
        __assign$4 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$4.apply(this, arguments);
    };
    var __awaiter$4 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$4 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    };
    var signDocument$2 = function (document, algorithm, keyOrSigner) { return __awaiter$4(void 0, void 0, void 0, function () {
        var merkleRoot, signature, proof, _a, _b;
        var _c;
        return __generator$4(this, function (_d) {
            switch (_d.label) {
                case 0:
                    merkleRoot = "0x" + document.signature.merkleRoot;
                    return [4 /*yield*/, sign(algorithm, merkleRoot, keyOrSigner)];
                case 1:
                    signature = _d.sent();
                    _c = {
                        type: "OpenAttestationSignature2018",
                        created: new Date().toISOString(),
                        proofPurpose: "assertionMethod"
                    };
                    if (!SigningKey.guard(keyOrSigner)) return [3 /*break*/, 2];
                    _a = keyOrSigner.public;
                    return [3 /*break*/, 4];
                case 2:
                    _b = "did:ethr:";
                    return [4 /*yield*/, keyOrSigner.getAddress()];
                case 3:
                    _a = _b + (_d.sent()) + "#controller";
                    _d.label = 4;
                case 4:
                    proof = (_c.verificationMethod = _a,
                        _c.signature = signature,
                        _c);
                    return [2 /*return*/, __assign$4(__assign$4({}, document), { proof: isSignedWrappedV2Document(document) ? __spreadArray(__spreadArray([], document.proof), [proof]) : [proof] })];
            }
        });
    }); };

    var __awaiter$3 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$3 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var getId = function (objectOrString) {
        if (typeof objectOrString === "string") {
            return objectOrString;
        }
        return objectOrString.id;
    };
    /* Based on https://tools.ietf.org/html/rfc3339#section-5.6 */
    var dateFullYear = /[0-9]{4}/;
    var dateMonth = /(0[1-9]|1[0-2])/;
    var dateMDay = /([12]\d|0[1-9]|3[01])/;
    var timeHour = /([01][0-9]|2[0-3])/;
    var timeMinute = /[0-5][0-9]/;
    var timeSecond = /([0-5][0-9]|60)/;
    var timeSecFrac = /(\.[0-9]+)?/;
    var timeNumOffset = new RegExp("[-+]".concat(timeHour.source, ":").concat(timeMinute.source));
    var timeOffset = new RegExp("([zZ]|".concat(timeNumOffset.source, ")"));
    var partialTime = new RegExp("".concat(timeHour.source, ":").concat(timeMinute.source, ":").concat(timeSecond.source).concat(timeSecFrac.source));
    var fullDate = new RegExp("".concat(dateFullYear.source, "-").concat(dateMonth.source, "-").concat(dateMDay.source));
    var fullTime = new RegExp("".concat(partialTime.source).concat(timeOffset.source));
    var rfc3339 = new RegExp("".concat(fullDate.source, "[ tT]").concat(fullTime.source));
    var isValidRFC3339 = function (str) {
        return rfc3339.test(str);
    };
    /* Based on https://tools.ietf.org/html/rfc3986 and https://github.com/ajv-validator/ajv/search?q=uri&unscoped_q=uri */
    var uri = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    var rfc3986 = new RegExp(uri);
    var isValidRFC3986 = function (str) {
        return rfc3986.test(str);
    };
    var preloadedContextList = [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1",
        "https://schemata.openattestation.com/com/openattestation/1.0/DrivingLicenceCredential.json",
        "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
        "https://schemata.openattestation.com/com/openattestation/1.0/CustomContext.json",
    ];
    var contexts = new Map();
    var nodeDocumentLoader = jsonld.documentLoaders.xhr ? jsonld.documentLoaders.xhr() : jsonld.documentLoaders.node();
    var preload = true;
    var documentLoader = function (url) { return __awaiter$3(void 0, void 0, void 0, function () {
        var _i, preloadedContextList_1, url_1, promise, promise;
        var _a;
        return __generator$3(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (preload) {
                        preload = false;
                        for (_i = 0, preloadedContextList_1 = preloadedContextList; _i < preloadedContextList_1.length; _i++) {
                            url_1 = preloadedContextList_1[_i];
                            contexts.set(url_1, fetch__default['default'](url_1, { headers: { accept: "application/json" } }).then(function (res) { return res.json(); }));
                        }
                    }
                    if (!contexts.get(url)) return [3 /*break*/, 2];
                    promise = contexts.get(url);
                    _a = {
                        contextUrl: undefined
                    };
                    return [4 /*yield*/, promise];
                case 1: return [2 /*return*/, (_a.document = _b.sent(),
                        _a.documentUrl = url,
                        _a)];
                case 2:
                    promise = nodeDocumentLoader(url);
                    contexts.set(url, promise.then(function (_a) {
                        var document = _a.document;
                        return document;
                    }));
                    return [2 /*return*/, promise];
            }
        });
    }); };
    function validateW3C(credential) {
        return __awaiter$3(this, void 0, void 0, function () {
            var issuerId;
            return __generator$3(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // ensure first context is 'https://www.w3.org/2018/credentials/v1' as it's mandatory, see https://www.w3.org/TR/vc-data-model/#contexts
                        if (!Array.isArray(credential["@context"]) ||
                            (Array.isArray(credential["@context"]) && credential["@context"][0] !== "https://www.w3.org/2018/credentials/v1")) {
                            throw new Error("https://www.w3.org/2018/credentials/v1 needs to be first in the list of contexts");
                        }
                        issuerId = getId(credential.issuer);
                        if (!isValidRFC3986(issuerId)) {
                            throw new Error("Property 'issuer' id must be a valid RFC 3986 URI");
                        }
                        // ensure issuanceDate is a valid RFC3339 date, see https://www.w3.org/TR/vc-data-model/#issuance-date
                        if (!isValidRFC3339(credential.issuanceDate)) {
                            throw new Error("Property 'issuanceDate' must be a valid RFC 3339 date");
                        }
                        // ensure expirationDate is a valid RFC3339 date, see https://www.w3.org/TR/vc-data-model/#expiration
                        if (credential.expirationDate && !isValidRFC3339(credential.expirationDate)) {
                            throw new Error("Property 'expirationDate' must be a valid RFC 3339 date");
                        }
                        // https://www.w3.org/TR/vc-data-model/#types
                        if (!credential.type || !Array.isArray(credential.type)) {
                            throw new Error("Property 'type' must exist and be an array");
                        }
                        if (!credential.type.includes("VerifiableCredential")) {
                            throw new Error("Property 'type' must have VerifiableCredential as one of the items");
                        }
                        return [4 /*yield*/, jsonld.expand(credential, {
                                expansionMap: function (info) {
                                    if (info.unmappedProperty) {
                                        throw new Error("\"The property " + (info.activeProperty ? info.activeProperty + "." : "") + info.unmappedProperty + " in the input was not defined in the context\"");
                                    }
                                },
                                documentLoader: documentLoader,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }

    var __assign$3 = (undefined && undefined.__assign) || function () {
        __assign$3 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$3.apply(this, arguments);
    };
    var __awaiter$2 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$2 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var getExternalSchema = function (schema) { return (schema ? { schema: schema } : {}); };
    var wrapDocument$1 = function (credential, options) { return __awaiter$2(void 0, void 0, void 0, function () {
        var document, salts, digest, batchBuffers, merkleTree, merkleRoot, merkleProof, verifiableCredential, errors;
        return __generator$2(this, function (_a) {
            switch (_a.label) {
                case 0:
                    document = __assign$3(__assign$3({ version: exports.SchemaId.v3 }, getExternalSchema(options.externalSchemaId)), credential);
                    // To ensure that base @context exists, but this also means some of our validateW3C errors may be unreachable
                    if (!document["@context"]) {
                        document["@context"] = ["https://www.w3.org/2018/credentials/v1"];
                    }
                    // Since our wrapper adds in OA-specific properties, we should push our OA context. This is also to pass W3C VC test suite.
                    if (Array.isArray(document["@context"]) &&
                        !document["@context"].includes("https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json")) {
                        document["@context"].push("https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json");
                    }
                    salts = salt(document);
                    digest = digestCredential(document, salts, []);
                    batchBuffers = [digest].map(hashToBuffer);
                    merkleTree = new MerkleTree(batchBuffers);
                    merkleRoot = merkleTree.getRoot().toString("hex");
                    merkleProof = merkleTree.getProof(hashToBuffer(digest)).map(function (buffer) { return buffer.toString("hex"); });
                    verifiableCredential = __assign$3(__assign$3({}, document), { proof: {
                            type: "OpenAttestationMerkleProofSignature2018",
                            proofPurpose: "assertionMethod",
                            targetHash: digest,
                            proofs: merkleProof,
                            merkleRoot: merkleRoot,
                            salts: encodeSalt(salts),
                            privacy: {
                                obfuscated: [],
                            },
                        } });
                    errors = validateSchema$1(verifiableCredential, getSchema(exports.SchemaId.v3));
                    if (errors.length > 0) {
                        throw new SchemaValidationError("Invalid document", errors, verifiableCredential);
                    }
                    return [4 /*yield*/, validateW3C(verifiableCredential)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, verifiableCredential];
            }
        });
    }); };
    var wrapDocuments$1 = function (documents, options) { return __awaiter$2(void 0, void 0, void 0, function () {
        var verifiableCredentials, merkleTree, merkleRoot;
        return __generator$2(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(documents.map(function (document) { return wrapDocument$1(document, options); }))];
                case 1:
                    verifiableCredentials = _a.sent();
                    merkleTree = new MerkleTree(verifiableCredentials.map(function (verifiableCredential) { return verifiableCredential.proof.targetHash; }).map(hashToBuffer));
                    merkleRoot = merkleTree.getRoot().toString("hex");
                    // for each document, update the merkle root and add the proofs needed
                    return [2 /*return*/, verifiableCredentials.map(function (verifiableCredential) {
                            var digest = verifiableCredential.proof.targetHash;
                            var merkleProof = merkleTree.getProof(hashToBuffer(digest)).map(function (buffer) { return buffer.toString("hex"); });
                            return __assign$3(__assign$3({}, verifiableCredential), { proof: __assign$3(__assign$3({}, verifiableCredential.proof), { proofs: merkleProof, merkleRoot: merkleRoot }) });
                        })];
            }
        });
    }); };

    var __assign$2 = (undefined && undefined.__assign) || function () {
        __assign$2 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$2.apply(this, arguments);
    };
    var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$1 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var signDocument$1 = function (document, algorithm, keyOrSigner) { return __awaiter$1(void 0, void 0, void 0, function () {
        var merkleRoot, signature, proof, _a, _b, _c;
        var _d;
        return __generator$1(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (isSignedWrappedV3Document(document))
                        throw new Error("Document has been signed");
                    merkleRoot = "0x" + document.proof.merkleRoot;
                    return [4 /*yield*/, sign(algorithm, merkleRoot, keyOrSigner)];
                case 1:
                    signature = _e.sent();
                    _a = [__assign$2({}, document.proof)];
                    _d = {};
                    if (!SigningKey.guard(keyOrSigner)) return [3 /*break*/, 2];
                    _b = keyOrSigner.public;
                    return [3 /*break*/, 4];
                case 2:
                    _c = "did:ethr:";
                    return [4 /*yield*/, keyOrSigner.getAddress()];
                case 3:
                    _b = _c + (_e.sent()) + "#controller";
                    _e.label = 4;
                case 4:
                    proof = __assign$2.apply(void 0, _a.concat([(_d.key = _b, _d.signature = signature, _d)]));
                    return [2 /*return*/, __assign$2(__assign$2({}, document), { proof: proof })];
            }
        });
    }); };

    var __assign$1 = (undefined && undefined.__assign) || function () {
        __assign$1 = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign$1.apply(this, arguments);
    };
    var obfuscateData = function (_data, fields) {
        var data = lodash.cloneDeep(_data); // Prevents alteration of original data
        var fieldsToRemove = Array.isArray(fields) ? fields : [fields];
        // Obfuscate data by hashing them with the key
        var dataToObfuscate = flatten(lodash.pick(data, fieldsToRemove));
        var obfuscatedData = Object.keys(dataToObfuscate).map(function (k) {
            var obj = {};
            obj[k] = dataToObfuscate[k];
            return toBuffer(obj).toString("hex");
        });
        // Return remaining data
        fieldsToRemove.forEach(function (path) {
            lodash.unset(data, path);
        });
        return {
            data: data,
            obfuscatedData: obfuscatedData,
        };
    };
    // TODO the return type could be improve by using Exclude eventually to remove the obfuscated properties
    var obfuscateDocument = function (document, fields) {
        var _a, _b;
        var existingData = document.data;
        var _c = obfuscateData(existingData, fields), data = _c.data, obfuscatedData = _c.obfuscatedData;
        var currentObfuscatedData = (_b = (_a = document === null || document === void 0 ? void 0 : document.privacy) === null || _a === void 0 ? void 0 : _a.obfuscatedData) !== null && _b !== void 0 ? _b : [];
        var newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);
        return __assign$1(__assign$1({}, document), { data: data, privacy: __assign$1(__assign$1({}, document.privacy), { obfuscatedData: newObfuscatedData }) });
    };

    var __assign = (undefined && undefined.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    var obfuscate$1 = function (_data, fields) {
        var data = lodash.cloneDeep(_data); // Prevents alteration of original data
        var fieldsAsArray = [].concat(fields);
        // fields to remove will contain the list of each expanded keys from the fields passed in parameter, it's for instance useful in case of
        // object obfuscation, where the object itself is not part of the salts, but each individual keys are
        var fieldsToRemove = traverseAndFlatten(lodash.pick(data, fieldsAsArray), {
            iteratee: function (_a) {
                var path = _a.path;
                return path;
            },
        });
        var salts = decodeSalt(data.proof.salts);
        // Obfuscate data by hashing them with the key
        var obfuscatedData = fieldsToRemove.map(function (field) {
            var _a;
            var value = lodash.get(data, field);
            var salt = salts.find(function (s) { return s.path === field; });
            if (!salt) {
                throw new Error("Salt not found for " + field);
            }
            return toBuffer((_a = {}, _a[salt.path] = salt.value + ":" + value, _a)).toString("hex");
        });
        // remove fields from the object
        fieldsAsArray.forEach(function (field) { return lodash.unset(data, field); });
        data.proof.salts = encodeSalt(salts.filter(function (s) { return !fieldsToRemove.includes(s.path); }));
        return {
            data: data,
            obfuscatedData: obfuscatedData,
        };
    };
    var obfuscateVerifiableCredential = function (document, fields) {
        var _a = obfuscate$1(document, fields), data = _a.data, obfuscatedData = _a.obfuscatedData;
        var currentObfuscatedData = document.proof.privacy.obfuscated;
        var newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);
        return __assign(__assign({}, data), { proof: __assign(__assign({}, data.proof), { privacy: __assign(__assign({}, data.proof.privacy), { obfuscated: newObfuscatedData }) }) });
    };

    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    function __unsafe__use__it__at__your__own__risks__wrapDocument(data, options) {
        return wrapDocument$1(data, options !== null && options !== void 0 ? options : { version: exports.SchemaId.v3 });
    }
    function __unsafe__use__it__at__your__own__risks__wrapDocuments(dataArray, options) {
        return wrapDocuments$1(dataArray, options !== null && options !== void 0 ? options : { version: exports.SchemaId.v3 });
    }
    function wrapDocument(data, options) {
        return wrapDocument$2(data, { externalSchemaId: options === null || options === void 0 ? void 0 : options.externalSchemaId });
    }
    function wrapDocuments(dataArray, options) {
        return wrapDocuments$2(dataArray, { externalSchemaId: options === null || options === void 0 ? void 0 : options.externalSchemaId });
    }
    var validateSchema = function (document) {
        return validateSchema$1(document, getSchema("" + ((document === null || document === void 0 ? void 0 : document.version) || exports.SchemaId.v2))).length === 0;
    };
    function verifySignature(document) {
        return isWrappedV3Document(document) ? verify(document) : verify$1(document);
    }
    function obfuscate(document, fields) {
        return document.version === exports.SchemaId.v3
            ? obfuscateVerifiableCredential(document, fields)
            : obfuscateDocument(document, fields);
    }
    var isSchemaValidationError = function (error) {
        return !!error.validationErrors;
    };
    function signDocument(document, algorithm, keyOrSigner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // rj was worried it could happen deep in the code, so I moved it to the boundaries
                if (!SigningKey.guard(keyOrSigner) && !ethers.Signer.isSigner(keyOrSigner)) {
                    throw new Error("Either a keypair or ethers.js Signer must be provided");
                }
                switch (true) {
                    case isWrappedV2Document(document):
                        return [2 /*return*/, signDocument$2(document, algorithm, keyOrSigner)];
                    case isWrappedV3Document(document):
                        return [2 /*return*/, signDocument$1(document, algorithm, keyOrSigner)];
                    default:
                        // Unreachable code atm until utils.isWrappedV2Document & utils.isWrappedV3Document becomes more strict
                        throw new Error("Unsupported document type: Only OpenAttestation v2 & v3 documents can be signed");
                }
            });
        });
    }

    exports.MerkleTree = MerkleTree;
    exports.OpenAttestationHexString = OpenAttestationHexString;
    exports.ProofPurpose = ProofPurpose;
    exports.ProofType = ProofType$1;
    exports.SignatureAlgorithm = SignatureAlgorithm;
    exports.SigningKey = SigningKey;
    exports.__unsafe__use__it__at__your__own__risks__wrapDocument = __unsafe__use__it__at__your__own__risks__wrapDocument;
    exports.__unsafe__use__it__at__your__own__risks__wrapDocuments = __unsafe__use__it__at__your__own__risks__wrapDocuments;
    exports.checkProof = checkProof;
    exports.defaultSigners = defaultSigners;
    exports.digestCredential = digestCredential;
    exports.digestDocument = digestDocument;
    exports.getData = getData;
    exports.isSchemaValidationError = isSchemaValidationError;
    exports.obfuscate = obfuscate;
    exports.obfuscateDocument = obfuscate;
    exports.sign = sign;
    exports.signDocument = signDocument;
    exports.signerBuilder = signerBuilder;
    exports.utils = index;
    exports.v2 = types;
    exports.v3 = types$1;
    exports.validateSchema = validateSchema;
    exports.verifySignature = verifySignature;
    exports.wrapDocument = wrapDocument;
    exports.wrapDocuments = wrapDocuments;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
