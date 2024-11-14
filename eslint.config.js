import react from 'eslint-plugin-react';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
    {
        ignores: [
            '**/node_modules/',
            '**/dist/',
            '**/coverage/',
            '**/*.d.ts',
            '**/migrations/*.ts',
        ]
    },
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
        rules: {
            '@typescript-eslint/no-extraneous-class': [
                'error',
                {
                    allowWithDecorator: true,
                },
            ]
        }
    },
    prettierConfig,
    {
        files: ['apps/frontend/**/*.{ts,tsx}'],
        ignores: ['**/node_modules/'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
        },
    }
);