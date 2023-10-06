export const abiModuleRegistry = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
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
    name: "RouterInvalid",
    type: "error",
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
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "moduleAddress",
        type: "address",
      },
    ],
    name: "ModuleRegistered",
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
    inputs: [
      {
        internalType: "address[]",
        name: "modulesAddresses",
        type: "address[]",
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
    name: "bulkRunModules",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getModulesNumber",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
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
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
    ],
    name: "isContractAddress",
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
        name: "moduleAddress",
        type: "address",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "moduleAddresses",
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
    inputs: [
      {
        internalType: "address",
        name: "id",
        type: "address",
      },
    ],
    name: "modules",
    outputs: [
      {
        internalType: "address",
        name: "moduleAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    stateMutability: "view",
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
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "address",
        name: "moduleAddress",
        type: "address",
      },
    ],
    name: "register",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "address[]",
        name: "modulesAddresses",
        type: "address[]",
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
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "runModules",
    outputs: [],
    stateMutability: "nonpayable",
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
];
