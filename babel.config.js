module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', {
        unstable_transformImportMeta: true,
        jsxRuntime: 'automatic'
      }]
    ],
    plugins: [
      ['@babel/plugin-transform-runtime', {
        regenerator: true
      }]
    ]
  };
}; 