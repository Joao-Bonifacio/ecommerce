import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
})

const eslintConfig = [
  {
    ignores: ['**/*.mjs'],
  },
  ...compat.extends(
    'next',
    'next/core-web-vitals',
    'next/typescript',
    'plugin:@next/next/recommended',
    '@rocketseat/eslint-config/next',
    'eslint:recommended',
  ),
]

export default eslintConfig
