# React JS

**Project Overview:**

This project is a modern React 18+ application using TypeScript, Vite, and a modular, feature-based folder structure. It is set up for scalable development with strong linting, formatting, and testing standards.

**Key Technologies & Tools:**

- React 18, React Router v6, Redux Toolkit
- TypeScript (strict mode)
- Vite (fast dev/build tool)
- ESLint (with @typescript-eslint, Prettier integration)
- Prettier (auto-formatting)
- Jest & React Testing Library (unit/integration tests)
- Husky (git hooks)
- Tailwind CSS (optional, see config)

**Scripts:**

- `npm run dev` — Start local development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint
- `npm run lint:fix` — Auto-fix lint issues
- `npm run format` — Format code with Prettier
- `npm test` — Run all tests
- `npm run test:watch` — Watch mode for tests
- `npm run test:coverage` — Test coverage report

**Word of Caution:**

- Always use feature/bugfix branches; never commit directly to `main` or `dev`.
- Ensure all code passes lint, type checks, and tests before pushing or opening a PR.
- Do not commit secrets or sensitive data. Check `.env*` and `.gitignore`.
- Follow the [CONTRIBUTING.md](CONTRIBUTING.md) and code review process.
- This project enforces strict linting and formatting—commits that do not pass checks will be rejected.

For more, see below and the [CONTRIBUTING.md](CONTRIBUTING.md).

## Directory Structure

```text
.
├── .vscode/               # Editor-specific settings
├── .env.development       # Environment variables
├── .env.production
├── .gitignore             # Git ignore file
├── jsconfig.json          # Or tsconfig.json for TypeScript
├── package.json           # Project dependencies
├── README.md              # Project documentation
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # Typescript CSS configuration
├── test/                  # Test files and configurations or 'spec' folder
└── src/                   # All application source code
  ├── features/            # Code organized by business feature or domain
    ├── auth/                  # Authentication feature (e.g., login, register)
    │   ├── components/        # Components used only within the 'auth' feature
    │   │   ├── LoginForm.tsx
    │   │   └── AuthForm.css
    │   ├── api/               # API service calls for authentication
    │   │   └── auth-api.ts
    │   ├── hooks/             # Custom hooks for the 'auth' feature
    │   │   └── useAuth.ts
    │   ├── pages/             # Pages or views for this feature
    │   │   └── LoginPage.tsx
    │   ├── types/             # TypeScript types specific to 'auth'
    │   │   └── auth-types.ts
    │   └── index.ts           # Barrel file to export public API of the feature
    ├── products/              # Product management feature
    │   ├── components/
    │   │   ├── ProductList.tsx
    │   │   └── ProductCard.tsx
    │   ├── api/
    │   │   └── products-api.ts
    │   ├── hooks/
    │   │   └── useProducts.ts
    │   ├── pages/
    │   │   ├── ProductPage.tsx
    │   │   └── ProductsPage.tsx
    │   └── index.ts
    └── settings/            # User settings feature
        └── ...
  ├── shared/                # Global components, hooks, and utilities
    ├── components/          # UI components that can be used anywhere
    │   ├── Button/
    │   │   ├── Button.tsx
    │   │   └── Button.css
    │   ├── Modal/
    │   │   └── Modal.tsx
    │   └── ui/                # Sub-folder for primitive UI components
    │       └── Card.tsx
    ├── hooks/                 # Reusable custom hooks
    │   └── useDebounce.ts
    ├── layouts/               # High-level layout components (Header, Sidebar)
    │   ├── AppLayout.tsx
    │   └── AuthLayout.tsx
    └── utils/                 # Reusable helper functions
        ├── formatDate.ts
        └── validation.ts
  ├── app/                     # App-level routing and state management
    ├── providers/             # Global state or context providers
    │   ├── AuthProvider.tsx
    │   └── ThemeProvider.tsx
    ├── routes/                # Route configuration
    │   ├── AppRoutes.tsx
    │   ├── PrivateRoute.tsx
    │   └── PublicRoute.tsx
    ├── store/                 # Global state management (e.g., Redux, Zustand)
    │   ├── store.ts
    │   └── slices/
    │       └── authSlice.ts
    └── App.tsx              # The main component that renders the app
  ├── assets/                # Static assets like images, fonts, and icons
  ├── styles/                # Global styles, variables, and theme definitions
  ├── lib/                   # Third-party library facades or wrappers
  ├── types/                 # Global type definitions (for TypeScript)
  └── main.tsx               # Application entry point
```

## Run the TypeScript React app

Install and run locally:

```bash
npm install
npm run dev
```

### Microsoft SSO (Azure AD) Setup

Create an Azure AD app registration and set environment variables (in `.env.local` at project root):

```bash
VITE_AZURE_CLIENT_ID=your-client-id
VITE_AZURE_TENANT_ID=your-tenant-id
VITE_AZURE_REDIRECT_URI=http://localhost:5173
VITE_AZURE_SCOPES=User.Read
```

