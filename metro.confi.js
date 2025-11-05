const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add epub to asset extensions
config.resolver.assetExts.push('epub', 'zip');

// Ensure source extensions don't include epub
config.resolver.sourceExts = config.resolver.sourceExts.filter(
  ext => ext !== 'epub'
);

module.exports = config;