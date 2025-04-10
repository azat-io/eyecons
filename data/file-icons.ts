import type { FileIcon } from '../extension/types/icon'

export let fileIcons: FileIcon[] = [
  {
    extensions: ['applescript', 'ipa'],
    name: 'AppleScript',
    id: 'applescript',
    light: true,
  },
  {
    extensions: ['astro'],
    name: 'Astro',
    id: 'astro',
    light: true,
  },
  {
    extensions: ['mp3', 'flac', 'm4a', 'wma', 'aiff', 'wav'],
    name: 'Audio',
    id: 'audio',
  },
  {
    files: [
      '.babelrc',
      '.babelrc.cjs',
      '.babelrc.js',
      '.babelrc.mjs',
      '.babelrc.json',
      'babel.config.cjs',
      'babel.config.js',
      'babel.config.mjs',
      'babel.config.json',
      'babel-transform.js',
      '.babel-plugin-macrosrc',
      '.babel-plugin-macrosrc.json',
      '.babel-plugin-macrosrc.yaml',
      '.babel-plugin-macrosrc.yml',
      '.babel-plugin-macrosrc.js',
      'babel-plugin-macros.config.js',
    ],
    name: 'Babel',
    id: 'babel',
  },
  {
    files: ['browserslist', '.browserslistrc'],
    name: 'Browserslist',
    id: 'browserslist',
  },
  {
    extensions: ['c'],
    name: 'C',
    id: 'c',
  },
  {
    extensions: ['cc', 'cpp', 'cxx', 'c++', 'cp', 'mm', 'mii', 'ii'],
    name: 'C++',
    id: 'cpp',
  },
  {
    extensions: ['cs', 'csx'],
    name: 'C#',
    id: 'cs',
  },
  {
    extensions: [
      'sh',
      'ksh',
      'csh',
      'tcsh',
      'zsh',
      'bash',
      'bat',
      'cmd',
      'awk',
      'fish',
      'exp',
      'nu',
    ],
    files: ['commit-msg', 'pre-commit', 'pre-push', 'post-merge'],
    name: 'Console',
    id: 'console',
  },
  {
    files: ['.clineignore', '.clinerules'],
    name: 'Cline',
    id: 'cline',
  },
  {
    extensions: ['coffee'],
    name: 'CoffeeScript',
    id: 'coffeescript',
    light: true,
  },
  {
    files: [
      '.commitlintrc',
      '.commitlintrc.js',
      '.commitlintrc.cjs',
      '.commitlintrc.ts',
      '.commitlintrc.cts',
      '.commitlintrc.json',
      '.commitlintrc.yaml',
      '.commitlintrc.yml',
      '.commitlint.yaml',
      '.commitlint.yml',
      'commitlint.config.js',
      'commitlint.config.cjs',
      'commitlint.config.ts',
      'commitlint.config.cts',
    ],
    name: 'CommitLint',
    id: 'commitlint',
  },
  {
    extensions: ['css'],
    name: 'CSS',
    id: 'css',
  },
  {
    files: [
      'dockerignore',
      'dockerfile',
      'docker-compose.yml',
      'docker-compose.yaml',
    ],
    name: 'Docker',
    id: 'docker',
  },
  {
    files: ['.editorconfig', 'editorconfig'],
    name: 'EditorConfig',
    id: 'editorconfig',
  },
  {
    extensions: ['ex', 'exs', 'eex', 'leex', 'heex'],
    name: 'Elixir',
    id: 'elixir',
  },
  {
    extensions: ['elm'],
    name: 'Elm',
    id: 'elm',
  },
  {
    files: [
      '.env.defaults',
      '.env.example',
      '.env.sample',
      '.env.template',
      '.env.schema',
      '.env.local',
      '.env.dev',
      '.env.development',
      '.env.alpha',
      '.env.e2e',
      '.env.qa',
      '.env.dist',
      '.env.prod',
      '.env.production',
      '.env.stg',
      '.env.stage',
      '.env.staging',
      '.env.preview',
      '.env.test',
      '.env.testing',
      '.env.dev.local',
      '.env.development.local',
      '.env.qa.local',
      '.env.prod.local',
      '.env.production.local',
      '.env.stg.local',
      '.env.staging.local',
      '.env.test.local',
      '.env.uat',
      '.vars',
      '.dev.vars',
    ],
    name: 'Environment',
    extensions: ['env'],
    id: 'env',
  },
  {
    files: [
      '.eslintrc.js',
      '.eslintrc.cjs',
      '.eslintrc.yaml',
      '.eslintrc.json',
      '.eslintrc-md.js',
      '.eslintrc-jsdoc.js',
      '.eslintrc',
      '.eslintignore',
      '.eslintcache',
      '.eslint.config.js',
      'eslint.config.js',
      'eslint.config.cjs',
      'eslint.config.mjs',
      'eslint.config.ts',
    ],
    name: 'ESLint',
    id: 'eslint',
    light: true,
  },
  {
    extensions: ['fs', 'fsx', 'fsi', 'fsproj'],
    name: 'F#',
    id: 'fs',
  },
  {
    files: [
      '.git',
      '.gitignore',
      '.gitmessage',
      '.gitignore-global',
      '.gitignore_global',
      '.gitattributes',
      '.gitattributes-global',
      '.gitattributes_global',
      '.gitconfig',
      '.gitmodules',
      '.gitkeep',
      '.keep',
      '.gitpreserve',
      '.gitinclude',
      '.git-blame-ignore',
      '.git-blame-ignore-revs',
      '.git-for-windows-updater',
      'git-history',
    ],
    extensions: ['patch'],
    name: 'Git',
    id: 'git',
  },
  {
    extensions: ['go'],
    name: 'Go',
    id: 'go',
  },
  {
    extensions: ['graphql', 'gql'],
    name: 'GraphQL',
    id: 'graphql',
  },
  {
    files: [
      'gulpfile.js',
      'gulpfile.mjs',
      'gulpfile.ts',
      'gulpfile.cts',
      'gulpfile.mts',
      'gulpfile.babel.js',
    ],
    name: 'Gulp',
    id: 'gulp',
  },
  {
    extensions: ['hs', 'lhs'],
    name: 'Haskell',
    id: 'haskell',
  },
  {
    extensions: ['htm', 'html'],
    name: 'HTML',
    id: 'html',
  },
  {
    extensions: [
      'png',
      'jpeg',
      'jpg',
      'gif',
      'ico',
      'tif',
      'tiff',
      'psd',
      'psb',
      'ami',
      'apx',
      'avif',
      'bmp',
      'bpg',
      'brk',
      'cur',
      'dds',
      'dng',
      'exr',
      'fpx',
      'gbr',
      'img',
      'jbig2',
      'jb2',
      'jng',
      'jxr',
      'pgf',
      'pic',
      'raw',
      'webp',
      'eps',
      'afphoto',
      'ase',
      'aseprite',
      'clip',
      'cpt',
      'heif',
      'heic',
      'kra',
      'mdp',
      'ora',
      'pdn',
      'reb',
      'sai',
      'tga',
      'xcf',
      'jfif',
      'ppm',
      'pbm',
      'pgm',
      'pnm',
      'icns',
    ],
    name: 'Image',
    id: 'image',
  },
  {
    extensions: ['java', 'jsp'],
    name: 'Java',
    id: 'java',
  },
  {
    extensions: ['js', 'cjs', 'mjs', 'es'],
    name: 'JavaScript',
    id: 'javascript',
  },
  {
    files: [
      'jest.config.js',
      'jest.config.cjs',
      'jest.config.mjs',
      'jest.config.ts',
      'jest.config.cts',
      'jest.config.mts',
      'jest.config.json',
      'jest.e2e.config.js',
      'jest.e2e.config.cjs',
      'jest.e2e.config.mjs',
      'jest.e2e.config.ts',
      'jest.e2e.config.cts',
      'jest.e2e.config.mts',
      'jest.e2e.config.json',
      'jest.e2e.json',
      'jest-unit.config.js',
      'jest-e2e.config.js',
      'jest-e2e.config.cjs',
      'jest-e2e.config.mjs',
      'jest-e2e.config.ts',
      'jest-e2e.config.cts',
      'jest-e2e.config.mts',
      'jest-e2e.config.json',
      'jest-e2e.json',
      'jest-github-actions-reporter.js',
      'jest.setup.js',
      'jest.setup.ts',
      'jest.json',
      '.jestrc',
      '.jestrc.js',
      '.jestrc.json',
      'jest.teardown.js',
    ],
    name: 'Jest',
    id: 'jest',
  },
  {
    extensions: ['json', 'jsonc', 'json5'],
    name: 'JSON',
    id: 'json',
  },
  {
    files: [
      'knip.json',
      'knip.jsonc',
      '.knip.json',
      '.knip.jsonc',
      'knip.ts',
      'knip.js',
      'knip.config.ts',
      'knip.config.js',
    ],
    name: 'Knip',
    id: 'knip',
  },
  {
    files: [
      'copying',
      'copying.md',
      'copying.rst',
      'copying.txt',
      'copyright',
      'copyright.md',
      'copyright.rst',
      'copyright.txt',
      'license',
      'license-agpl',
      'license-apache',
      'license-bsd',
      'license-mit',
      'license-gpl',
      'license-lgpl',
      'license.md',
      'license.rst',
      'license.txt',
      'licence',
      'licence-agpl',
      'licence-apache',
      'licence-bsd',
      'licence-mit',
      'licence-gpl',
      'licence-lgpl',
      'licence.md',
      'licence.rst',
      'licence.txt',
    ],
    name: 'License',
    id: 'license',
  },
  {
    extensions: ['less'],
    name: 'Less',
    id: 'less',
  },
  {
    extensions: ['md', 'markdown', 'rst'],
    name: 'Markdown',
    id: 'markdown',
  },
  {
    extensions: ['mdx'],
    name: 'MDX',
    id: 'mdx',
  },
  {
    files: [
      '.nano-staged.js',
      'nano-staged.js',
      '.nano-staged.cjs',
      'nano-staged.cjs',
      '.nano-staged.mjs',
      'nano-staged.mjs',
      '.nano-staged.json',
      'nano-staged.json',
      '.nanostagedrc',
    ],
    name: 'Nano Staged',
    id: 'nano-staged',
    light: true,
  },
  {
    files: ['netlify.json', 'netlify.yml', 'netlify.yaml', 'netlify.toml'],
    name: 'Netlify',
    id: 'netlify',
  },
  {
    extensions: ['nginx', 'nginxconfig'],
    files: ['nginx.conf'],
    name: 'Nginx',
    id: 'nginx',
  },
  {
    files: [
      'package.json',
      'package-lock.json',
      '.nvmrc',
      '.esmrc',
      '.node-version',
    ],
    name: 'NodeJS',
    id: 'nodejs',
    light: true,
  },
  {
    files: ['.npmignore', '.npmrc'],
    name: 'npm',
    id: 'npm',
  },
  {
    extensions: ['pl', 'pm', 'raku'],
    name: 'Perl',
    id: 'perl',
  },
  {
    extensions: ['php'],
    name: 'PHP',
    id: 'php',
  },
  {
    files: ['pnpm-lock.yaml', 'pnpm-workspace.yaml', '.pnpmfile.cjs'],
    name: 'pnpm',
    light: true,
    id: 'pnpm',
  },
  {
    extensions: ['pcss', 'postcss'],
    name: 'PostCSS',
    id: 'postcss',
    light: true,
  },
  {
    files: [
      '.prettierrc',
      'prettier.config.js',
      'prettier.config.cjs',
      '.prettierrc.js',
      '.prettierrc.cjs',
      '.prettierrc.json',
      '.prettierrc.json5',
      '.prettierrc.yaml',
      '.prettierrc.yml',
      '.prettierignore',
      '.prettierrc.toml',
    ],
    name: 'Prettier',
    id: 'prettier',
    light: true,
  },
  {
    extensions: ['py', 'pyc', 'pyd', 'pyo', 'pyw', 'pyz', 'pyi'],
    name: 'Python',
    id: 'python',
    light: true,
  },
  {
    extensions: ['jsx', 'tsx'],
    name: 'React',
    id: 'react',
  },
  {
    files: ['readme.md', 'readme.rst', 'readme.txt', 'readme'],
    name: 'Readme',
    id: 'readme',
  },
  {
    extensions: ['rs', 'ron'],
    name: 'Rust',
    id: 'rust',
  },
  {
    extensions: ['sass', 'scss'],
    name: 'Sass',
    id: 'sass',
  },
  {
    extensions: ['scala', 'sc'],
    name: 'Scala',
    id: 'scala',
  },
  {
    extensions: [
      'stories.js',
      'stories.jsx',
      'stories.mdx',
      'story.js',
      'story.jsx',
      'stories.ts',
      'stories.tsx',
      'story.ts',
      'story.tsx',
      'stories.svelte',
      'story.mdx',
    ],
    name: 'Storybook',
    id: 'storybook',
  },
  {
    files: [
      '.stylelintrc',
      'stylelint.config.js',
      'stylelint.config.cjs',
      '.stylelintrc.json',
      '.stylelintrc.yaml',
      '.stylelintrc.yml',
      '.stylelintrc.js',
      '.stylelintrc.cjs',
      '.stylelintignore',
      '.stylelintcache',
    ],
    name: 'StyleLint',
    id: 'stylelint',
    light: true,
  },
  {
    extensions: ['styl'],
    name: 'Stylus',
    id: 'stylus',
  },
  {
    extensions: ['svelte'],
    name: 'Svelte',
    id: 'svelte',
  },
  {
    extensions: ['svg'],
    name: 'SVG',
    id: 'svg',
  },
  {
    files: ['svgo.config.js', 'svgo.config.cjs', 'svgo.config.mjs'],
    name: 'SVGO',
    id: 'svgo',
  },
  {
    extensions: ['swift'],
    name: 'Swift',
    id: 'swift',
  },
  {
    files: [
      'tailwind.js',
      'tailwind.ts',
      'tailwind.config.js',
      'tailwind.config.cjs',
      'tailwind.config.ts',
      'tailwind.config.cts',
    ],
    name: 'Tailwind',
    id: 'tailwind',
  },
  {
    extensions: ['toml'],
    name: 'TOML',
    id: 'toml',
  },
  {
    extensions: ['ts', 'cts', 'mts'],
    name: 'TypeScript',
    id: 'typescript',
  },
  {
    extensions: ['v', 'vsh'],
    name: 'V',
    id: 'v',
  },
  {
    files: ['vercel.json', '.vercelignore', 'now.json', '.nowignore'],
    name: 'Vercel',
    id: 'vercel',
    light: true,
  },
  {
    files: [
      'vite.config.js',
      'vite.config.mjs',
      'vite.config.cjs',
      'vite.config.ts',
      'vite.config.cts',
      'vite.config.mts',
      'vite.config.documentation.ts',
      'vite.config.extension.ts',
      'vite.config.preview.ts',
    ],
    name: 'Vite',
    id: 'vite',
  },
  {
    files: [
      'vitest.config.ts',
      'vitest.config.mts',
      'vitest.config.cts',
      'vitest.config.js',
      'vitest.config.mjs',
      'vitest.config.cjs',
    ],
    name: 'Vitest',
    id: 'vitest',
  },
  {
    extensions: [
      'vscodeignore',
      'vsixmanifest',
      'vsix',
      'code-workplace',
      'code-workspace',
      'code-profile',
      'code-snippets',
    ],
    name: 'VS Code',
    id: 'vscode',
  },
  {
    extensions: ['vue'],
    name: 'Vue',
    light: true,
    id: 'vue',
  },
  {
    files: [
      'webpack.js',
      'webpack.cjs',
      'webpack.mjs',
      'webpack.ts',
      'webpack.cts',
      'webpack.mts',
      'webpack.base.js',
      'webpack.base.cjs',
      'webpack.base.mjs',
      'webpack.base.ts',
      'webpack.base.cts',
      'webpack.base.mts',
      'webpack.config.js',
      'webpack.config.cjs',
      'webpack.config.mjs',
      'webpack.config.ts',
      'webpack.config.cts',
      'webpack.config.mts',
      'webpack.common.js',
      'webpack.common.cjs',
      'webpack.common.mjs',
      'webpack.common.ts',
      'webpack.common.cts',
      'webpack.common.mts',
      'webpack.config.common.js',
      'webpack.config.common.cjs',
      'webpack.config.common.mjs',
      'webpack.config.common.ts',
      'webpack.config.common.cts',
      'webpack.config.common.mts',
      'webpack.config.common.babel.js',
      'webpack.config.common.babel.ts',
      'webpack.dev.js',
      'webpack.dev.cjs',
      'webpack.dev.mjs',
      'webpack.dev.ts',
      'webpack.dev.cts',
      'webpack.dev.mts',
      'webpack.development.js',
      'webpack.development.cjs',
      'webpack.development.mjs',
      'webpack.development.ts',
      'webpack.development.cts',
      'webpack.development.mts',
      'webpack.config.dev.js',
      'webpack.config.dev.cjs',
      'webpack.config.dev.mjs',
      'webpack.config.dev.ts',
      'webpack.config.dev.cts',
      'webpack.config.dev.mts',
      'webpack.config.dev.babel.js',
      'webpack.config.dev.babel.ts',
      'webpack.mix.js',
      'webpack.mix.cjs',
      'webpack.mix.mjs',
      'webpack.mix.ts',
      'webpack.mix.cts',
      'webpack.mix.mts',
      'webpack.prod.js',
      'webpack.prod.cjs',
      'webpack.prod.mjs',
      'webpack.prod.ts',
      'webpack.prod.cts',
      'webpack.prod.mts',
      'webpack.prod.config.js',
      'webpack.prod.config.cjs',
      'webpack.prod.config.mjs',
      'webpack.prod.config.ts',
      'webpack.prod.config.cts',
      'webpack.prod.config.mts',
      'webpack.production.js',
      'webpack.production.cjs',
      'webpack.production.mjs',
      'webpack.production.ts',
      'webpack.production.cts',
      'webpack.production.mts',
      'webpack.server.js',
      'webpack.server.cjs',
      'webpack.server.mjs',
      'webpack.server.ts',
      'webpack.server.cts',
      'webpack.server.mts',
      'webpack.client.js',
      'webpack.client.cjs',
      'webpack.client.mjs',
      'webpack.client.ts',
      'webpack.client.cts',
      'webpack.client.mts',
      'webpack.config.server.js',
      'webpack.config.server.cjs',
      'webpack.config.server.mjs',
      'webpack.config.server.ts',
      'webpack.config.server.cts',
      'webpack.config.server.mts',
      'webpack.config.client.js',
      'webpack.config.client.cjs',
      'webpack.config.client.mjs',
      'webpack.config.client.ts',
      'webpack.config.client.cts',
      'webpack.config.client.mts',
      'webpack.config.production.babel.js',
      'webpack.config.production.babel.ts',
      'webpack.config.prod.babel.js',
      'webpack.config.prod.babel.cjs',
      'webpack.config.prod.babel.mjs',
      'webpack.config.prod.babel.ts',
      'webpack.config.prod.babel.cts',
      'webpack.config.prod.babel.mts',
      'webpack.config.prod.js',
      'webpack.config.prod.cjs',
      'webpack.config.prod.mjs',
      'webpack.config.prod.ts',
      'webpack.config.prod.cts',
      'webpack.config.prod.mts',
      'webpack.config.production.js',
      'webpack.config.production.cjs',
      'webpack.config.production.mjs',
      'webpack.config.production.ts',
      'webpack.config.production.cts',
      'webpack.config.production.mts',
      'webpack.config.staging.js',
      'webpack.config.staging.cjs',
      'webpack.config.staging.mjs',
      'webpack.config.staging.ts',
      'webpack.config.staging.cts',
      'webpack.config.staging.mts',
      'webpack.config.babel.js',
      'webpack.config.babel.ts',
      'webpack.config.base.babel.js',
      'webpack.config.base.babel.ts',
      'webpack.config.base.js',
      'webpack.config.base.cjs',
      'webpack.config.base.mjs',
      'webpack.config.base.ts',
      'webpack.config.base.cts',
      'webpack.config.base.mts',
      'webpack.config.staging.babel.js',
      'webpack.config.staging.babel.ts',
      'webpack.config.coffee',
      'webpack.config.test.js',
      'webpack.config.test.cjs',
      'webpack.config.test.mjs',
      'webpack.config.test.ts',
      'webpack.config.test.cts',
      'webpack.config.test.mts',
      'webpack.config.vendor.js',
      'webpack.config.vendor.cjs',
      'webpack.config.vendor.mjs',
      'webpack.config.vendor.ts',
      'webpack.config.vendor.cts',
      'webpack.config.vendor.mts',
      'webpack.config.vendor.production.js',
      'webpack.config.vendor.production.cjs',
      'webpack.config.vendor.production.mjs',
      'webpack.config.vendor.production.ts',
      'webpack.config.vendor.production.cts',
      'webpack.config.vendor.production.mts',
      'webpack.test.js',
      'webpack.test.cjs',
      'webpack.test.mjs',
      'webpack.test.ts',
      'webpack.test.cts',
      'webpack.test.mts',
      'webpack.dist.js',
      'webpack.dist.cjs',
      'webpack.dist.mjs',
      'webpack.dist.ts',
      'webpack.dist.cts',
      'webpack.dist.mts',
      'webpackfile.js',
      'webpackfile.cjs',
      'webpackfile.mjs',
      'webpackfile.ts',
      'webpackfile.cts',
      'webpackfile.mts',
    ],
    name: 'Webpack',
    id: 'webpack',
    light: true,
  },
  {
    extensions: [
      'xml',
      'plist',
      'xsd',
      'dtd',
      'xsl',
      'xslt',
      'resx',
      'iml',
      'xquery',
      'tmLanguage',
      'manifest',
      'project',
      'xml.dist',
      'xml.dist.sample',
      'dmn',
      'jrxml',
    ],
    files: ['.htaccess'],
    name: 'XML',
    id: 'xml',
  },
  {
    extensions: ['yaml', 'yml'],
    name: 'Yaml',
    id: 'yaml',
  },
  {
    files: [
      '.yarnrc',
      'yarn.lock',
      '.yarnclean',
      '.yarn-integrity',
      'yarn-error.log',
      '.yarnrc.yml',
      '.yarnrc.yaml',
    ],
    name: 'Yarn',
    id: 'yarn',
  },
  {
    extensions: ['zig', 'zir', 'zigr', 'zon'],
    name: 'Zig',
    id: 'zig',
  },
]
