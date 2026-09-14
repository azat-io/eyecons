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
  floatPrecision: 2,
  multipass: true,
}
