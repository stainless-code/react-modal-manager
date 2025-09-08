# Contributing to @stainless-code/react-modal-manager

Thank you for your interest in contributing to **@stainless-code/react-modal-manager**! Your contributions are greatly appreciated, whether it's fixing a bug, adding a feature, improving documentation, or providing feedback.

## Table of Contents

- [Contributing to @stainless-code/react-modal-manager](#contributing-to-stainless-codereact-modal-manager)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Development Workflow](#development-workflow)
    - [Build the project](#build-the-project)
    - [Start development mode](#start-development-mode)
  - [Scripts Overview](#scripts-overview)
  - [Testing](#testing)
  - [Code Style](#code-style)
  - [Submitting a Pull Request](#submitting-a-pull-request)
  - [Thank You!](#thank-you)

---

## Getting Started

1. Fork the repository on GitHub:
   [https://github.com/stainless-code/react-modal-manager](https://github.com/stainless-code/react-modal-manager)

2. Clone your fork locally:

   ```bash
   git clone https://github.com/<your-username>/react-modal-manager.git
   cd react-modal-manager
   ```

3. Install dependencies:

   ```bash
   bun install
   ```

   Make sure you have [Bun](https://bun.sh/) installed, or use an alternative package manager (`npm`, `yarn`, or `pnpm`).

---

## Development Workflow

### Build the project

Run the build process to compile the library:

```bash
bun run build
```

This will generate the compiled output in the `dist` directory.

### Start development mode

To watch for changes and rebuild automatically during development:

```bash
bun run dev
```

---

## Scripts Overview

The following scripts are available in the `package.json` file:

| Script         | Command                    | Description                                     |
| -------------- | -------------------------- | ----------------------------------------------- |
| `build`        | `tsup`                     | Builds the project.                             |
| `clean`        | `rimraf dist node_modules` | Cleans the output and dependencies.             |
| `dev`          | `tsup --watch`             | Starts a development build watcher.             |
| `format`       | `prettier . --write`       | Formats code using Prettier.                    |
| `format:check` | `prettier . --check`       | Checks code formatting without modifying files. |
| `lint`         | `eslint .`                 | Lints the project for code quality.             |
| `lint:fix`     | `eslint . --fix`           | Fixes linting issues automatically.             |
| `test`         | `vitest run`               | Runs all tests using Vitest.                    |
| `typecheck`    | `tsc`                      | Verifies TypeScript type definitions.           |
| `release`      | `changeset publish`        | Publishes a new release.                        |
| `version`      | `changeset version`        | Prepares a version update with Changesets.      |

---

## Testing

We use [Vitest](https://vitest.dev/) for testing. To run the tests:

```bash
bun run test
```

To run tests in watch mode:

```bash
bun run test -- --watch
```

Please ensure all tests pass before submitting a pull request.

---

## Code Style

We follow strict coding standards enforced by Prettier and ESLint.

- Run `bun run lint` to check for linting issues.
- Run `bun run lint:fix` to automatically fix issues.
- Run `bun run format` to format the codebase.

Before submitting your changes, ensure your code passes linting and formatting checks.

---

## Submitting a Pull Request

1. Create a feature branch:

   ```bash
   git checkout -b my-feature-branch
   ```

2. Make your changes and commit them:

   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```

3. Push your changes to your fork:

   ```bash
   git push origin my-feature-branch
   ```

4. Open a pull request on GitHub to the `main` branch of the upstream repository:
   [https://github.com/stainless-code/react-modal-manager/pulls](https://github.com/stainless-code/react-modal-manager/pulls)

---

## Thank You!

Your contributions are valued and appreciated! If you encounter any issues or need guidance, feel free to open an issue or contact us at [sebastian.sutu@stainless-code.com](mailto:sebastian.sutu@stainless-code.com).
