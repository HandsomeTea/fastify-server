import tseslint from 'typescript-eslint';
import globals from 'globals';
import unusedImports from 'eslint-plugin-unused-imports';
import prettierConfig from 'eslint-config-prettier';

export default [
    {
        ignores: ['dist/', 'node_modules/', 'coverage/']
    },
    ...tseslint.configs.recommended,
    ...tseslint.configs.strict,
    {
        files: ['**/*.ts'], // 仅对 TS 文件启用检查
        languageOptions: {
            parserOptions: {
                project: './tsconfig.eslint.json',
                tsconfigRootDir: import.meta.dirname
            },
            globals: {
                ...globals.node,
                ...globals.es2025
            }
        },
        plugins: {
            'unused-imports': unusedImports
        },
        rules: {
            // 1. 允许为了方便临时关闭检查，但生产环境建议 warn
            '@typescript-eslint/ban-ts-comment': 'off',

            // 2. 自动化清理（核心推荐）
            'unused-imports/no-unused-imports': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true }
            ],

            // 3. 逻辑安全
            'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
            'eqeqeq': ['error', 'always', { null: 'ignore' }],
            'curly': ['error', 'all'],
            'no-unused-expressions': 'error',
            'no-use-before-define': 'off',

            // 4. 彻底关掉没必要的
            'no-undef': 'off',
            'require-atomic-updates': 'off',
            'init-declarations': 'off',
            'camelcase': 'off', // 适配 S3/Ceph 等下划线 API
        }
    },
    prettierConfig
];
