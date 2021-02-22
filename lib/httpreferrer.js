/*
httpreferrer
returns a 32-character hash of a URL passed as the referrer of an HTTP request header
*/

'use strict';

const
  url = require('url'),
  crypto = require('crypto');

module.exports = (req) => {

  const r = req.headers.referer;
  if (!r || req.originalUrl.endsWith('.ico')) return null;

  const
    u = url.parse(r),
    ref = u.protocol + u.host + u.pathname;

  return ref ? crypto.createHash('md5').update(ref).digest('hex') : null;

};
