import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,
  rules: {
    'brace-style': 'off',
    '@typescript-eslint/brace-style': 'off',
    'no-console': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'vue/no-unused-vars': 'warn',
    'eslint-comments/no-unlimited-disable': 'off',
    'curly': 'off',
    'antfu/if-newline': 'off',
    'vue/no-unused-components': 'warn',
    // 'vue/v-on-event-hyphenation': ['error', 'always', {
    //   autofix: true,
    //   ignore: [],
    // }],
    'no-new': 'off',
    'node/prefer-global/process': 'off',
    'unused-imports/no-unused-vars': 'warn',
    'no-invalid-position-declaration': 'off',
    // 'no-unused-imports': 'warn',
  },
  ignores: ['node_modules', 'dist', 'stats.html', '.vscode', '*.md'],
})
