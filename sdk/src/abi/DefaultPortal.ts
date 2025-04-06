export const abiDefaultPortal = [
  {
    inputs: [
      {
        internalType: "address[]",
        name: "modules",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "router",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "OnlyPortalOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawFail",
    type: "error",
  },
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
    name: "ChainPrefixFormatInvalid",
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
    name: "RouterAddressInvalid",
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
    name: "OnlyAllowlisted",
    type: "error",
  },
  {
    inputs: [],
    name: "RouterAddressInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "AddressInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "IssuerAlreadySet",
    type: "error",
  },
  {
    inputs: [],
    name: "IssuerNotRegistered",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyAllowlisted",
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
    name: "RouterAddressInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "TestnetStatusAlreadyUpdated",
    type: "error",
  },
  {
    inputs: [],
    name: "IssuerInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyAllowlisted",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyAssignedIssuer",
    type: "error",
  },
  {
    inputs: [],
    name: "RouterAddressInvalid",
    type: "error",
  },
  {
    inputs: [],
    name: "SchemaAlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "SchemaContextAlreadyUpdated",
    type: "error",
  },
  {
    inputs: [],
    name: "SchemaIssuerAlreadySet",
    type: "error",
  },
  {
    inputs: [],
    name: "SchemaNameMissing",
    type: "error",
  },
  {
    inputs: [],
    name: "SchemaNotRegistered",
    type: "error",
  },
  {
    inputs: [],
    name: "SchemaStringMissing",
    type: "error",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "schemaId",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "expirationDate",
            type: "uint64",
          },
          {
            internalType: "bytes",
            name: "subject",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "attestationData",
            type: "bytes",
          },
        ],
        internalType: "struct AttestationPayload",
        name: "attestationPayload",
        type: "tuple",
      },
      {
        internalType: "bytes[]",
        name: "validationPayloads",
        type: "bytes[]",
      },
    ],
    name: "attest",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "attestationRegistry",
    outputs: [
      {
        internalType: "contract AttestationRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "schemaId",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "expirationDate",
            type: "uint64",
          },
          {
            internalType: "bytes",
            name: "subject",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "attestationData",
            type: "bytes",
          },
        ],
        internalType: "struct AttestationPayload[]",
        name: "attestationPayloads",
        type: "tuple[]",
      },
      {
        internalType: "bytes[][]",
        name: "validationPayloads",
        type: "bytes[][]",
      },
    ],
    name: "bulkAttest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "attestationIds",
        type: "bytes32[]",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "schemaId",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "expirationDate",
            type: "uint64",
          },
          {
            internalType: "bytes",
            name: "subject",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "attestationData",
            type: "bytes",
          },
        ],
        internalType: "struct AttestationPayload[]",
        name: "attestationsPayloads",
        type: "tuple[]",
      },
      {
        internalType: "bytes[][]",
        name: "validationPayloads",
        type: "bytes[][]",
      },
    ],
    name: "bulkReplace",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "attestationIds",
        type: "bytes32[]",
      },
    ],
    name: "bulkRevoke",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getModules",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "moduleRegistry",
    outputs: [
      {
        internalType: "contract ModuleRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "modules",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "portalRegistry",
    outputs: [
      {
        internalType: "contract PortalRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "attestationId",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "schemaId",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "expirationDate",
            type: "uint64",
          },
          {
            internalType: "bytes",
            name: "subject",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "attestationData",
            type: "bytes",
          },
        ],
        internalType: "struct AttestationPayload",
        name: "attestationPayload",
        type: "tuple",
      },
      {
        internalType: "bytes[]",
        name: "validationPayloads",
        type: "bytes[]",
      },
    ],
    name: "replace",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "attestationId",
        type: "bytes32",
      },
    ],
    name: "revoke",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "router",
    outputs: [
      {
        internalType: "contract IRouter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceID",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
