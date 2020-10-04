/* eslint-disable no-async-promise-executor */
const fs = require('fs');

let Promise;
const squel = require('squel');
const csv = require('csv-parser');
const escapeString = require('sql-string-escape');

const results = [];

exports.setup = (options) => {
  Promise = options.Promise;
};

async function csvparser() {
  await new Promise((resolve) => {
    fs.createReadStream('items.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results));
  });
  return results;
}

exports.up = (db) => new Promise((async (resolve) => {
  const cleanData = await csvparser();
  resolve(cleanData);
}))
  .then((cleanData) => {
    const q = squel.insert({
      stringFormatter(str) {
        return escapeString(str);
      },
    }).into('Items').setFieldsRows(cleanData).toString();
    return db.runSql(q);
  });

exports.down = (db) => new Promise(((resolve) => {
  const data = 'delete from Items';
  return resolve(data);
}))
  .then((data) => db.runSql(data));

exports.meta = {
  version: 1,
};
