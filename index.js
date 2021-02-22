// main application

'use strict';

const
  // default HTTP port
  port = process.env.NODE_PORT || 8104,

  // express
  express = require('express'),
  app = express(),

  // page counter object
  pagehit = new (require('./lib/pagehit'))();


// header middleware
app.use((req, res, next) => {

  res.set({
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'must-revalidate, max-age=0'
  });
  next();

});

// page count middleware
app.use(async (req, res, next) => {

  // get hit count
  req.count = await pagehit.count(req);

  if (req.count) {
    next();
  }
  else {
    res.status(400).send('No referrer');
  }

});

// JSON response
app.get('/hit.json', (req, res) => {
  res.json({ hit: req.count });
});

// JavaScript document.write() response
app.get('/hit.js', (req, res) => {

  res
    .set('Content-Type', 'application/javascript')
    .send(`document.write('<span class="pagehitjs">${ req.count }</span>');`);

});

// JavaScript deferred DOM update response
app.get('/hit-defer.js', (req, res) => {

  res
    .set('Content-Type', 'application/javascript')
    .send(`window.addEventListener('DOMContentLoaded',()=>{let c=document.querySelectorAll('script[src$="/hit-defer.js"]');for(let i=0;i<c.length;i++)c[i].insertAdjacentHTML('afterend','<span class="pagehitdefer">${ req.count }</span>');});`);

});

// SVG response
app.get('/hit.svg', (req, res) => {

  res
    .set('Content-Type', 'image/svg+xml')
    .send(`<svg xmlns="http://www.w3.org/2000/svg" width="${ String(req.count).length * 0.6 }em" height="1em"><text x="50%" y="75%" font-family="sans-serif" font-size="1em" text-anchor="middle" dominant-baseline="middle">${ req.count }</text></svg>`);

});

// start HTTP server
app.listen(port, () =>
  console.log(`page hit web service running on port ${port}`)
);
