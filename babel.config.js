module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './frontend/src',
            '@theme': './frontend/src/theme',
            '@components': './frontend/src/components',
            '@screens': './frontend/src/screens',
            '@navigation': './frontend/src/navigation',
            '@services': './frontend/src/services',
            '@store': './frontend/src/store',
            '@hooks': './frontend/src/hooks',
            '@utils': './frontend/src/utils',
            '@constants': './frontend/src/constants',
            '@types': './frontend/src/types',
            '@validations': './frontend/src/validations',
            '@assets': './frontend/src/assets',
          },
        },
      ],
    ],
  };
};
