import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import typescript from '@typescript-eslint/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import parser from '@typescript-eslint/parser';

export default [
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            react,
            reactHooks,
            '@typescript-eslint': typescript,
            'simple-import-sort': simpleImportSort
        },
        rules: {
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'no-console': ['warn', { 'allow': ['info', 'warn', 'error', 'debug'] }],
            'no-debugger': 'error',
            'no-unused-vars': 'off',
            'react-hooks/exhaustive-deps': 'off',
            'react/jsx-max-props-per-line': [1, { 'maximum': 1 }],
            'react/jsx-first-prop-new-line': [2, 'multiline'],
            'react/jsx-filename-extension': ['warn', { 'extensions': ['.tsx'] }],
            'react/jsx-closing-bracket-location': [1, 'line-aligned'],
            'react/no-unescaped-entities': 'off',
            'indent': ['error', 4, {
                'SwitchCase': 1,
                'flatTernaryExpressions': false,
            }],
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            'simple-import-sort/exports': ['warn'],
            'simple-import-sort/imports': [
                'warn',
                {
                    groups: [
                        [
                            '^\\u0000',
                            '^(?!classnames$)(?!.*\\.(module\\.)?(css|scss)$).+',
                            '^classnames$',
                            '\\.(module\\.)?(css|scss)$'
                        ],
                    ]
                }
            ],
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];