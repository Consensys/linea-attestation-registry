# Verax Attestation Registry - Examples

This workspace contains example portals, modules, and tests that demonstrate how to build on top of the published Verax
contracts without modifying the core `contracts/` workspace.

It is a first-class package in the monorepo and has its own CI workflow in `contracts-examples.yml`.

## When to Use This Workspace

Use `examples/` when you want to:

- prototype or document a new portal or module pattern
- add a reference implementation that should not ship as core protocol code
- exercise integration behavior against the published contracts package

Use `contracts/` when the change belongs to the core Verax registries or deployment scripts.

## Local Setup

Prerequisites:

- Node.js and pnpm from the root `package.json`
- [Foundry](https://book.getfoundry.sh/getting-started/installation)

From the monorepo root:

```bash
pnpm install
```

## Common Commands

Run these commands from `examples/`.

| Command            | Purpose                                   |
| ------------------ | ----------------------------------------- |
| `pnpm run build`   | Build the example contracts               |
| `pnpm run compile` | Compile with Foundry                      |
| `pnpm run test`    | Run the example test suite                |
| `pnpm run lint`    | Run Solhint against the example contracts |

From the monorepo root, the equivalent commands are:

```bash
pnpm --filter @verax-attestation-registry/verax-examples build
pnpm --filter @verax-attestation-registry/verax-examples test
```

## Notes for Contributors

- This package depends on `@verax-attestation-registry/verax-contracts`, so core API changes often need matching updates
  here.
- If an example becomes the recommended public pattern, update the relevant contributor docs and published docs in the
  same PR.
