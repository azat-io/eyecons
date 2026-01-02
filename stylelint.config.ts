import type { Config } from 'stylelint'

export default {
  ignoreFiles: ['coverage/**/*', 'server/**/*', 'dist/**/*', 'docs/dist/**/*'],
  extends: '@azat-io/stylelint-config',
} satisfies Config
