const slugify = require('slugify');

module.exports = (text) => slugify(String(text || ''), { lower: true, strict: true, locale: 'tr' });
