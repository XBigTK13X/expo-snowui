module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV);

  const isTest = process.env.NODE_ENV === 'test';

  return {
    presets: ['babel-preset-expo'],
    ...(!isTest && {
      overrides: [
        {
          exclude: /\/node_modules\//,
          presets: ['module:react-native-builder-bob/babel-preset'],
        },
      ],
    }),
  };
};