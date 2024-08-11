const eslintConfig = require('@azat-io/eslint-config-typescript')

module.exports = [
  ...eslintConfig,
  {
    rules: {
      'import/no-unresolved': [
        'error',
        { ignore: ['@qwik-client-manifest', '@qwik-city-plan'] },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    ignores: [
      '**/coverage/**/*',
      'eslint.config.js',
      '**/server/**/*',
      '.netlify/**/*',
    ],
  },
]
