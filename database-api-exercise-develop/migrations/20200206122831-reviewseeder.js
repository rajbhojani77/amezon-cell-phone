/* eslint-disable no-async-promise-executor */

const fs = require('fs');

let Promise;
const squel = require('squel');
const csv = require('csv-parser');

const results = [];
const escapeString = require('sql-string-escape');
const pool = require('../config/config');

async function csvparser() {
  await new Promise((resolve) => {
    fs.createReadStream('reviews.csv')
      .pipe(csv())
      .on('data', (data) => { results.push(data); })
      .on('end', () => resolve(results));
  });
  return results;
}

exports.setup = (options) => {
  Promise = options.Promise;
};

exports.up = () => new Promise((async (resolve) => {
  const cleanData = await csvparser();
  const res = cleanData.map((r) => {
    const q = squel.insert(
      {
        stringFormatter(str) {
          return escapeString(str);
        },
      },
    ).into('Reviews')
      .set('item_id', squel.select().field('id').from('Items').where(' asin = ?', r.asin))
      .set('user_id', squel.select({
        stringFormatter(str) {
          return escapeString(str);
        },
      }).field('id').from('Users').where(' username = ?', r.name))
      .set('rating', r.rating)
      .set('verified', r.verified)
      .set('title', r.title)
      .set('date', r.date)
      .set('body', r.body)
      .set('helpfulVotes', (r.helpfulVotes) ? r.helpfulVotes : null)
      .toString();
    return pool.query(q, (err) => {
      if (err) {
        throw err;
      }
    });
  });
  return resolve(res);
}));

exports.meta = {
  version: 1,
};

exports.down = (db) => new Promise(((resolve) => {
  const data = 'delete from Reviews';
  resolve(data);
}))
  .then((data) => db.runSql(data));
