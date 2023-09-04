## Verax (Linea Attestation Registry)

**Linea Attestation Registry is a set of contracts that allows anyone to read and write attestations of any type and any
subject.**

## Foundry Installation

**Using Foundryup**

Foundryup is the Foundry toolchain installer. Open your terminal and run the following command:

`curl -L https://foundry.paradigm.xyz | bash` This will install Foundryup, then simply follow the instructions
on-screen, which will make the foundryup command available in your CLI.

Running foundryup by itself will install the latest (nightly) precompiled binaries: forge, cast, anvil and chisel. See
foundryup --help for more options, like installing from a specific version or commit.

ℹ️ Note

If you're on Windows, you will need to install and use Git BASH or WSL, as your terminal, since Foundryup currently does
not support Powershell or Cmd.

For more details on installation, see the [installation guide](https://book.getfoundry.sh/getting-started/installation)
in the book.

If you're experiencing any issues while installing, check out the [FAQ](https://book.getfoundry.sh/faq).

## Forge - build and test

We can build the project with forge build:

```
$ forge build
[⠊] Compiling...
[⠘] Compiling 22 files with 0.8.20
[⠒] Solc 0.8.20 finished in 2.97s
Compiler run successful!
```

And run the tests with forge test:

```
$ forge test
No files changed, compilation skipped

Running 2 tests for test/Counter.t.sol:CounterTest
[PASS] testIncrement() (gas: 28334)
[PASS] testSetNumber(uint256) (runs: 256, μ: 27398, ~: 28409)
Test result: ok. 2 passed; 0 failed; 0 skipped; finished in 10.42ms
Ran 1 test suites: 2 tests passed, 0 failed, 0 skipped (2 total tests)
```

## Deployment - using Anvil

Anvil is a local testnet node shipped with Foundry. You can use it for testing your contracts from frontends or for
interacting over RPC. Anvil is part of the Foundry suite and is installed alongside forge, cast and chisel.

**Step 1 : Run a local node using Anvil**

To run a local node, simply type anvil. You should see a list of accounts and private keys available for use, as well as
the address and port the node is listening on.

```
$ anvil


                             _   _
                            (_) | |
      __ _   _ __   __   __  _  | |
     / _` | | '_ \  \ \ / / | | | |
    | (_| | | | | |  \ V /  | | | |
     \__,_| |_| |_|   \_/   |_| |_|

    0.1.0 (02e430c 2023-07-21T00:20:33.193960100Z)
    https://github.com/foundry-rs/foundry

Available Accounts
==================

(0) "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" (10000.000000000000000000 ETH)
(1) "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" (10000.000000000000000000 ETH)
(2) "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" (10000.000000000000000000 ETH)
(3) "0x90F79bf6EB2c4f870365E785982E1f101E93b906" (10000.000000000000000000 ETH)
(4) "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65" (10000.000000000000000000 ETH)
(5) "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc" (10000.000000000000000000 ETH)
(6) "0x976EA74026E726554dB657fA54763abd0C3a0aa9" (10000.000000000000000000 ETH)
(7) "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955" (10000.000000000000000000 ETH)
(8) "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f" (10000.000000000000000000 ETH)
(9) "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720" (10000.000000000000000000 ETH)

Private Keys
==================

(0) 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
(1) 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
(2) 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
(3) 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6
(4) 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a
(5) 0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba
(6) 0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e
(7) 0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356
(8) 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
(9) 0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6

Wallet
==================
Mnemonic:          test test test test test test test test test test test junk
Derivation path:   m/44'/60'/0'/0/


Chain ID
==================

31337
1000000000

Gas Limit
==================

30000000

Genesis Timestamp
==================

1689949885

Listening on 127.0.0.1:8545
```

Anvil is highly configurable. You can run anvil -h to see all the configuration options.

Some basic options are:

```
#  Number of dev accounts to generate and configure. [default: 10]
anvil -a, --accounts <ACCOUNTS>

# The EVM hardfork to use. [default: latest]
anvil --hardfork <HARDFORK>

# Port number to listen on. [default: 8545]
anvil  -p, --port <PORT>
```

**Step 2 : Deployment**

Forge can deploy smart contracts to a given network with the forge create command.

Forge can deploy only one contract at a time.

To deploy on Anvil local node use `forge create` command with RPC url and any private key provided by anvil local node
mentioned above.

e.g.

```
forge create --rpc-url http://127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 src/Counter.sol:Counter
[⠆] Compiling...
No files changed, compilation skipped
Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Transaction hash: 0x15b25752da1dfd458b92069248825ce959f5be104f974d62b4ae95050710325d
```

## Verax contracts deployment

### On the Linea Goerli testnet:

1. Copy the `.env.example` file to a `.env` file
2. Fill it with your Infura key
3. Add your private key
4. To verify the contracts on Etherscan, also add your Etherscan API key
5. Deploy every contract via the `pnpm run deploy:all:goerli` command
6. Note down the summarized addresses (proxies), and the total logs can be of interest too
7. Gather the first list of issuers addresses
8. Set the issuers via the PortalRegistry’s `setIssuers` method
9. Deploy an instance of DefaultPortal via the PortalRegistry’s `deployDefaultPortal` method and note down its address
10. Verify this contract via `npx hardhat verify --network linea-goerli ADDRESS`
11. _Optional_: Deploy some valid modules via the `pnpm run deploy:CorrectModule:goerli` command and note down their
    addresses
12. _Optional_: Deploy an invalid module via the `pnpm run deploy:IncorrectModule:goerli` command and note down its
    address

### On the Linea mainnet:

1. Copy the `.env.example` file to a `.env` file
2. Fill it with your Infura key
3. Add your private key
4. To verify the contracts on Etherscan, also add your Etherscan API key
5. Deploy every contract via the `pnpm run deploy:all` command
6. Note down the summarized addresses (proxies), and the total logs can be of interest too
7. Gather the first list of issuers addresses
8. Set the issuers via the PortalRegistry’s `setIssuers` method
9. Deploy an instance of DefaultPortal via the PortalRegistry’s `deployDefaultPortal` method and note down its address
10. Verify this contract via `npx hardhat verify --network linea ADDRESS`
11. _Optional_: Deploy some valid modules via the `pnpm run deploy:CorrectModule` command and note down their addresses
12. _Optional_: Deploy an invalid module via the `pnpm run deploy:IncorrectModule` command and note down its address

## Verax contract upgrade

### On the Linea Goerli testnet:

1. Check your `.env` file contains the address of the proxy for the contract you want to upgrade
2. Run `pnpm run upgrade:ContractName:goerli`, replacing `ContractName` with the contract you want to upgrade
3. Alternatively, you can upgrade all contracts at once via `pnpm run upgrade:all:goerli`

### On the Linea mainnet:

1. Check your `.env` file contains the address of the proxy for the contract you want to upgrade
2. Run `pnpm run upgrade:ContractName`, replacing `ContractName` with the contract you want to upgrade
3. Alternatively, you can upgrade all contracts at once via `pnpm run upgrade:all`

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
