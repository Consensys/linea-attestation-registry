# 🛠️ Using the SDK

## Installation

VeraxSDK is a [npm package](https://www.npmjs.com/package/verax-sdk/).

```
# npm
npm i --save @verax-attestation-registry/verax-sdk
```

```
# yarn
yarn add @verax-attestation-registry/verax-sdk
```

---

## Getting Started <a href="#user-content-getting-started" id="user-content-getting-started"></a>

### 1. Import VeraxSdk <a href="#user-content-1-import-veraxsdk" id="user-content-1-import-veraxsdk"></a>

```
// CommonJS
var VeraxSdk = require("@verax-attestation-registry/verax-sdk");
```

```
// ES6
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
```

### 2. Instantiate VeraxSdk <a href="#user-content-2-instantiate-veraxsdk" id="user-content-2-instantiate-veraxsdk"></a>

<pre class="language-javascript"><code class="lang-javascript">// Default configuration for Linea Sepolia

// Frontend
const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_SEPOLIA_FRONTEND);
// Backend
<strong>const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_SEPOLIA);
</strong></code></pre>

Or:

```javascript
// Default configuration for Linea Mainnet
// Frontend
const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_MAINNET_FRONTEND);
// Backend
const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_MAINNET);
```

Or:

```javascript
// Custom configuration

import { optimism } from "viem/chains";

const myVeraxConfiguration = {
  chain: optimism,
  mode: SDKMode.BACKEND,
  subgraphUrl: "https://my.subgraph.url",
  portalRegistryAddress: "0xMyPortalRegistryAddress",
  moduleRegistryAddress: "0xMyModuleRegistryAddress",
  schemaRegistryAddress: "0xMySchemaRegistryAddress",
  attestationRegistryAddress: "0xMyAttestationRegistryAddress",
};

const veraxSdk = new VeraxSdk(myVeraxConfiguration);
```

---

## Read and write objects <a href="#user-content-read-and-write-objects" id="user-content-read-and-write-objects"></a>

### 1. Get DataMappers <a href="#user-content-1-get-datamappers" id="user-content-1-get-datamappers"></a>

```javascript
// Each Verax class has its corresponding DataMapper
// Get them from the SDK instance
const portalDataMapper = veraxSdk.portal; // RW Portals
const schemaDataMapper = veraxSdk.schema; // RW Schemas
const moduleDataMapper = veraxSdk.module; // RW Modules
const attestationDataMapper = veraxSdk.attestation; // RW Attestations
const utilsDataMapper = veraxSdk.utils; // Utils
```

### 2. Read content (one object) <a href="#user-content-2-read-content-one-object" id="user-content-2-read-content-one-object"></a>

Each DataMapper comes with the method `findOneById` to get one object by ID.

{% code fullWidth="true" %}

```javascript
const myPortal = await portalDataMapper.findOneById("0x34798a866f52949208e67fb57ad36244024c50c0");

const mySchema = await schemaDataMapper.findOneById(
  "0xce2647ed39aa89e6d1528a56deb6c30667ed2aae1ec2378ec3140c0c5d98a61e",
);

const myModule = await moduleDataMapper.findOneById("0x4bb8769e18f1518c35be8405d43d7cc07ecf501c");

const mySchema = await schemaDataMapper.findOneById(
  "0xce2647ed39aa89e6d1528a56deb6c30667ed2aae1ec2378ec3140c0c5d98a61e",
);

const myAttestation = await attestationDataMapper.findOneById(
  "0x000000000000000000000000000000000000000000000000000000000000109b",
);
```

{% endcode %}

### 3. Read content (list / many objects) <a href="#user-content-3-read-content-list--many-objects" id="user-content-3-read-content-list--many-objects"></a>

Each DataMapper comes with the method `findBy` to get objects by criteria. Each DataMapper comes with the method
`findBy` to get objects by criteria.

{% code fullWidth="true" %}

```javascript
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

{% endcode %}

### 4. Write content <a href="#user-content-4-write-content" id="user-content-4-write-content"></a>

Each dataMapper comes with methods to write data that may vary depending on the class. See the detail of write method
per class dataMapper.

{% code fullWidth="true" %}

```javascript
const portalAddress = "0xeea25bc2ec56cae601df33b8fc676673285e12cc";
const attestationPayload = {
  schemaId: "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738",
  expirationDate: 1693583329,
  subject: "0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47",
  attestationData: [{ isBuidler: true }],
};
const validationPayloads = [];
const newAttestation = await this.veraxSdk.portal.attest(portalAddress, attestationPayload, validationPayloads);
```

{% endcode %}

---

## Other operations <a href="#user-content-other-operations" id="user-content-other-operations"></a>

\[Work in progress] The class `veraxSdk.utils` extends the capabilities:

- precompute the ID of an attestation
- encode decode payload
