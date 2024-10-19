import react from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';
import typescript from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    prettierConfig,
    {
        files: ['**/*.ts', '**/*.tsx'],
        ignores: [
            'node_modules/**',
            'dist/**',
            'coverage/**',
            '**/*.d.ts',
            '**/migrations/*.ts',
        ],
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
            '@typescript-eslint/no-extraneous-class': 'off',
            'react/jsx-uses-react': 'error', // Ensure React variables are used properly
            'react/jsx-uses-vars': 'error', // Prevent React components from being incorrectly marked as unused
        },
    }
);