# Contributing Guidelines

Thank you for considering contributing to this project! Please follow these guidelines to help us maintain a high-quality codebase and smooth workflow.

## Getting Started

1. **Fork the repository** and clone your fork locally.
2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a branch** for your feature or fix:

   ```bash
   git checkout -b feature-<issue-id>-<your-feature-name>
   # or for bugfixes
   git checkout -b bugfix-<issue-id>-<your-bug-description>
   # or for hotfix
   git checkout -b hotfix-<issue-id>-<your-bug-description>
   # or for development
   git checkout -b dev-<issue-id>-<your-dev-description>
   ```

## Development Workflow

- Write clear, descriptive commit messages (see below).
- Keep pull requests focused and small; one feature or fix per PR.
- Ensure all code passes lint, type checks, and tests before submitting a PR:

  ```bash
  npm run lint
  npm run type-check
  npm test
  ```

- Add or update tests for any code changes.
- Document new features or changes in the README if needed.

## Commit Message Format

- Use the format: `<type>(<scope>): <description>`
- Example: `feat(auth): add login error handling`
- Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`

## Pull Request Process

1. Push your branch to your fork.
2. Open a pull request (PR) against the `dev` branch.
3. Fill out the PR template and describe your changes.
4. Request a review from a maintainer.
5. Address any review comments and update your PR as needed.
6. PRs require at least one approval and passing checks before merge.

## Coding Standards

- Use functional React components and hooks.
- Keep components small and focused.
- Use absolute imports where possible.
- Write JSDoc/type annotations for public functions and components.
- Follow the project's ESLint and Prettier rules.

## Testing

- Use Jest and React Testing Library for unit/integration tests.
- Place test files alongside source or in `__tests__` folders.
- Ensure all tests pass before submitting a PR.

## Need Help?

If you have questions, open an issue or ask in the project discussions.
