# Verax Attestation Registry - SDK

The `verax-sdk` facilitates the interactions with the contracts and the subgraph, both from a frontend and a backend.

[DRAFT]

## Installation

VeraxSDK is a [npm package](https://www.npmjs.com/package/verax-sdk/).

```bash
# npm
npm install --save verax-sdk
```

```bash
# yarn
yarn add verax-sdk
```

## Getting Started

### 1. Import VeraxSdk

```js
// CommonJS
var VeraxSdk = require("verax-sdk");
```

```js
// ES6
import VeraxSdk from "verax-sdk";
```

### 2. Instantiate VeraxSdk

```js
// Default configuration for Linea Testnet
const veraxSdk = new VeraxSdk(VeraxSdk.LineaConfTestnet);
```

or,

```js
// Default configuration for Linea Mainnet
const veraxSdk = new VeraxSdk(VeraxSdk.LineaConfMainnet);
```

or,

```js
// Custom configuration
const myVeraxConfiguration = {
  rpcUrl: "https://my.rpc.url",
  chain: 12345,
  subgraphUrl: "https://my.subgraph.url",
  portalRegistryAddress: "0xMyPortalRegistryAddress",
  moduleRegistryAddress: "0xMyModuleRegistryAddress",
  schemaRegistryAddress: "0xMySchemaRegistryAddress",
  attestationRegistryAddress: "0xMyAttestationRegistryAddress",
};
const veraxSdk = new VeraxSdk(myVeraxConfiguration);
```

## Read and write objects

### 1. Get DataMappers

```js
// Each Verax classes has its DataMapper
// Get them from the SDK instance
const portalDataMapper = veraxSdk.portalDataMapper; // RW Portals
const schemaDataMapper = veraxSdk.schemaDataMapper; // RW Schemas
const moduleDataMapper = veraxSdk.moduleDataMapper; // RW Modules
const attestationDataMapper = veraxSdk.attestationDataMapper; // RW Attestations
```

### 2. Read content (one object)

Each DataMapper comes with the method `findOneById` to get one object by ID.

```js
const myAttestation = await attestationDataMapper.findOneById("12345");
console.log(myAttestation);

//
// id: "12345"
// schemaId: "99AE34"
// portalId: "37773"
// data: decoded payload {...}
// ...
```

### 3. Read content (list / many objects)

Each DataMapper comes with the method `findBy` to get objects by criteria.

```js
//
// args:
// 	- criteria: object {property1: value1, property2: value2, ...}
// 	- page: integer (optional, default 0)
// 	- offset: integer (optional, default 50, max= 500)
// 	- orderBy: string (optional, default createdAt)
// 	- order(property?): enum string "ASC", "DESC" (optional, default "DESC")
//
const myAttestations = await attestationDataMapper.findBy(
  { portalId: "37773", subject: "John" },
  4,
  30,
  "schemaId",
  "ASC",
);

console.log(myAttestations);
//
// totalNumber: 147,
// page: 0,
// objects: [
// 	{id: "12345", schemaId: "99AE34", portalId: "37773", subject: "Florian", ...},
// 	{id: "2221E", schemaId: "AAF77E", portalId: "37773", subject: "Florian", ...},
// 	...
// ]
//
```

### 4. Write content

[WORK IN PROGRESS] Each dataMapper comes with write methods, that may vary depending on the class. See the detail of
write method per class dataMapper.

```js
const result = await attestationDataMapper.attest(
  {
    schemaId: "muhpoih",
    portalId: "OJOJ43432",
    expirationDate: null,
    subject: "florian.demiramon@...",
    data: {
      foo: "bar",
      zee: "plop",
    },
  },
  signer,
);

console.log(result);
//
// txReceipt: ....
// object: {
//		{
//		id: "0XAZFZF"
//		schemaId: "muhpoih"
//		portalId: "OJOJ43432"
//		expirationDate: null
//		subject: "florian.demiramon@..."
//		attestationData: {
//				foo: "bar",
//				zee: "plop"
//			}
//		attestationRawData: "1234234124124FAAZC"
//		replacedBy: null
//		attester: "0x1111"
//		attestedDate: "today"
//		revocationDate: null
//		version: 1
//		revoked: false
//		}
//
```

## Console commands

You can run console commands to execute SDK methods. Below are examples to how to execute commands.

Note : While executing the commands if parameters are not sent e.g pnpm module findby, then default values will be used.

### Portal commands

```
pnpm portal findby '{\"ownerName\": \"Satya\"}'

pnpm portal findonebyid '0x34798a866f52949208e67fb57ad36244024c50c0'

pnpm portal simulateattest '{\"portalAddress\": \"0x34798a866f52949208e67fb57ad36244024c50c0\", \"attestationPayload\" : { \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": \"1693583329\", \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": \"true\" }]}, \"validationPayloads\": []}'

pnpm portal attest '{\"portalAddress\": \"0x34798a866f52949208e67fb57ad36244024c50c0\", \"attestationPayload\" : { \"schemaId\": \"0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738\", \"expirationDate\": \"1693583329\", \"subject\": \"0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47\", \"attestationData\": [{ \"isBuidler\": \"true\" }]}, \"validationPayloads\": []}'

pnpm portal simulaterevoke '{\"portalAddress\": \"0x34798a866f52949208e67fb57ad36244024c50c0\", \"attestationId\" : \"0x000000000000000000000000000000000000000000000000000000000000109b\" }'

pnpm portal revoke '{\"portalAddress\": \"0x34798a866f52949208e67fb57ad36244024c50c0\", \"attestationId\" : \"0x000000000000000000000000000000000000000000000000000000000000109b\" }'
```

### Attestation commands

```
pnpm attestation findonebyid "0x000000000000000000000000000000000000000000000000000000000000109b"

pnpm attestation findby '{\"portal\": \"0x34798a866f52949208e67fb57ad36244024c50c0\"}'

pnpm attestation getRelatedAttestations "0x000000000000000000000000000000000000000000000000000000000000109b"
```

### Module commands

```
pnpm module findonebyid "0x4bb8769e18f1518c35be8405d43d7cc07ecf501c"

pnpm module findby '{\"name\": \"Msg Sender Module\"}'
```

### Schema commands

```
pnpm schema findonebyid "0xce2647ed39aa89e6d1528a56deb6c30667ed2aae1ec2378ec3140c0c5d98a61e"

pnpm schema findby '{\"description\": \"Gitcoin Passport Score\"}'
```

## Other operations

[Work in progress] The class `veraxSdk.utils` extends the capabilities:

- precompute the ID of an Attestation
- precompute the ID of a Schema
- encode decode payload
