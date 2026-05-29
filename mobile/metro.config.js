const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Observa apenas mobile/ e shared/ — NÃO aponta para o monorepoRoot inteiro,
// pois isso faria o Metro tentar assistir admin-web/.next (que pode não existir).
config.watchFolders = [
  path.join(monorepoRoot, 'shared'),
];

// Resolve node_modules a partir da raiz do monorepo (onde ficam as deps compartilhadas)
config.resolver.nodeModulesPaths = [
  path.join(projectRoot, 'node_modules'),
  path.join(monorepoRoot, 'node_modules'),
];

module.exports = config;
