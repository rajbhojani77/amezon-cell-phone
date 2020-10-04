/* eslint-disable no-async-promise-executor */
const fs = require('fs');

let Promise;
const squel = require('squel');
const csv = require('csv-parser');
const escapeString = require('sql-string-escape');
const bcrypt = require('bcryptjs');
const uuidv1 = require('uuid/v1');
const pool = require('../config/config');

const set = new Set();

exports.setup = (options) => {
  Promise = options.Promise;
};

async function csvparser() {
  await new Promise((resolve) => {
    fs.createReadStream('reviews.csv')
      .pipe(csv())
      .on('data', (data) => { set.add(data.name); })
      .on('end', () => resolve(set));
  });
  return set;
}


exports.up = () => new Promise((async (resolve, reject) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync('admin', salt);
  pool.query(squel.insert().into('Users').set('username', 'Admin').set('password', hash)
    .set('role_id', 1)
    .toString(), (err) => {
    if (err) {
      reject(err);
    }
  });
  const cleanData = Array.from(await csvparser());
  resolve(cleanData);
}))
  .then((cleanData) => cleanData.map((r) => {
    const q = squel.insert(
      {
        stringFormatter(str) {
          return escapeString(str);
        },
      },
    ).into('Users')
      .set('username', r)
      .set('password', uuidv1())
      .toString();
    return pool.query(q, (err) => {
      if (err) {
        throw err;
      }
    });
  }));

exports.down = (db) => new Promise(((resolve) => {
  const data = 'delete from Users';
  resolve(data);
}))
  .then((data) => db.runSql(data));

exports.meta = {
  version: 1,
};
