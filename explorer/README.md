# Verax Attestation Registry - Explorer

This workspace owns the public explorer hosted at [explorer.ver.ax](https://explorer.ver.ax).

## Local Setup

From the monorepo root:

```bash
pnpm install
```

Inside `explorer/`, copy the example env file:

```bash
cp .env.example .env
```

Expected variables:

- `VITE_WALLETCONNECT_PROJECT_ID`
- `VITE_INFURA_API_KEY`
- `VITE_THE_GRAPH_API_KEY`

If `VITE_THE_GRAPH_API_KEY` is omitted, the explorer falls back to the SDK default Studio URLs instead of the gateway
overrides defined in `src/config/subgraphUrls.ts`.

## Common Commands

Run these commands from `explorer/`.

| Command                  | Purpose                                   |
| ------------------------ | ----------------------------------------- |
| `pnpm run dev`           | Start the local development server        |
| `pnpm run build`         | Type-check and build the app              |
| `pnpm run build:netlify` | Build the Netlify-ready production bundle |
| `pnpm run preview`       | Preview the production build locally      |
| `pnpm run lint`          | Run ESLint                                |

## Adding or Updating a Network

When the explorer needs to support a new Verax deployment, update the files that define network behavior, not just the
visual chain list.

Core surfaces:

- `src/config/index.tsx` for the chain entry, SDK defaults, RPC URL, and displayed metadata
- `src/config/subgraphUrls.ts` for The Graph gateway overrides
- `src/interfaces/config/index.ts` for `NetworkName`
- `src/utils/networkResolver.ts` and related helpers that map attestation ID prefixes and chain names
- `src/assets/networks/` for the network logo assets

Follow the existing patterns for mainnet/testnet naming so the explorer stays aligned with:

- the root `README.md` public matrix
- `sdk/src/VeraxSdk.ts`
- `contracts/script/utils.ts`

## CI and Deployments

The repo currently exposes two explorer deployment workflows:

- pull requests touching `explorer/` get a preview deploy through `explorer-deploy-preview.yml`
- maintainers can trigger production deployment through `explorer-deploy-prod.yml`

Both workflows build the explorer with the same `VITE_*` secrets used in production.
