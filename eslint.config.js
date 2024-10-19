import react from 'eslint-plugin-react';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import typescript from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', '**/*.d.ts'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettierPlugin,
      react,
    },
    rules: {
      ...prettier.rules, // Integrate Prettier rules
      'no-unused-vars': 'warn', // Warn on unused variables
      'react/jsx-uses-react': 'error', // Ensure React variables are used properly
      'react/jsx-uses-vars': 'error', // Prevent React components from being incorrectly marked as unused
      '@typescript-eslint/no-explicit-any': 'error', // Discourage the use of "any" type
      '@typescript-eslint/explicit-module-boundary-types': 'error', // Enforce specifying return types for functions
      'quotes': ['error', 'single', { avoidEscape: true }], // Enforce single quotes, allow escaping
      'semi': ['error', 'always'], // Require semicolons at the end of statements
      'eqeqeq': ['error', 'always'], // Encourage using strict equality
      'prettier/prettier': 'error', // Ensure Prettier formatting is enforced
    },
  },
];