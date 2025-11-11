module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
    ecmaVersion: '2017',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
    jest: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
    },
  },
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    '@typescript-eslint',
    'import',
    'unused-imports',
    'prettier',
    'testing-library',
    'jest-dom',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    /* ---------- 🌟 TypeScript ---------- */
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^React$' }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',

    /* ---------- 🌟 React ---------- */
    'react/react-in-jsx-scope': 'off', // React 18: no need to import React
    'react/prop-types': 'off', // using TS types instead
    'react/jsx-uses-react': 'off',
    'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
    'react/no-unescaped-entities': 'off',

    /* ---------- 🌟 React Hooks ---------- */
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    /* ---------- 🌟 Imports ---------- */
    'import/order': [
      'warn',
      {
        groups: [['builtin', 'external', 'internal'], ['parent', 'sibling', 'index']],
        pathGroups: [
          { pattern: 'react', group: 'external', position: 'before' },
          { pattern: '@/**', group: 'internal' },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-unresolved': 'error',
    'import/no-duplicates': 'error',

    /* ---------- 🌟 Code Cleanup ---------- */
    'unused-imports/no-unused-imports': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',

    /* ---------- 🌟 Accessibility ---------- */
    'jsx-a11y/anchor-is-valid': 'warn',

  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.config.js',
    '*.config.cjs',
    'coverage/',
  ],
};
