export const attestationRegistry = {
  address: "0xC765F28096F6121C2F2b82D35A4346280164428b",
  abi: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
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
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "attestationId",
          type: "bytes32",
        },
      ],
      name: "AttestationRegistered",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bytes32",
          name: "attestationId",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "bytes32",
          name: "replacedBy",
          type: "bytes32",
        },
      ],
      name: "AttestationReplaced",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bytes32",
          name: "attestationId",
          type: "bytes32",
        },
      ],
      name: "AttestationRevoked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint8",
          name: "version",
          type: "uint8",
        },
      ],
      name: "Initialized",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint16",
          name: "version",
          type: "uint16",
        },
      ],
      name: "VersionUpdated",
      type: "event",
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
          internalType: "address",
          name: "attester",
          type: "address",
        },
      ],
      name: "attest",
      outputs: [],
      stateMutability: "nonpayable",
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
          name: "attestationsPayloads",
          type: "tuple[]",
        },
        {
          internalType: "address",
          name: "attester",
          type: "address",
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
          name: "attestationPayloads",
          type: "tuple[]",
        },
        {
          internalType: "address",
          name: "attester",
          type: "address",
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
      inputs: [
        {
          internalType: "bytes32",
          name: "attestationId",
          type: "bytes32",
        },
      ],
      name: "getAttestation",
      outputs: [
        {
          components: [
            {
              internalType: "bytes32",
              name: "attestationId",
              type: "bytes32",
            },
            {
              internalType: "bytes32",
              name: "schemaId",
              type: "bytes32",
            },
            {
              internalType: "bytes32",
              name: "replacedBy",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "attester",
              type: "address",
            },
            {
              internalType: "address",
              name: "portal",
              type: "address",
            },
            {
              internalType: "uint64",
              name: "attestedDate",
              type: "uint64",
            },
            {
              internalType: "uint64",
              name: "expirationDate",
              type: "uint64",
            },
            {
              internalType: "uint64",
              name: "revocationDate",
              type: "uint64",
            },
            {
              internalType: "uint16",
              name: "version",
              type: "uint16",
            },
            {
              internalType: "bool",
              name: "revoked",
              type: "bool",
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
          internalType: "struct Attestation",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAttestationIdCounter",
      outputs: [
        {
          internalType: "uint32",
          name: "",
          type: "uint32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getVersionNumber",
      outputs: [
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "incrementVersionNumber",
      outputs: [
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
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
      name: "isRegistered",
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
          internalType: "address",
          name: "portalId",
          type: "address",
        },
      ],
      name: "isRevocable",
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
          internalType: "address",
          name: "portal",
          type: "address",
        },
      ],
      name: "massImport",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
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
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
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
          internalType: "address",
          name: "attester",
          type: "address",
        },
      ],
      name: "replace",
      outputs: [],
      stateMutability: "nonpayable",
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
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_router",
          type: "address",
        },
      ],
      name: "updateRouter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
} as const;
