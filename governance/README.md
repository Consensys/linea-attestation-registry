# Verax Voting NFT

This is simple SBT / non-transferable erc-721 NFT that is intended to infer voting rights to participants in Verax
governance.

This is a JavaScript HardHat project that uses OpenZeppellin contracts as a dependency.

## Usage

```
# 1. Set-up
npm install
cp .env.template .env  # and fill the document

# 2. Test
npx hardhat test

# 3. Deploy
npx hardhat run scripts/deploy.ts --network NETWORK_NAME
npx hardhat run scripts/deployProxy.ts --network NETWORK_NAME

# 4. Upgrade (if needed)
npx hardhat run scripts/upgrade.ts --network NETWORK_NAME

```
