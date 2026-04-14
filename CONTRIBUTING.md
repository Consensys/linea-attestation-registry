# Verax Attestation Registry - Contribution Guide

This guide is for contributors working in the public Verax monorepo. It focuses on the workflow that is observable from
the repository itself, and it calls out the maintainer/community conventions that live alongside that repo truth.

## Before You Start

- Contributions normally target the `dev` branch.
- Install dependencies from the monorepo root with `pnpm install`.
- CI reads Node.js and pnpm from the root `package.json`, so use the versions declared there.
- Foundry is required when working on `contracts/` or `examples/`.

If you are not sure where a change belongs, start from the root [README.md](README.md) and then jump to the relevant
workspace README.

## Repo-Observable Workflow

The repository currently exposes the following contributor-facing checks and automation:

- `lint.yml` runs ESLint and Prettier checks across the repo.
- `contracts.yml` builds, tests, measures coverage, and runs upgradeability checks for `contracts/`.
- `contracts-examples.yml` builds and tests `examples/`.
- `sdk.yml` runs unit and integration tests for `sdk/`.
- `subgraph.yml` builds and tests `subgraph/`.
- `explorer-build.yml` builds `explorer/`.
- `explorer-deploy-preview.yml` publishes a preview deployment for pull requests that touch `explorer/`.
- `releaser.yml` is a maintainer-only manual release flow.

Tutorial changes do not currently have a dedicated GitHub Actions workflow, so contributors should run its local
commands before opening a PR.

## Branches, Pull Requests, and Reviews

### Branches

The repo currently works with:

- `dev` for day-to-day integration work
- `main` for the stable release branch
- `release/*` branches, which are visible in workflow triggers

Common branch prefixes such as `feat/`, `fix/`, `chore/`, or `docs/` are useful conventions, but they are not enforced
by repository tooling.

### Pull requests

- Open pull requests against `dev` unless a maintainer asked for a different base.
- Use a clear PR title that identifies the area being changed, for example `contracts: ...`, `sdk: ...`, or `docs: ...`.
- Fill out the pull request template and link the related issue when one exists.
- Expect maintainers to review before merge. If the branch comes from a personal fork, GitHub Actions may require a
  maintainer to approve CI execution.

The repo does not currently expose a `CODEOWNERS` file, so keep review expectations phrased as maintainer process, not
as repo-enforced policy.

## Validation by Workspace

Run the relevant commands for the areas you changed.

| Workspace    | Typical commands from the repo root                                                                |
| ------------ | -------------------------------------------------------------------------------------------------- |
| `contracts/` | `pnpm --filter @verax-attestation-registry/verax-contracts build`, `test`, `check:implementations` |
| `examples/`  | `pnpm --filter @verax-attestation-registry/verax-examples build`, `test`                           |
| `sdk/`       | `pnpm --filter @verax-attestation-registry/verax-sdk test:unit`, `test:integration`                |
| `subgraph/`  | `pnpm --filter linea-attestation-registry-subgraph build:linea-sepolia`, `test`                    |
| `explorer/`  | `pnpm --filter verax-explorer lint`, `build`                                                       |
| `tutorial/`  | `pnpm --filter @verax-attestation-registry/verax-tutorial build`                                   |

If a change affects public behavior, deployment instructions, or contributor workflow, update the relevant README and
the GitBook source under `doc/` when needed.

## Documentation Changes

Repository contributor docs live in:

- the root `README.md`
- workspace READMEs such as `contracts/README.md` and `sdk/README.md`
- GitHub templates under `.github/`

Published user-facing docs live in `doc/`, inside the same monorepo. There is no separate documentation repository to
target for normal Verax docs updates.

Small typo-only changes are welcome, but if you are planning many tiny documentation edits across the repo, opening a
single issue first can help maintainers batch or coordinate them.

## Maintainer and Community Process

The following surfaces are part of the current collaboration model, even though they are not enforced by repo config:

- [GitHub Issues](https://github.com/Consensys/linea-attestation-registry/issues) for bugs, features, and improvements
- [GitHub Project Board](https://github.com/orgs/Consensys/projects/17/views/9) for maintainer planning and tracking
- [Discord](https://discord.gg/Sq4EmYdBEk) for day-to-day communication
- [Community Forum](https://community.ver.ax/) for larger discussions when maintainers want broader alignment

If you are proposing a large protocol, SDK, or deployment workflow change, starting with an issue or discussion helps
avoid duplicated work.

## Release Flow

The repository currently exposes a maintainer-only release flow through `releaser.yml` and `release.sh`:

1. check out `main`
2. merge `dev` into `main`
3. push `main`
4. check out `dev`
5. rebase `dev` onto `main`
6. push `dev`

That flow is a maintainer responsibility. Regular contributors should target `dev` and let maintainers handle the
release step.
