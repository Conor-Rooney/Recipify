const path = require('path')
module.exports = {
    i18n: {
      defaultLocale: 'en',
      locales: ['en', 'es','de','fr','pt'],
      localePath: path.resolve('./public/locales'),
    },
  };