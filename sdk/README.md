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

## Other operations

[Work in progress] The class `veraxSdk.utils` extends the capabilities:

- precompute the ID of an Attestation
- precompute the ID of a Schema
- encode decode payload
