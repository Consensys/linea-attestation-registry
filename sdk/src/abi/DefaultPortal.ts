export const abiDefaultPortal = [
  {
    inputs: [],
    name: "AlreadyRevoked",
    type: "error",
  },
  {
    inputs: [],
    name: "ArrayLengthMismatch",
    type: "error",
  },
  {
    inputs: [],
    name: "AttestationDataFieldEmpty",
    type: "error",
  },
  {
    inputs: [],
    name: "AttestationNotAttested",
    type: "error",
  },
  {
    inputs: [],
    name: "AttestationNotRevocable",
    type: "error",
  },
  {
    inputs: [],
    name: "AttestationSubjectFieldEmpty",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyAttestingPortal",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyPortal",
    type: "error",
  },
  {
    inputs: [],
    name: "RouterInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "SchemaNotRegistered",
    type: "error",
  },
  {
    inputs: [],
    name: "AttestationPayloadMissing",
    type: "error",
  },
  {
    inputs: [],
    name: "ModuleAddressInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "ModuleAlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "ModuleInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "ModuleNameMissing",
    type: "error",
  },
  {
    inputs: [],
    name: "ModuleNotRegistered",
    type: "error",
  },
  {
    inputs: [],
    name: "ModuleValidationPayloadMismatch",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyIssuer",
    type: "error",
  },
  {
    inputs: [],
    name: "PortalAddressInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "PortalAlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "PortalDescriptionMissing",
    type: "error",
  },
  {
    inputs: [],
    name: "PortalInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "PortalNameMissing",
    type: "error",
  },
  {
    inputs: [],
    name: "PortalNotRegistered",
    type: "error",
  },
  {
    inputs: [],
    name: "PortalOwnerNameMissing",
    type: "error",
  },
  {
    inputs: [],
    name: "SchemaAlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "SchemaNameMissing",
    type: "error",
  },
  {
    inputs: [],
    name: "SchemaStringMissing",
    type: "error",
  },
  {
    type: "function",
    name: "attest",
    inputs: [
      {
        name: "attestationPayload",
        type: "tuple",
        internalType: "struct AttestationPayload",
        components: [
          {
            name: "schemaId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "expirationDate",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "subject",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "attestationData",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
      {
        name: "validationPayloads",
        type: "bytes[]",
        internalType: "bytes[]",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "attestV2",
    inputs: [
      {
        name: "attestationPayload",
        type: "tuple",
        internalType: "struct AttestationPayload",
        components: [
          {
            name: "schemaId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "expirationDate",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "subject",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "attestationData",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
      {
        name: "validationPayloads",
        type: "bytes[]",
        internalType: "bytes[]",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "attestationRegistry",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract AttestationRegistry",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "bulkAttest",
    inputs: [
      {
        name: "attestationsPayloads",
        type: "tuple[]",
        internalType: "struct AttestationPayload[]",
        components: [
          {
            name: "schemaId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "expirationDate",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "subject",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "attestationData",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
      {
        name: "validationPayloads",
        type: "bytes[][]",
        internalType: "bytes[][]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "bulkAttestV2",
    inputs: [
      {
        name: "attestationPayloads",
        type: "tuple[]",
        internalType: "struct AttestationPayload[]",
        components: [
          {
            name: "schemaId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "expirationDate",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "subject",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "attestationData",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
      {
        name: "validationPayloads",
        type: "bytes[][]",
        internalType: "bytes[][]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "bulkReplace",
    inputs: [
      {
        name: "attestationIds",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
      {
        name: "attestationsPayloads",
        type: "tuple[]",
        internalType: "struct AttestationPayload[]",
        components: [
          {
            name: "schemaId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "expirationDate",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "subject",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "attestationData",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
      {
        name: "validationPayloads",
        type: "bytes[][]",
        internalType: "bytes[][]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "bulkReplaceV2",
    inputs: [
      {
        name: "attestationIds",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
      {
        name: "attestationsPayloads",
        type: "tuple[]",
        internalType: "struct AttestationPayload[]",
        components: [
          {
            name: "schemaId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "expirationDate",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "subject",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "attestationData",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
      {
        name: "validationPayloads",
        type: "bytes[][]",
        internalType: "bytes[][]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "bulkRevoke",
    inputs: [
      {
        name: "attestationIds",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAttester",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getModules",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "moduleRegistry",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract ModuleRegistry",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "modules",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "portalRegistry",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract PortalRegistry",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "replace",
    inputs: [
      {
        name: "attestationId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "attestationPayload",
        type: "tuple",
        internalType: "struct AttestationPayload",
        components: [
          {
            name: "schemaId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "expirationDate",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "subject",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "attestationData",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
      {
        name: "validationPayloads",
        type: "bytes[]",
        internalType: "bytes[]",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "replaceV2",
    inputs: [
      {
        name: "attestationId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "attestationPayload",
        type: "tuple",
        internalType: "struct AttestationPayload",
        components: [
          {
            name: "schemaId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "expirationDate",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "subject",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "attestationData",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
      {
        name: "validationPayloads",
        type: "bytes[]",
        internalType: "bytes[]",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "revoke",
    inputs: [
      {
        name: "attestationId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "router",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IRouter",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [
      {
        name: "interfaceID",
        type: "bytes4",
        internalType: "bytes4",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [
      {
        name: "to",
        type: "address",
        internalType: "address payable",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "error",
    name: "OnlyPortalOwner",
    inputs: [],
  },
];
