# Verax Attestation Registry - Tutorial

This workspace is the demo/tutorial app for building with the Verax SDK. It is published at
[tutorial.examples.ver.ax](https://tutorial.examples.ver.ax).

The tutorial is part of the public monorepo and should be updated when the recommended SDK integration flow changes in a
way that affects the demo experience.

## Local Setup

From the monorepo root:

```bash
pnpm install
```

Inside `tutorial/`, copy the example env file:

```bash
cp .env.example .env
```

Expected variables:

- `VITE_WALLETCONNECT_PROJECT_ID`
- `VITE_INFURA_API_KEY`

## Common Commands

Run these commands from `tutorial/`.

| Command            | Purpose                                    |
| ------------------ | ------------------------------------------ |
| `pnpm run dev`     | Start the tutorial app in development mode |
| `pnpm run build`   | Build the production bundle                |
| `pnpm run preview` | Preview the production bundle locally      |

From the monorepo root, the equivalent commands are:

```bash
pnpm --filter @verax-attestation-registry/verax-tutorial dev
pnpm --filter @verax-attestation-registry/verax-tutorial build
```

## Notes for Contributors

- This workspace is a demo application, not the source of truth for protocol or SDK behavior.
- There is no dedicated GitHub Actions workflow for `tutorial/` today, so contributors should run local build checks
  before opening a PR.
