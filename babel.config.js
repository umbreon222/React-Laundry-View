module.exports = (api) => {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
    ],
    plugins: [
      'transform-optional-chaining',
    ],
  };
};
