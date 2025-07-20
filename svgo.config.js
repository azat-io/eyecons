module.exports = {
  plugins: [
    'preset-default',
    'convertStyleToAttrs',
    'removeOffCanvasPaths',
    'removeStyleElement',
    'removeDimensions',
    'removeScripts',
    'reusePaths',
    'sortAttrs',
  ],
  multipass: true,
  precision: 2,
}
