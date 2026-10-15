import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'playwright-report', 'test-results'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Features expose a public API through their index.ts; don't reach into another feature's internals.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/*'],
              message: "Import from the feature's public API (e.g. '@/features/posts') instead.",
            },
          ],
        },
      ],
    },
  },
  {
    // Files inside a feature may import their own internals via relative paths; tests and
    // config files are exempt from the fast-refresh rule.
    files: ['**/*.test.{ts,tsx}', 'src/test/**', 'e2e/**', '*.config.ts'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  prettier,
)
