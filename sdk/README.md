# Verax Attestation Registry - SDK

This workspace owns the TypeScript SDK used to read and write Verax data from backends, frontends, scripts, and demo
apps.

This README is maintainer-oriented. For end-user integration guidance, see the published docs at
[docs.ver.ax](https://docs.ver.ax/verax-documentation/developer-guides/using-the-sdk).

## Local Setup

From the monorepo root:

```bash
pnpm install
```

Inside `sdk/`, copy the example env file when you want to run examples or integration tests:

```bash
cp .env.example .env
```

`PRIVATE_KEY` is used by example scripts and integration tests. `THE_GRAPH_API_KEY` is optional and helps when you want
to test against The Graph gateway instead of the public Studio endpoints.

## Common Commands

Run these commands from `sdk/`.

| Command                                                 | Purpose                                                      |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| `pnpm run build`                                        | Regenerate the Graph client and build the package            |
| `pnpm run generate`                                     | Regenerate the Graph client only                             |
| `pnpm run test:unit`                                    | Run unit tests                                               |
| `pnpm run test:integration`                             | Run integration tests                                        |
| `pnpm run test:ci`                                      | Copy `.env.example` to `.env` and run the default test suite |
| `pnpm run test:integration:ci`                          | Copy `.env.example` to `.env` and run integration tests      |
| `pnpm run schema` / `module` / `portal` / `attestation` | Run contributor example scripts under `examples/`            |
| `pnpm run publish:public`                               | Publish the package to npm                                   |

## SDK Defaults and Network Support

The built-in default configs currently live in:

- `src/VeraxSdk.ts`
- `src/types/index.ts` for `ChainName`
- `src/utils/urlResolver.ts` for multi-chain fallback URLs

When you add or update a supported network, keep **all three** in sync. In particular:

1. add the backend and frontend defaults in `src/VeraxSdk.ts`
2. add or update the matching `ChainName` entry in `src/types/index.ts`
3. update `src/utils/urlResolver.ts` so fallback URLs match the published deployment
4. update tests and any example scripts affected by the change
5. update the root `README.md` matrix if public endpoints or addresses changed

The root README and the SDK defaults should reflect the same public deployments.

## Custom Subgraph URLs

The SDK supports `subgraphUrlOverrides` for contributors or operators who want to test against custom gateway or Studio
endpoints.

Example:

```typescript
import { ChainName, VeraxSdk } from "@verax-attestation-registry/verax-sdk";

const sdk = new VeraxSdk({
  ...VeraxSdk.DEFAULT_LINEA_MAINNET,
  subgraphUrlOverrides: {
    [ChainName.LINEA_MAINNET]: "https://gateway.thegraph.com/api/YOUR_API_KEY/subgraphs/id/...",
    [ChainName.ARBITRUM_MAINNET]: "https://gateway.thegraph.com/api/YOUR_API_KEY/subgraphs/id/...",
  },
});
```

For contributors, the important part is that single-chain defaults, multi-chain fallbacks, and the published README
matrix all stay aligned when deployments change.

## Examples and CLI Surface

The package includes contributor utilities under `examples/` and a command reference in
[doc/cli-examples.md](./doc/cli-examples.md).

Those commands are useful for smoke testing SDK flows during development, but they are not a separately versioned public
CLI product.

## Publishing

The published package is
[`@verax-attestation-registry/verax-sdk`](https://www.npmjs.com/package/@verax-attestation-registry/verax-sdk).

Before publishing:

1. run the relevant tests
2. confirm generated artifacts are up to date
3. bump the package version in `package.json`
4. publish with:

```bash
pnpm run publish:public
```

## Contributor Checklist for New Chains

When a new Verax deployment is added:

- update `src/VeraxSdk.ts`
- update `src/types/index.ts`
- update `src/utils/urlResolver.ts`
- confirm explorer/demo apps still compile against the new SDK version
- update the root `README.md` public matrix
