# Verax Voting NFT

This is simple SBT / non-transferable erc-721 NFT that is intended to infer voting rights to participants in Verax
governance.

This is a JavaScript HardHat project that uses OpenZeppellin contracts as a dependency.

The following tasks are valid:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts

npx hardhat run scripts/deployProxy.ts --network arbitrum_one
npx hardhat verify --network arbitrum_one [PROXY_ADDRESS]
npx hardhat run scripts/upgrade.ts --network arbitrum_one
```
