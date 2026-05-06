import { defineConfig } from 'vite-plus'

const ignoredPaths = ['packages/server/assets/**', '**/.svelte-kit/**', '**/build/**', '**/dist/**']

export default defineConfig({
  fmt: {
    ignorePatterns: ignoredPaths,
    semi: false,
    singleQuote: true,
  },
  lint: {
    ignorePatterns: ignoredPaths,
    categories: {
      correctness: 'error',
      suspicious: 'error',
      perf: 'error',
      pedantic: 'warn',
    },
    rules: {
      'eslint/max-lines': 'off',
      'eslint/max-lines-per-function': 'off',
      'eslint/max-classes-per-file': 'off',
      'unicorn/prefer-native-coercion-functions': 'off',
    },
    options: {
      denyWarnings: true,
      reportUnusedDisableDirectives: 'error',
    },
  },
})
