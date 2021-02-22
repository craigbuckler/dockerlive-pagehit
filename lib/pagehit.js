/*
page hit object
call count() method to increment counter and return total hits

Count data is stored in a MySQL database named `pagehit` in the `hit` table.
Execute init.sql on first use.
*/

'use strict';

const
  // modules
  httpReferrer = require('./httpreferrer'),

  // MySQL
  mysql = require('mysql2/promise'),
  db    = mysql.createPool({
    host:     process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user:     process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });


module.exports = class {

  #ready = false;

  // initialise database
  async init() {

    try {

      // create hit table
      console.log('initialising database...');

      await db.execute(
        `CREATE TABLE IF NOT EXISTS hit (
          id bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'record ID',
          hash binary(16) NOT NULL COMMENT 'URL hash',
          ip int(4) unsigned DEFAULT NULL COMMENT 'client IP address',
          ua varchar(200) DEFAULT NULL COMMENT 'client useragent string',
          time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'hit time',
          PRIMARY KEY (id),
          KEY hash_time (hash,time)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='page hits';`
      );

      this.#ready = true;

      console.log('database initialisation complete');

    }
    catch(err) {
      console.log('database initialisation failed', err);
    }

  }

  // increase URL counter
  async count(req) {

    // initialize DB
    if (!this.#ready) await this.init();

    let
      hash = httpReferrer(req),
      count = null;

    if (!hash) return count;

    // fetch IP address and user agent
    const
      ipRe  = req.ip.match(/(?:\d{1,3}\.){3}\d{1,3}/),
      ip    = ipRe.length ? ipRe[0] : null,
      ua    = req.get('User-Agent') || null;

    try {

      // store page hit
      await db.execute(
        'INSERT INTO `hit` (hash, ip, ua) VALUES (UNHEX(?), INET_ATON(?), ?);',
        [hash, ip, ua]
      );

      // fetch page hit count
      const [res] = await db.query(
        'SELECT COUNT(1) AS `count` FROM `hit` WHERE hash = UNHEX(?);',
        [hash]
      );

      if (res && res[0]) count = res[0].count;

    }
    catch (err) {
      console.log('DB error', err);
    }

    // return counter
    return count;
  }

};
