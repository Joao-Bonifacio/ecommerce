import typescriptEslint from '@typescript-eslint/eslint-plugin'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  {
    ignores: ['**/*.d.ts', '**/node_modules/', '**/*.js']
  },
  ...compat.extends('plugin:@typescript-eslint/recommended', 'prettier', "@rocketseat/eslint-config/node"),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.vitest
      },

      parser: tsParser,
      ecmaVersion: 2018,
      sourceType: 'commonjs',

      parserOptions: {
        source: 'module'
      }
    },

    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'eol-last': ['error', 'always'],
      'no-useless-constructor': 'off',
      'no-new': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/camelcase': 'off'
    }
  }
]