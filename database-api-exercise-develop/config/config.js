const fs = require('fs');

const rawdata = fs.readFileSync('database.json');
const connectionString = JSON.parse(rawdata).other;

const promise = require('bluebird');

const options = {
  promiseLib: promise,
};
const pgp = require('pg-promise')(options);

const db = pgp(connectionString);

module.exports = db;
