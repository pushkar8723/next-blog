import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const filename = fileURLToPath(import.meta.url);
const dirName = dirname(filename);

const compat = new FlatCompat({
    baseDirectory: dirName,
});

export default [
    {
        ignores: [
            '.next/**',
            'node_modules/**',
            'out/**',
            'dist/**',
            'build/**',
            'coverage/**',
            '**/*.mjs',
            '**/*.cjs',
        ],
    },
    js.configs.recommended,
    nextPlugin.configs['core-web-vitals'],
    ...compat.config({
        extends: ['airbnb', 'airbnb-typescript', 'plugin:prettier/recommended'],
        plugins: ['react', 'react-hooks', 'jsx-a11y', 'prettier'],
        env: {
            browser: true,
            node: true,
            es2021: true,
        },
        parserOptions: {
            project: [join(dirName, 'tsconfig.json')],
            tsconfigRootDir: dirName,
        },
        settings: {
            react: {
                version: 'detect',
            },
            'import/resolver': {
                node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                },
                typescript: {
                    project: join(dirName, 'tsconfig.json'),
                },
            },
        },
        rules: {
            'prettier/prettier': 'error',
            'react/react-in-jsx-scope': 'off',
            'react/jsx-filename-extension': [
                'warn',
                { extensions: ['.jsx', '.tsx'] },
            ],
            'import/no-unresolved': ['error', { ignore: ['^@/'] }],
            'import/extensions': [
                'error',
                'ignorePackages',
                {
                    js: 'never',
                    jsx: 'never',
                    ts: 'never',
                    tsx: 'never',
                },
            ],
            'import/prefer-default-export': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            // Disable deprecated rules that were removed in TS-ESLint v8
            '@typescript-eslint/no-throw-literal': 'off',
            '@typescript-eslint/lines-between-class-members': 'off',
            // Allow prop spreading for UI component composition patterns
            'react/jsx-props-no-spreading': 'off',
            // Disable for functional components with default parameters
            'react/require-default-props': 'off',
        },
    }),
    {
        files: ['*.ts', '*.tsx'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: join(dirName, 'tsconfig.json'),
                tsconfigRootDir: dirName,
            },
        },
        rules: {
            'react/prop-types': 'off',
            'react/require-default-props': 'off',
        },
    },
];
