# Verax Attestation Registry - Contribution Guide

Welcome to the Verax Attestation Registry! 🚀  
We’re a **community-led initiative**, and we’re thrilled to have developers from diverse companies and backgrounds
contributing to this project. To make collaboration smooth and effective, we’ve set up a few guidelines and best
practices. Let’s dive in!

### Guidelines for Non-Code and other Trivial Contributions

Please keep in mind that we do not accept non-code contributions like fixing comments, typos or some other trivial
fixes. Although we appreciate the extra help, managing lots of these small contributions is unfeasible, and puts extra
pressure in our continuous delivery systems (running all tests, etc). Feel free to open an issue pointing to any of
those errors, and we will batch them into a single change.

---

## 🛠️ **Project Management**

We keep track of tasks and progress using:

- **[GitHub Issues](https://github.com/Consensys/linea-attestation-registry/issues)**: For bugs, features, and
  improvements.
- **[GitHub Project Board](https://github.com/orgs/Consensys/projects/17/views/9)**: For an overview of ongoing work and
  priorities.

---

## 🔄 **Issue Lifecycle**

Here’s the journey an issue takes:

1. **Draft**: The idea is logged and under discussion.
2. **Ready for Development**: Approved and ready for action.
3. **In Progress**: Actively being worked on.
4. **Peer Review**: Code submitted and under review.
5. **Done**: Merged and considered complete.
6. **Released**: Deployed and available to users.

---

## 🌳 **Branching Model**

We follow a **GitFlow branching model** to keep everything clean and organized.

### Key Branches:

- **`main`**: The latest stable release.
- **`release/VERSION_NUMBER`**: Code validated and ready for release.
- **`dev`**: The integration branch for the latest features under development.
- **`feat/slug-name`**: A branch for each new feature.
- **`fix/slug-name`**: A branch for bug fixes.
- **`chore/name`**: A branch for tasks like dependency updates.

### Pull Requests:

- Name your PR following the branch pattern: `feat(component-name): Title of the ticket`.
- **Squash commits**: All commits in a PR are squashed into one before merging.
- **Approval required**: At least one code owner must approve the PR (two are encouraged).
- **No self-validation**: You cannot approve your own PR.
- **Rebase encouraged**: Keep your branch up-to-date by rebasing it onto `dev`.

CI tests must pass before merging. If you’re using a personal fork, CI will need approval from a code owner to run.

---

## 🔧 **Development**

We use the **Foundry framework** for Solidity development and follow these practices:

- **Linters/Formatters**: Prettier, ESLint, and Solhint.
- **Continuous Integration**: Managed with GitHub Actions, running linting, compilation, unit tests, and coverage
  checks.

---

## 🛠️ **Bugs**

Encountered a bug? Here’s what to do:

1. Open an issue on [GitHub](https://github.com/Consensys/linea-attestation-registry/issues).
2. Provide:

- A clear description of the problem.
- Steps to reproduce it.
- (Optional) Your proposed solution.

For fixes, create a `fix/slug-name` branch and submit a PR when ready.

---

## 📚 **Documentation**

Clear documentation helps everyone. If you see gaps or have ideas for improvements:

- **Request a new topic**: Open an issue.
- **Write it yourself**: Open a PR in the documentation repository.
- **Draft it elsewhere**: Use tools like Notion or Google Docs and share the link—we’ll handle the rest!

---

## 🚀 **Getting Started**

Not sure where to start? Check out our
[Good First Issues](https://github.com/Consensys/linea-attestation-registry/issues?q=is%3Aopen+is%3Aissue+label%3A%22Good+first+issue%22).
These are beginner-friendly tasks with clear descriptions.\*\*

Need help? Ping us on **[Discord](https://discord.gg/Sq4EmYdBEk)**. We’re here to guide you.

---

## 💬 **Communication**

All project communication happens on **[Discord](https://discord.gg/Sq4EmYdBEk)**.  
For complex changes or features, start a discussion on the **[Community Forum](https://community.ver.ax/)**. Once agreed
upon, contributors can vote before development begins.

---

We’re excited to have you on board. Let’s build something amazing together!
