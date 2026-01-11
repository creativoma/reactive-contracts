import packageJson from '../../../package.json';

export const projectConfig = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  license: packageJson.license,
  author: packageJson.author,
  repository: {
    url: 'https://github.com/creativoma/reactive-contracts',
    issues: 'https://github.com/creativoma/reactive-contracts/issues',
    contributing: 'https://github.com/creativoma/reactive-contracts/blob/main/CONTRIBUTING.md',
  },
  npm: {
    core: 'https://npmjs.com/package/@reactive-contracts/core',
    react: 'https://npmjs.com/package/@reactive-contracts/react',
    server: 'https://npmjs.com/package/@reactive-contracts/server',
    compiler: 'https://npmjs.com/package/@reactive-contracts/compiler',
  },
  examples: {
    basicUsage: 'https://github.com/creativoma/reactive-contracts/tree/main/examples/basic-usage',
    nextjs: 'https://github.com/creativoma/reactive-contracts/tree/main/examples/with-nextjs',
    vite: 'https://github.com/creativoma/reactive-contracts/tree/main/examples/with-vite',
    astro: 'https://github.com/creativoma/reactive-contracts/tree/main/examples/with-astro',
  },
} as const;

export const getVersionBadge = () => `v${projectConfig.version}`;

export const isPreRelease = () =>
  projectConfig.version.includes('beta') ||
  projectConfig.version.includes('alpha') ||
  projectConfig.version.includes('rc');
