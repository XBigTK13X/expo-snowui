module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV);

  const isTest = process.env.NODE_ENV === 'test';

  return {
    presets: ['babel-preset-expo'],
    ...(!isTest && {
      overrides: [
        {
          exclude: (filename) => Boolean(filename && filename.includes('node_modules')),
          presets: ['module:react-native-builder-bob/babel-preset'],
        },
      ],
    }),
  };
};