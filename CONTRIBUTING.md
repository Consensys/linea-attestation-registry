# Verax Attestation Registry - Contribution Guide

Verax Attestation Registry is a community-led initiative, with developers from various companies and different
backgrounds. While we are more than happy to get help from multiple sources, we need to rely on strong Ways of Working.

## Project Management

We use Notion for meeting minutes and other WIP documents such as the functional backlog.  
Task tracking is done through [GitHub issues](https://github.com/Consensys/linea-attestation-registry/issues) and
[GitHub Project](https://github.com/orgs/Consensys/projects/17/views/2).

_Contact us to get access_

## Issue Lifecycle

The lifecycle of an issue is as follows:

1. Draft
2. Next Milestone
3. Ready for development
4. In progress
5. Blocked
6. Peer-review
7. QA
8. Done
9. Released
10. Won’t do

## Meetings

- Core contributors meet on Monday, Wednesday and Friday for a **sync call**.
- **Technical Workshops** are held every Monday.
- **Functional Reviews** are held every Thursday.
- **Office Hours** are held every other Thursday.

## Branching Model

Our project follows the GitFlow branching model.  
Here's a brief overview of the branches we use:

- `main`: This branch contains the latest release of the project.
- `release/VERSION_NUMBER`: This branch contains code that has been validated by the QA process and is ready for
  release.
- `dev`: This branch contains the latest features that have been developed but not yet released.
- `feature/slug-name`: Each feature ticket has its own branch for development.
- `bugfix/slug-name`: Each bug ticket has its own branch for development.
- `chore/name`: Each task ticket has its own branch for development.

When creating a pull request, please follow the same naming pattern as branch naming: `feat: Title of the ticket`.  
All commits of a PR are squashed and branches are deleted after merging.  
Merging requires at least one peer-review from the code owners, but two are encouraged.  
You cannot validate your own PR.  
Rebasing is strongly encouraged.  
Personal forks are allowed, but CI tests must pass before merging.

## Development

Our code repository is hosted on GitHub.  
We use the Foundry framework for Solidity development.  
The project includes linters/formatters (prettier + eslint + solhint).  
Continuous Integration and Continuous Deployment are handled via GitHub Actions.  
The CI process includes Lint, Compile, Unit tests, and Coverage checks.  
The CD process is still being defined.

## Communication

All project communication is done through Discord.  
This includes general discussions, updates and decision-making.  
Please ensure you have joined our Discord server to stay updated and participate in the project discussions.

## Bugs

If you encounter a bug, please report it through GitHub issues. When reporting a bug, please provide a clear description
of the issue, steps to reproduce it, and if possible, a proposed solution or fix.  
This will help us address the issue more effectively.

Please use the `bugfix/slug-name` branch for developing bug fixes.
