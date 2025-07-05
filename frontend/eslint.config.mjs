import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import storybook from 'eslint-plugin-storybook'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
})

const eslintConfig = [
  ...compat.config({
    extends: ['eslint:recommended', 'next'],
  }),
  ...compat.extends(
    'next',
    'next/core-web-vitals',
    'next/typescript',
    'plugin:@next/next/recommended',
    '@rocketseat/eslint-config/next',
    'eslint:recommended',
  ),
  ...storybook.configs['flat/recommended'],
  {
    rules: {
      '@typescript-eslint/no-unsafe-declaration-merging': 'off',
    },
  },
]

export default eslintConfig
