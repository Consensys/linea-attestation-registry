## Verax Attestation Registry

**Verax, previously known as "Linea Attestation Registry", is a set of contracts that allows anyone to read and write
attestations of any type and any subject.**

## Contracts addresses

### Testnet

- Router =
  [0x736c78b2f2cBf4F921E8551b2acB6A5Edc9177D5](https://goerli.lineascan.build/address/0x736c78b2f2cBf4F921E8551b2acB6A5Edc9177D5)
- AttestationRegistry =
  [0xC765F28096F6121C2F2b82D35A4346280164428b](https://goerli.lineascan.build/address/0xC765F28096F6121C2F2b82D35A4346280164428b)
- ModuleRegistry =
  [0x1a20b2CFA134686306436D2c9f778D7eC6c43A43](https://goerli.lineascan.build/address/0x1a20b2CFA134686306436D2c9f778D7eC6c43A43)
- PortalRegistry =
  [0x506f88a5Ca8D5F001f2909b029738A40042e42a6](https://goerli.lineascan.build/address/0x506f88a5Ca8D5F001f2909b029738A40042e42a6)
- SchemaRegistry =
  [0xB2c4Da1f8F08A0CA25862509E5431289BE2b598B](https://goerli.lineascan.build/address/0xB2c4Da1f8F08A0CA25862509E5431289BE2b598B)

### Mainnet

- Router =
  [0x4d3a380A03f3a18A5dC44b01119839D8674a552E](https://lineascan.build/address/0x4d3a380A03f3a18A5dC44b01119839D8674a552E)
- AttestationRegistry =
  [0x3de3893aa4Cdea029e84e75223a152FD08315138](https://lineascan.build/address/0x3de3893aa4Cdea029e84e75223a152FD08315138)
- ModuleRegistry =
  [0xf851513A732996F22542226341748f3C9978438f](https://lineascan.build/address/0xf851513A732996F22542226341748f3C9978438f)
- PortalRegistry =
  [0xd5d61e4ECDf6d46A63BfdC262af92544DFc19083](https://lineascan.build/address/0xd5d61e4ECDf6d46A63BfdC262af92544DFc19083)
- SchemaRegistry =
  [0x0f95dCec4c7a93F2637eb13b655F2223ea036B59](https://lineascan.build/address/0x0f95dCec4c7a93F2637eb13b655F2223ea036B59)

## Relationship schemas id's

### Testnet & Mainnet

- Relationship schema id = 0x89bd76e17fd84df8e1e448fa1b46dd8d97f7e8e806552b003f8386a5aebcb9f0
- namedGraphRelationship schema id = 0x5003a7832fa2734780a5bf6a1f3940b84c0c66a398e62dd4e7f183fdbc7da6ee

## Repository structure

```
.
├── contracts   # All smart contracts needed to run Verax
├── sdk         # The verax-sdk to easily interact with the contracts and the subgraph
├── subgraph    # The subgraph indexing Verax data
```

1. Contracts are documented [here](contracts/README.md)
2. SDK is documented [here](sdk/README.md)
3. Subgraph is documented [here](subgraph/README.md)
