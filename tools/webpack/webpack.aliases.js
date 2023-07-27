const { createWebpackAliases } = require('./webpack.helpers');

// Export aliases
module.exports = createWebpackAliases({
  '@images': 'assets/images',
  '@config': 'src/renderer/components/config',
  '@commonrenderer': 'src/renderer/components/common',
  '@context': 'src/renderer/components/context',
  '@image': 'src/renderer/components/image',
  '@text': 'src/renderer/components/text',
  '@components': 'src/renderer/components',
  '@common': 'src/common',
  '@main': 'src/main',
  '@renderer': 'src/renderer',
  '@src': 'src',
  '@misc': 'misc',
});
