# Networks and Addresses

Verax currently ships default SDK and explorer support for the following networks.

| Network          | Chain ID | Prefix   | Router                                       | AttestationRegistry                          | ModuleRegistry                               | PortalRegistry                               | SchemaRegistry                               | AttestationReader                            | Subgraph                           |
| ---------------- | -------- | -------- | -------------------------------------------- | -------------------------------------------- | -------------------------------------------- | -------------------------------------------- | -------------------------------------------- | -------------------------------------------- | ---------------------------------- |
| Linea Sepolia    | `59141`  | `0x0000` | `0xAfA952790492DDeB474012cEA12ba34B788ab39F` | `0xDaf3C3632327343f7df0Baad2dc9144fa4e1001F` | `0x3C443B9f0c8ed3A3270De7A4815487BA3223C2Fa` | `0xF35fe79104e157703dbCC3Baa72a81A99591744D` | `0x90b8542d7288a83EC887229A7C727989C3b56209` | Not deployed                                 | `verax-v2-linea-sepolia v0.0.3`    |
| Linea Mainnet    | `59144`  | `0x0000` | `0x4d3a380A03f3a18A5dC44b01119839D8674a552E` | `0x3de3893aa4Cdea029e84e75223a152FD08315138` | `0xf851513A732996F22542226341748f3C9978438f` | `0xd5d61e4ECDf6d46A63BfdC262af92544DFc19083` | `0x0f95dCec4c7a93F2637eb13b655F2223ea036B59` | `0x40871e247CF6b8fd8794c9c56bB5c2b8a4FA3B6c` | `verax-v2-linea v0.0.1`            |
| Arbitrum Sepolia | `421614` | `0x0001` | `0x374B686137eC0DB442a8d833451f8C12cD4B5De4` | `0xee5e23492bf49C1F4CF0676b3bF49d78A6dD61c5` | `0xEC572277d4E87a64DcfA774ED219Dd4E69E4BDc6` | `0x1ceb52584B6C45C7049dc7fDC476bC138E4beaDE` | `0x025531b655D9EE335B8E6cc4C118b313f26ACc8F` | Not deployed                                 | `verax-v2-arbitrum-sepolia v0.0.3` |
| Arbitrum Mainnet | `42161`  | `0x0001` | `0xa77196867bB03D04786EF636cDdD82f37A1248a9` | `0x335E9719e8eFE2a19A92E07BC4836160fC31cd7C` | `0x3acF4daAB6cbc01546Dd4a96c9665B398d48A4ba` | `0x4042D0A54f997EE3a1b0F51e4813654199BFd8bD` | `0xE96072F46EA0e42e538762dDc0aFa4ED8AE6Ec27` | `0x324C060A26444c3fB9B93e03d31e8cfF4b1715C1` | `verax-v2-arbitrum v0.0.2`         |
| Base Sepolia     | `84532`  | `0x0005` | `0xE235826514945186227918325D3E5b5f873861A6` | `0x374B686137eC0DB442a8d833451f8C12cD4B5De4` | `0xEC572277d4E87a64DcfA774ED219Dd4E69E4BDc6` | `0x025531b655D9EE335B8E6cc4C118b313f26ACc8F` | `0x66D2F3DCc970343b83a6263E20832184fa71CFe7` | `0xbCcC37Ea3bEeAE614817f53542F1F4FfAE5E19c7` | `verax-v2-base-sepolia v0.0.3`     |
| Base Mainnet     | `8453`   | `0x0005` | `0x63b2d528805Fc9373586366705852FA89debd4d0` | `0xA0080DBd35711faD39258E45d9A5D798852b05D4` | `0xAd0C12db58098A6665CBEf48f60eB67d81d1F1ff` | `0xcbf28432C25B400E645F0EaC05F8954e8EE7c0d6` | `0x8081dCd745f160c148Eb5be510F78628A0951c31` | `0xbEDd72a8cCfBEC4e575dCdC1659A891018051a5C` | `verax-v2-base v0.0.1`             |
| BSC Testnet      | `97`     | `0x0006` | `0x90b8542d7288a83EC887229A7C727989C3b56209` | `0x5Cc4029f0dDae1FFE527385459D06d81DFD50EEe` | `0x6c46c245918d4fcfC13F0a9e2e49d4E2739A353a` | `0xA4a7517F62216BD42e42a67dF09C25adc72A5897` | `0x51929da151eC2C5a5881C750E5b9941eACC46c1d` | Not deployed                                 | `verax-v2-bsc-testnet v0.0.2`      |
| BSC Mainnet      | `56`     | `0x0006` | `0x7a5C1fAC7fF9908a8b2ED479e060619213116A47` | `0x3D8A3a8FF21bD295dbBD5319C399e2C4FD27F261` | `0xD70a06f7A0f197D55Fa841fcF668782b2B8266eB` | `0xb2553A7E443DFA7C9dEc01D327FdDff1A5eF59b0` | `0x29205492435E1b06B20CeAeEC4AC41bcF595DFFd` | Not deployed                                 | `verax-v2-bsc v0.0.2`              |

## How to use this page

- For SDK integrations, use the matching `VeraxSdk.DEFAULT_*` configuration documented in
  [Using the SDK](using-the-sdk.md).
- For manual contract interaction, use the registry addresses above.
- For cross-chain lookups, use the subgraph names and URLs documented by the SDK defaults and subgraph package.

## Notes

- The chain prefix is injected by `AttestationRegistry` and is derived from `contracts/script/utils.ts`.
- `AttestationReader` is only deployed on chains where Verax currently maintains EAS-reading compatibility.
- Standard-library module addresses exist per network, but the primary addresses most integrators need are the registry
  and reader addresses above.
