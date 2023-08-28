const path = require('path');
module.exports = {
  i18n: {
    locales: ['en', 'vn'],
    defaultLocale: 'vn',
    localeDetection: false,
  },
  localePath: path.resolve('./public/locales'),
};