Then restart `npm run dev`. The header shows Microsoft Sign-in/Sign-out. The `/` route is protected and will redirect to Microsoft sign-in when unauthenticated.

Run tests:

```bash
npm test
```

## ESLint Configuration

- Uses [ESLint](https://eslint.org/) with [@typescript-eslint](https://typescript-eslint.io/) for TypeScript linting.
- Config file: `tsconfig.eslint.json` extends `tsconfig.json` and includes both `src` and `test` directories.
- Run linting:

  ```bash
  npm run lint
  ```

- Linting is enforced for `.ts`, `.tsx`, and `.js` files in `src/` and `test/`.

## Prettier Configuration

- Uses [Prettier](https://prettier.io/) for code formatting.
- Prettier is integrated with ESLint (via `eslint-plugin-prettier` if installed).
- Run formatting:

  ```bash
  npm run format
  ```

- Formatting is applied to all source and test files.

## TypeScript Configuration

- TypeScript config: [`tsconfig.json`](tsconfig.json) for main app, [`tsconfig.eslint.json`](tsconfig.eslint.json) for linting.
- Source files: `src/**/*.ts`, `src/**/*.tsx`
- Test files: `test/**/*.ts`, `test/**/*.tsx`, and `src/**/__tests__/*.ts(x)`
- Strict type checking is enabled.
- Supports JSX and React 18+ features.

## Development Guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md) for full contribution and workflow details.

- Use feature branches for new work and bugfixes.
- Write clear, conventional commit messages (see below).
- Ensure all code passes lint, type checks, and tests before PR.
- Follow code review and PR process for all merges to `main` or `dev`.
- Write and maintain tests for all features and bugfixes.
- Use functional components and hooks; keep components focused and reusable.
- Prefer absolute imports for modules.
- Document public APIs and complex logic with comments or JSDoc.

### Branching Strategy

- Use feature branches: `feature-<issue-id>-<feature-name>`
- Use bugfix branches: `bugfix-<issue-id>-<issue-description>`
- Use hotfix branches: `hotfix-<issue-id><issue-description>`
- Use `dev` for ongoing development, `main` for production releases.
- Example: `dev-0001-cleanup-fixes`

### Commit Message Guidelines

- Use clear, descriptive commit messages.
- Format: `<type>(<scope>): <description>`
- Example: `fix(auth): handle login error state`
- Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`

### Code Review Process

- All pull requests require at least one review before merging.
- Use GitHub/GitLab PRs for code review and discussion.
- Ensure all tests and lint checks pass before requesting review.

### Coding Standards

- Follow Airbnb/Google/standard React/TypeScript best practices.
- Use functional components and hooks.
- Keep components small and focused.
- Use absolute imports for modules when possible.
- Write JSDoc/type annotations for public functions and components.

### Testing Guidelines

- Use [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit and integration tests.
- Test files are located in `src/**/__tests__/*.test.tsx` and `test/`.
- Run all tests:

  ```bash
  npm test
  ```

- Write tests for all components, hooks, and utilities.
- Use `MemoryRouter` for components that require routing context in tests.

## Suggested Libraries

- State Management: Redux, Zustand, Recoil
- Routing: React Router
- Form Handling: Formik, React Hook Form
- UI Components: Material-UI, Ant Design, Chakra UI
- Data Fetching: Axios, React Query, SWR
- Animation: Framer Motion, React Spring
- Internationalization: react-i18next, react-intl
- Testing: Jest, React Testing Library, Cypress
- Build Tools: Webpack, Vite, Parcel
- Utility Libraries: Lodash, date-fns, classnames
- Styling: Emotion, Tailwind CSS
- Icons: React Icons, Font Awesome
- Accessibility: React Aria, Reach UI
- Performance Optimization: React.memo, React.lazy, Loadable Components
- Dev Tools: React Developer Tools, Redux DevTools
- Documentation: Storybook, Styleguidist
- Type Checking: PropTypes, TypeScript
- State Management Middleware: Redux Thunk, Redux Saga
- GraphQL: Apollo Client, Relay
- Code Quality: ESLint, Prettier, Husky, Lint-Staged
- Mocking APIs: MSW (Mock Service Worker), Mirage JS
- Image Optimization: Cloudinary, Imgix
- PWA: Workbox, Lighthouse
- WebSockets: Socket.IO, Pusher
- File Uploads: React Dropzone, Uppy
- Date and Time: Day.js
- Charts and Graphs: Recharts, Chart.js
- Maps: React Leaflet, Google Maps React
- Notifications: React Toastify, Notistack
- Drag and Drop: React DnD, react-beautiful-dnd
- Virtualization: react-window, react-virtualized
- Code Splitting: Loadable Components, React.lazy
- State Persistence: redux-persist, localForage
- Authentication: Auth0, Firebase Authentication, Passport.js
- Video Playback: React Player, Video.js
- Audio Playback: React Howler, React Audio Player
- Social Media Integration: react-share, react-social-icons
- Email Integration: EmailJS, SendGrid

>You either die a hero, or you live long enough to see yourself become the villain
> **- Harvey Dent, The Dark Knight**
